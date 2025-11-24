import { motion } from 'framer-motion';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none"
        >
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Atelier. These Terms and Conditions govern your use of our website and services. 
              By accessing or using our website, you agree to be bound by these Terms and Conditions and our 
              Privacy Policy. If you disagree with any part of these terms, you may not access the website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The content, features, and functionality of our website are owned by Atelier and are protected 
              by international copyright, trademark, patent, trade secret, and other intellectual property 
              or proprietary rights laws. You may not reproduce, distribute, modify, or create derivative 
              works of any content without our express written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of Website</h2>
            <p className="text-gray-700 mb-4">
              You agree to use our website only for lawful purposes and in accordance with these Terms. 
              You must not:
            </p>
            <ul className="list-disc pl-8 text-gray-700 space-y-2 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any viruses or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the website in any way that could disable, overburden, or impair the site</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Products and Pricing</h2>
            <p className="text-gray-700 mb-4">
              All products are subject to availability. We reserve the right to discontinue any product at any time. 
              Prices are subject to change without notice. We strive to display accurate pricing information, 
              but we do not guarantee that product prices or other content on the site are accurate, complete, 
              reliable, current, or error-free.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Orders and Payment</h2>
            <p className="text-gray-700 mb-4">
              By placing an order, you are making an offer to purchase products. All orders are subject to 
              acceptance and availability. We reserve the right to refuse or cancel any order for any reason. 
              Payment must be received in full before shipment of goods.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Shipping and Delivery</h2>
            <p className="text-gray-700 mb-4">
              We aim to process and ship orders within 1-2 business days. Delivery times are estimates and 
              not guaranteed. Risk of loss and title for products pass to you upon our delivery to the carrier.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Returns and Refunds</h2>
            <p className="text-gray-700 mb-4">
              We offer a 30-day return policy for eligible items. Items must be unworn, unwashed, and in 
              their original condition with tags attached. Refunds will be processed to the original payment 
              method within 5-7 business days of receipt.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall Atelier, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential or punitive damages, including 
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
              from your access to or use of or inability to access or use the service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will provide at least 30 days' notice prior to any new terms 
              taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@atelier.com<br />
                <strong>Phone:</strong> +1 (800) 123-4567<br />
                <strong>Address:</strong> 123 Fashion Street, New York, NY 10001
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}