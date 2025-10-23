import Link from "next/link"
import { Instagram, Facebook, Mail, MapPin, Clock } from "lucide-react"

// Custom TikTok icon SVG component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="font-bold text-xl">Cape Pharm</span>
            </div>
            <p className="text-gray-400 mb-4">Quality Healthcare & Pharmacy Services</p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com/capepharm" className="text-gray-400 hover:text-red-600">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="https://www.facebook.com/profile.php?id=100091694220272" className="text-gray-400 hover:text-red-600">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://www.tiktok.com/@eden.on.bay.pharm" className="text-gray-400 hover:text-red-600">
                <TikTokIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>circlepp@mweb.co.za</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Mon–Fri, 9am–5pm</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Cape Town, South Africa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm space-y-4 md:space-y-0">
            <p>&copy; {new Date().getFullYear()} Cape Pharm (PTY) LTD. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/terms" className="hover:text-white">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/returns" className="hover:text-white">
                Returns
              </Link>
              <Link href="/shipping" className="hover:text-white">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
