export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Returns and Refunds Policy</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-sm text-gray-600">Last Updated: {new Date().toLocaleDateString('en-ZA')}</p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Our Commitment</h2>
          <p>
            At Cape Pharm (PTY) LTD, we are committed to providing you with high-quality healthcare products. If you are not completely satisfied with your purchase, we are here to help. This Returns and Refunds Policy complies with the Consumer Protection Act of South Africa.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Return Period</h2>
          <p>
            You have <strong>30 calendar days</strong> from the date of delivery to return an item for a refund or exchange. To be eligible for a return, items must meet the conditions outlined in Section 3.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Return Eligibility</h2>
          <p>To qualify for a return, your item must:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be unused and in the same condition that you received it</li>
            <li>Be in the original packaging with all tags and labels intact</li>
            <li>Include proof of purchase (invoice or receipt)</li>
            <li>Not be a perishable or hygiene-sensitive product that has been opened</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Non-Returnable Items</h3>
          <p>The following items cannot be returned for health and safety reasons:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Opened or used personal care products</li>
            <li>Prescription medications</li>
            <li>Products with broken seals or tampered packaging</li>
            <li>Intimate or sanitary products that have been opened</li>
            <li>Perishable goods</li>
            <li>Custom or personalized items</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. How to Return an Item</h2>
          <p>To initiate a return, please follow these steps:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Contact our customer service team at <strong>info@capepharm.co.za</strong> or call <strong>+27 (0)11 123 4567</strong></li>
            <li>Provide your order number and reason for return</li>
            <li>Wait for our team to approve your return request and provide return instructions</li>
            <li>Pack the item securely in its original packaging</li>
            <li>Include your invoice and any return authorization number provided</li>
            <li>Ship the item to the address provided by our team</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Return Shipping Costs</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Defective or Damaged Items:</strong> We will cover all return shipping costs if the item is defective, damaged, or incorrect</li>
            <li><strong>Change of Mind:</strong> Customers are responsible for return shipping costs for items returned due to change of mind</li>
            <li><strong>Incorrect Address:</strong> If an item is returned due to an incorrect address provided by the customer, return shipping costs will be the customer's responsibility</li>
          </ul>
          <p className="mt-4">
            We recommend using a trackable shipping service and purchasing shipping insurance for valuable items, as we cannot guarantee receipt of returned items.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Refund Processing</h2>
          <p>Once we receive your returned item, we will:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Inspect the item to ensure it meets return eligibility criteria</li>
            <li>Process your refund within <strong>7-10 business days</strong></li>
            <li>Notify you via email when your refund has been processed</li>
            <li>Issue the refund to your original payment method</li>
          </ol>
          <p className="mt-4">
            Please note that it may take an additional 5-10 business days for the refund to reflect in your account, depending on your bank or payment provider.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Partial Refunds</h2>
          <p>In certain situations, partial refunds may be granted:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Items returned after 30 days but within 60 days (subject to 15% restocking fee)</li>
            <li>Items with obvious signs of use or minor damage</li>
            <li>Items not in original packaging or missing components</li>
            <li>Items returned without all original tags and labels</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Exchanges</h2>
          <p>
            If you need to exchange an item for a different size, color, or product, please contact us at <strong>info@capepharm.co.za</strong>. We will arrange for the exchange subject to product availability. The fastest way to exchange an item is to return the original item for a refund and place a new order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact us immediately (within 48 hours of delivery) with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your order number</li>
            <li>Photos of the damaged item and packaging</li>
            <li>A description of the issue</li>
          </ul>
          <p className="mt-4">
            We will arrange for a replacement or full refund, including return shipping costs, for genuinely defective or damaged items.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Wrong Item Delivered</h2>
          <p>
            If you receive the wrong item, please contact us within 48 hours of delivery. We will arrange collection of the incorrect item at no cost to you and send the correct item or process a full refund.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Late or Missing Refunds</h2>
          <p>If you haven't received your refund after the specified timeframe:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Check your bank account or payment provider again</li>
            <li>Contact your credit card company - it may take time for refunds to be officially posted</li>
            <li>Contact your bank - processing times may vary</li>
            <li>If you've done all of this and still haven't received your refund, contact us at <strong>info@capepharm.co.za</strong></li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Sale and Promotional Items</h2>
          <p>
            Items purchased during sales or promotions are eligible for return under the same conditions. However, refunds will be processed at the discounted price paid, not the original retail price.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Consumer Protection Act Rights</h2>
          <p>
            This policy does not affect your statutory rights under the Consumer Protection Act of South Africa. You have the right to return defective goods or goods not matching their description, regardless of our standard return period.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">14. Contact Information</h2>
          <p>
            For any questions about returns or refunds, please contact us:
          </p>
          <p>
            <strong>Email:</strong> info@capepharm.co.za<br />
            <strong>Phone:</strong> +27 (0)11 123 4567<br />
            <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (SAST)<br />
            <strong>Address:</strong> [Your Physical Address]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">15. Policy Updates</h2>
          <p>
            We reserve the right to update this Returns and Refunds Policy at any time. Changes will be posted on this page with an updated revision date. Please review this policy periodically for any changes.
          </p>
        </section>
      </div>
    </div>
  )
}
