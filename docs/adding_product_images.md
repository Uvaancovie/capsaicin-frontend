mr covie — here’s a paste-ready **CONTEXT.md** for your repo that tells Copilot (and any dev) exactly how to add **admin image uploads from a laptop** using **Cloudinary + Express (server.js) + Mongo + Next.js Admin UI**.

---

# CONTEXT — Admin uploads (Cloudinary) for CapePharm

**Goal**
Allow an **Admin** to create/modify products and upload images directly from their laptop. Files must **not** be stored on server disk (Render is ephemeral). Images go to **Cloudinary CDN**, and we store the returned `secure_url` values in Mongo (`products.imageUrls[]`).

**Stack**

* Backend: **Express** (`server.js`), Mongo/Mongoose
* Frontend: **Next.js** (Admin dashboard)
* Storage/CDN: **Cloudinary**

---

## 0) Environment (Render → *Environment Variables*)

> ⚠️ These keys were pasted in chat. **Rotate your API Secret after testing.**

**Use *either* the 3-var config OR the single `CLOUDINARY_URL` (not both).**
Recommended: use the 3 variables.

```bash
# ✅ preferred (3 separate vars)
CLOUDINARY_CLOUD_NAME=dir468aeq
CLOUDINARY_API_KEY=567492275995479
CLOUDINARY_API_SECRET=REPLACE_WITH_ROTATED_SECRET

# ❌ if you choose URL form instead (don’t set both styles):
# CLOUDINARY_URL=cloudinary://567492275995479:REAL_SECRET@dir468aeq

# CORS allow-list for admin UIs
ADMIN_ORIGINS=https://www.capepharm.co.za,https://capsaicin-frontend.vercel.app
```

Install deps (backend):

```bash
npm i cloudinary multer multer-storage-cloudinary
```

---

## 1) Product schema

```js
// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  sku:         { type: String, unique: true, index: true },
  price:       { type: Number, required: true },   // Rands
  description: String,
  category:    { type: String, default: "jewellery" },
  imageUrls:   { type: [String], default: [] },    // Cloudinary secure URLs
  imageAlts:   { type: [String], default: [] },    // optional, align with imageUrls
  createdAt:   { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
```

---

## 2) `server.js` — CORS, Cloudinary, multer, routes

```js
// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Product from "./models/Product.js";

dotenv.config();

const app = express();

/* ---------- CORS (admin origins only) ---------- */
const allowed = (process.env.ADMIN_ORIGINS || "")
  .split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    cb(null, allowed.includes(origin));
  },
  credentials: true,
  methods: ["GET","POST","PUT"]
}));
app.use(express.json());

/* ---------- Mongo ---------- */
mongoose.connect(process.env.MONGODB_URI);

/* ---------- Cloudinary ---------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Store in folder, convert to webp, limit size, auto quality
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "capepharm/products",
    format: "webp",
    resource_type: "image",
    transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto" }]
  })
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(png|jpe?g|webp)$/i.test(file.mimetype);
    cb(ok ? null : new Error("Only PNG/JPEG/WEBP allowed"), ok);
  }
});

/* ---------- Auth guard (replace with real admin check) ---------- */
const requireAdmin = (req, res, next) => { next(); };

/* ---------- Routes ---------- */

// Create product + upload images
app.post("/admin/products", requireAdmin, upload.array("images", 6), async (req, res) => {
  try {
    const { name, sku, price, description, category } = req.body;
    const imageUrls = (req.files || []).map(f => f.path); // Cloudinary secure_url
    const imageAlts = (req.body.imageAlts ? [].concat(req.body.imageAlts) : []).slice(0, imageUrls.length);

    const product = await Product.create({
      name, sku, price: Number(price), description, category, imageUrls, imageAlts
    });
    res.json({ ok: true, product });
  } catch (e) {
    console.error(e);
    res.status(400).json({ ok:false, error: e.message });
  }
});

// Append/replace images on existing product
app.post("/admin/products/:id/images", requireAdmin, upload.array("images", 6), async (req, res) => {
  try {
    const imageUrls = (req.files || []).map(f => f.path);
    if (!imageUrls.length) return res.status(400).json({ ok:false, error:"No images uploaded" });

    const mode = req.query.mode || "append"; // "append" | "replace"
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ ok:false, error:"Product not found" });

    if (mode === "replace") prod.imageUrls = imageUrls;
    else prod.imageUrls.push(...imageUrls);

    await prod.save();
    res.json({ ok:true, product: prod });
  } catch (e) {
    console.error(e);
    res.status(400).json({ ok:false, error: e.message });
  }
});

// Admin list (for grid)
app.get("/admin/products", requireAdmin, async (req, res) => {
  const items = await Product.find().sort({ createdAt: -1 }).limit(200);
  res.json({ ok:true, items });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Admin upload server running on", PORT));
```

---

## 3) Admin dashboard form (Next.js)

```tsx
// app/admin/products/new/page.tsx
"use client";
import { useState } from "react";

export default function NewProduct() {
  const [images, setImages] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    if (images?.length) Array.from(images).forEach(f => data.append("images", f));
    setBusy(true);

    const r = await fetch("https://capsaicin-backend.onrender.com/admin/products", {
      method: "POST", body: data
    });
    const json = await r.json();
    setBusy(false);
    if (!json.ok) return alert(json.error || "Failed");
    alert("Product created");
    form.reset(); setImages(null);
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm">Name</label>
        <input name="name" required className="border rounded w-full p-2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">SKU</label>
          <input name="sku" className="border rounded w-full p-2" />
        </div>
        <div>
          <label className="block text-sm">Price (R)</label>
          <input name="price" type="number" step="0.01" required className="border rounded w-full p-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm">Category</label>
        <input name="category" defaultValue="jewellery" className="border rounded w-full p-2" />
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea name="description" rows={4} className="border rounded w-full p-2" />
      </div>
      <div>
        <label className="block text-sm">Images (PNG/JPEG/WEBP, up to 6)</label>
        <input type="file" accept="image/png,image/jpeg,image/webp" multiple
               onChange={(e)=>setImages(e.target.files)} />
      </div>
      <button disabled={busy} className="px-4 py-2 rounded bg-black text-white">
        {busy ? "Uploading…" : "Create product"}
      </button>
    </form>
  );
}
```

**Replace images for an existing product**

```tsx
async function replaceImages(productId: string, files: FileList) {
  const fd = new FormData();
  Array.from(files).forEach(f => fd.append("images", f));
  const r = await fetch(`https://capsaicin-backend.onrender.com/admin/products/${productId}/images?mode=replace`, {
    method: "POST", body: fd
  });
  return r.json();
}
```

---

## 4) Security & hygiene

* Replace `requireAdmin` with your real **JWT/session** admin check.
* Keep **CORS** tight to `ADMIN_ORIGINS`.
* Validate image types & size (already enforced).
* Consider rate limiting (`express-rate-limit`) on `/admin/*`.
* Optionally store **public IDs** (from Cloudinary response) if you plan deletions/migrations later.

---

## 5) Acceptance criteria

* Admin can create a product with **1–6 images**; backend returns product with `imageUrls[]`.
* Images are **visible** immediately on product pages (served from Cloudinary CDN).
* Replacing images on an existing product works (append/replace mode).
* No images stored on server disk; uploading works after **backend restarts** (Render).
* Only allowed admin origins can call the endpoints.

---

## 6) Troubleshooting (fast)

* **400 “Only PNG/JPEG/WEBP allowed”** → file type mismatch.
* **413/size errors** → files exceed 5MB; raise `limits.fileSize` if needed.
* **CORS blocked** → add your admin domain to `ADMIN_ORIGINS`.
* **Cloudinary auth error** → secret wrong; prefer 3-var config, avoid setting both styles.
* **Need thumbnails** → on the client, request transformed URLs:
  `https://res.cloudinary.com/<cloud>/image/upload/w_600,h_600,c_fill,q_auto,f_auto/<public_id>.webp`

---

### Notes for Copilot / implementers

* Keep the backend upload path **multipart → multer → CloudinaryStorage**; do not write to local disk.
* Store **absolute** `secure_url` strings in Mongo.
* The admin UI uses **FormData**; do **not** set `Content-Type` header (browser sets boundary).
* All secrets belong on the **server**; the frontend only sends images and basic product fields.

---

If you want the same flow using **S3 pre-signed POST** later (for cost/control), I’ll drop a parallel `routes/s3.js` + client snippet you can toggle with an env flag.
