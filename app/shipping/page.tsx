export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Shipping and Delivery Policy</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-sm text-gray-600">Last Updated: {new Date().toLocaleDateString('en-ZA')}</p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Overview</h2>
          <p>
            Cape Pharm (PTY) LTD is committed to delivering your healthcare products safely and efficiently. This Shipping and Delivery Policy outlines our delivery options, timeframes, costs, and procedures.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Delivery Areas</h2>
          <p>
            We currently deliver to addresses within South Africa. We deliver to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Residential addresses</li>
            <li>Business addresses</li>
            <li>PO Boxes (for eligible items only)</li>
            <li>Postal addresses in remote areas</li>
          </ul>
          <p className="mt-4">
            Unfortunately, we cannot deliver to addresses outside South Africa at this time. Please ensure your delivery address is complete and accurate to avoid delays.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Delivery Options and Timeframes</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Standard Delivery</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cost:</strong> Calculated at checkout based on order weight and delivery location</li>
            <li><strong>Timeframe:</strong> 5-7 business days from order confirmation</li>
            <li><strong>Coverage:</strong> All areas in South Africa</li>
            <li><strong>Tracking:</strong> Tracking number provided via email</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Express Delivery</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cost:</strong> Premium rate calculated at checkout</li>
            <li><strong>Timeframe:</strong> 2-3 business days from order confirmation</li>
            <li><strong>Coverage:</strong> Major cities and metro areas</li>
            <li><strong>Tracking:</strong> Real-time tracking available</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Same-Day Delivery (Where Available)</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cost:</strong> Premium rate</li>
            <li><strong>Timeframe:</strong> Same business day if ordered before 11:00 AM</li>
            <li><strong>Coverage:</strong> Selected metro areas only (Cape Town, Johannesburg, Pretoria, Durban)</li>
            <li><strong>Cut-off Time:</strong> Orders placed after 11:00 AM will be delivered the next business day</li>
          </ul>

          <p className="mt-4">
            <em>Note: Business days are Monday to Friday, excluding public holidays. Deliveries are not made on weekends or public holidays unless specifically arranged.</em>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Shipping Costs</h2>
          <p>
            Shipping costs are calculated based on:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Order weight and dimensions</li>
            <li>Delivery location and distance</li>
            <li>Selected delivery speed</li>
            <li>Special handling requirements (if applicable)</li>
          </ul>
          <p className="mt-4">
            <strong>Free Shipping:</strong> We offer free standard shipping on orders over R500 to most areas in South Africa.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Order Processing</h2>
          <p>
            Orders are processed as follows:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Order Confirmation:</strong> You will receive an email confirming your order within 1 hour</li>
            <li><strong>Payment Verification:</strong> Orders are processed once payment is confirmed (usually within 24 hours)</li>
            <li><strong>Packing:</strong> Items are carefully packed to ensure safe delivery</li>
            <li><strong>Dispatch:</strong> You will receive a dispatch notification with tracking details</li>
            <li><strong>Delivery:</strong> Courier will attempt delivery during business hours</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Order Tracking</h2>
          <p>
            Once your order is dispatched, you will receive:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email notification with tracking number</li>
            <li>Link to track your parcel in real-time</li>
            <li>SMS updates (for express deliveries)</li>
          </ul>
          <p className="mt-4">
            You can also track your order by logging into your account on our website and viewing your order history.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Delivery Attempts</h2>
          <p>
            Our courier partners will make up to <strong>3 delivery attempts</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>1st Attempt:</strong> Delivery to specified address during business hours</li>
            <li><strong>2nd Attempt:</strong> If unsuccessful, courier will leave a notification card and attempt redelivery the next business day</li>
            <li><strong>3rd Attempt:</strong> Final delivery attempt; parcel will be held at courier depot for collection if unsuccessful</li>
          </ul>
          <p className="mt-4">
            If all attempts fail, the parcel will be returned to us, and you will be contacted for further instructions. Return shipping fees may apply.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Delivery Requirements</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Signature Required</h3>
          <p>
            A signature is required upon delivery for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders over R1000</li>
            <li>Items requiring age verification</li>
            <li>High-value or sensitive products</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Authority to Leave</h3>
          <p>
            If no one is available to accept delivery, you may authorize us to leave the parcel in a safe place. Please note that we cannot be held responsible for items left at your request.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Incorrect or Incomplete Address</h2>
          <p>
            Please ensure your delivery address is complete and accurate. If a parcel is returned due to an incorrect or incomplete address provided by you:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Additional shipping fees will apply for redelivery</li>
            <li>Delivery timeframes will be extended</li>
            <li>You will be contacted to update your address details</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Delivery Delays</h2>
          <p>
            While we strive to meet our delivery timeframes, delays may occur due to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Adverse weather conditions</li>
            <li>Natural disasters</li>
            <li>Public holidays</li>
            <li>Courier service disruptions</li>
            <li>High demand periods (e.g., festive season)</li>
            <li>Customs delays (for future international orders)</li>
            <li>Remote or difficult-to-access locations</li>
          </ul>
          <p className="mt-4">
            We will notify you immediately if we anticipate any delays with your order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Lost or Damaged Parcels</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">11.1 Lost Parcels</h3>
          <p>
            If your parcel has not arrived within the expected timeframe:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Check your tracking information</li>
            <li>Contact us at <strong>info@capepharm.co.za</strong></li>
            <li>We will investigate with our courier partner</li>
            <li>If confirmed lost, we will send a replacement or issue a full refund</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">11.2 Damaged Parcels</h3>
          <p>
            If your parcel arrives damaged:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Do not discard the packaging</li>
            <li>Take photos of the damaged parcel and items</li>
            <li>Contact us within 48 hours at <strong>info@capepharm.co.za</strong></li>
            <li>We will arrange collection and send a replacement or issue a refund</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Special Delivery Instructions</h2>
          <p>
            You may provide special delivery instructions during checkout, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gate access codes</li>
            <li>Alternative contact numbers</li>
            <li>Preferred safe-drop location</li>
            <li>Delivery time preferences (subject to courier availability)</li>
          </ul>
          <p className="mt-4">
            Please note that while we will make every effort to accommodate your requests, we cannot guarantee compliance with all special instructions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Courier Partners</h2>
          <p>
            We work with trusted courier partners including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The Courier Guy</li>
            <li>Aramex</li>
            <li>PostNet</li>
            <li>DHL Express (for urgent deliveries)</li>
            <li>Pargo (for parcel locker deliveries)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">14. Order Changes and Cancellations</h2>
          <p>
            Once an order is placed, we begin processing immediately. To modify or cancel your order:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact us within 1 hour of placing your order</li>
            <li>Once dispatched, orders cannot be cancelled (returns policy will apply)</li>
            <li>Address changes may incur additional fees if the parcel has been dispatched</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">15. Insurance</h2>
          <p>
            All parcels are insured during transit at no additional cost to you. In the event of loss or damage, we will work with our courier partners to resolve the issue quickly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">16. Contact Us</h2>
          <p>
            For shipping inquiries or assistance, please contact us:
          </p>
          <p>
            <strong>Email:</strong> info@capepharm.co.za<br />
            <strong>Phone:</strong> +27 (0)11 123 4567<br />
            <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (SAST)<br />
            <strong>Address:</strong> [Your Physical Address]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">17. Policy Updates</h2>
          <p>
            We reserve the right to update this Shipping and Delivery Policy at any time. Changes will be effective immediately upon posting on this page. Please review this policy periodically.
          </p>
        </section>
      </div>
    </div>
  )
}
