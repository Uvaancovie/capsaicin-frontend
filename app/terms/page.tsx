export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-sm text-gray-600">Last Updated: {new Date().toLocaleDateString('en-ZA')}</p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Cape Pharm (PTY) LTD ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of our website at www.capepharm.co.za and our services. By accessing or using our website, you agree to be bound by these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Company Information</h2>
          <p>
            <strong>Company Name:</strong> Cape Pharm (PTY) LTD<br />
            <strong>Registration Number:</strong> [Your Registration Number]<br />
            <strong>Physical Address:</strong> [Your Physical Address]<br />
            <strong>Contact Email:</strong> info@capepharm.co.za<br />
            <strong>Contact Phone:</strong> +27 (0)11 123 4567
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Use of Website</h2>
          <p>
            You may use our website for lawful purposes only. You agree not to use our website:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>In any way that violates any applicable national or international law or regulation</li>
            <li>To transmit any unsolicited or unauthorized advertising or promotional material</li>
            <li>To impersonate or attempt to impersonate Cape Pharm, a Cape Pharm employee, another user, or any other person or entity</li>
            <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Products and Services</h2>
          <p>
            All products and services offered through our website are subject to availability. We reserve the right to discontinue any product or service at any time without notice. Product descriptions, images, and specifications are provided for convenience and may not be completely accurate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Orders and Payment</h2>
          <p>
            By placing an order through our website, you are making an offer to purchase products subject to these Terms. We reserve the right to refuse or cancel any order for any reason, including but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Product unavailability</li>
            <li>Errors in product or pricing information</li>
            <li>Suspected fraudulent transactions</li>
            <li>Credit/payment issues</li>
          </ul>
          <p className="mt-4">
            All prices are quoted in South African Rand (ZAR) and include VAT where applicable. Payment must be received in full before goods are dispatched.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Payment Methods</h2>
          <p>
            We accept payment through secure payment gateways including Ozow and PayGate. By providing payment information, you represent and warrant that you are authorized to use the payment method and authorize us to charge your payment method for the total amount of your order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
          <p>
            All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Cape Pharm (PTY) LTD or its content suppliers and is protected by South African and international copyright laws. You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Cape Pharm (PTY) LTD shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your access to or use of or inability to access or use the website</li>
            <li>Any conduct or content of any third party on the website</li>
            <li>Any content obtained from the website</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Cape Pharm (PTY) LTD and its officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from your use of the website or your violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the Republic of South Africa. Any disputes arising from these Terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of South Africa.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the website after any modifications constitute your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> info@capepharm.co.za<br />
            <strong>Phone:</strong> +27 (0)11 123 4567<br />
            <strong>Address:</strong> [Your Physical Address]
          </p>
        </section>
      </div>
    </div>
  )
}
