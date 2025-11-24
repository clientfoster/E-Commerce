import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Mail, Phone } from 'lucide-react';

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "To place an order, browse our collection, select the items you'd like to purchase, choose your size and color, and add them to your cart. Proceed to checkout, enter your shipping and payment information, and confirm your order."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support PayPal and Apple Pay for your convenience."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the continental US. Express shipping is available for 1-2 business day delivery. International shipping times vary by destination."
    },
    {
      question: "Can I return or exchange an item?",
      answer: "Yes, we offer a 30-day return policy for unworn, unwashed items with original tags attached. Items must be in their original condition. Exchanges are free of charge. Visit our Returns & Exchanges page for detailed instructions."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also log into your account to view your order status and tracking details."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide. International shipping rates and delivery times vary by destination. Customs duties and taxes may apply depending on your location."
    },
    {
      question: "How do I care for my garments?",
      answer: "Care instructions are provided on the garment's label. Generally, we recommend washing in cold water and hanging to dry to preserve fabric quality and color. Avoid bleach and harsh detergents."
    },
    {
      question: "What is your sustainability commitment?",
      answer: "We're committed to sustainable fashion through ethical manufacturing, eco-friendly materials, and responsible sourcing. Our packaging is recyclable, and we're continuously working to reduce our environmental impact."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </motion.div>

        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-gray-100">
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to help you
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@atelier.com"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Support
            </a>
            <a
              href="tel:+18001234567"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-400 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}