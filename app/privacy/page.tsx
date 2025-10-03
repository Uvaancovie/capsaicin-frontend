export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-sm text-gray-600">Last Updated: {new Date().toLocaleDateString('en-ZA')}</p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Cape Pharm (PTY) LTD ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.capepharm.co.za and use our services. This policy complies with the Protection of Personal Information Act (POPIA) of South Africa.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Personal Information</h3>
          <p>We may collect the following personal information from you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and surname</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Delivery address</li>
            <li>Billing information</li>
            <li>Payment card details (processed securely through third-party payment processors)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
            <li>Device information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders, products, and services</li>
            <li>Send you promotional materials and updates (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and enhance security</li>
            <li>Comply with legal obligations</li>
            <li>Analyze website usage and trends</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Legal Basis for Processing (POPIA Compliance)</h2>
          <p>We process your personal information based on:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Consent:</strong> When you provide explicit consent for specific purposes</li>
            <li><strong>Contract Performance:</strong> To fulfill our contractual obligations when you place an order</li>
            <li><strong>Legitimate Interests:</strong> To improve our services and prevent fraud</li>
            <li><strong>Legal Obligations:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Providers:</strong> Third-party companies that help us operate our business (payment processors, delivery services, hosting providers)</li>
            <li><strong>Payment Processors:</strong> Ozow, PayGate, and other secure payment gateways</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
          </ul>
          <p className="mt-4">
            We do not sell, rent, or trade your personal information to third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure payment processing through PCI-DSS compliant providers</li>
            <li>Regular security assessments and updates</li>
            <li>Restricted access to personal information</li>
            <li>Staff training on data protection</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights Under POPIA</h2>
          <p>Under the Protection of Personal Information Act, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> Request access to your personal information we hold</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
            <li><strong>Objection:</strong> Object to the processing of your personal information</li>
            <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
            <li><strong>Data Portability:</strong> Request transfer of your data to another service provider</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at info@capepharm.co.za
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookie settings through your browser preferences. Note that disabling cookies may affect website functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Order and transaction records are typically retained for 7 years for tax and accounting purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than South Africa. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">14. Information Officer</h2>
          <p>
            For POPIA compliance, our Information Officer can be contacted at:
          </p>
          <p>
            <strong>Name:</strong> [Information Officer Name]<br />
            <strong>Email:</strong> info@capepharm.co.za<br />
            <strong>Phone:</strong> +27 (0)11 123 4567<br />
            <strong>Address:</strong> [Your Physical Address]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">15. Complaints</h2>
          <p>
            If you have concerns about how we handle your personal information, you may lodge a complaint with:
          </p>
          <p>
            <strong>Information Regulator (South Africa)</strong><br />
            Website: <a href="https://inforegulator.org.za" className="text-red-600 hover:underline">www.inforegulator.org.za</a><br />
            Email: inforeg@justice.gov.za
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">16. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
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
