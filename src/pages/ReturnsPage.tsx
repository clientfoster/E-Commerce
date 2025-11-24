import { motion } from 'framer-motion';
import { Truck, RotateCcw, CreditCard } from 'lucide-react';

export function ReturnsPage() {
  const policies = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Return Policy",
      description: "We offer a 30-day return policy for all unworn, unwashed items with original tags attached. Items must be in their original condition to be eligible for return."
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: "Exchange Process",
      description: "Exchanges are free of charge. You can exchange items for a different size, color, or style within 30 days of purchase. Contact our support team to initiate an exchange."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Refund Policy",
      description: "Refunds are processed to the original payment method within 5-7 business days of receiving your returned item. Shipping fees are non-refundable unless the return is due to our error."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Contact Support",
      description: "Reach out to our customer service team via email or phone to initiate your return or exchange."
    },
    {
      number: "2",
      title: "Package Item",
      description: "Carefully pack your item in its original packaging. Include all tags and accessories."
    },
    {
      number: "3",
      title: "Ship Item",
      description: "Drop off your package at the nearest shipping location. We'll provide a prepaid label for exchanges."
    },
    {
      number: "4",
      title: "Receive Confirmation",
      description: "Once we receive and inspect your item, we'll process your return or exchange and notify you."
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
            Returns & Exchanges
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. Here's how we make returns and exchanges easy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
            >
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mb-4">
                {policy.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {policy.title}
              </h3>
              <p className="text-gray-600">
                {policy.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-2xl p-8 mb-16 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 rounded-2xl p-8 border border-blue-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help?
          </h2>
          <p className="text-gray-700 mb-6">
            Our customer service team is here to assist you with any questions about returns or exchanges. 
            We typically respond within 24 hours.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                For detailed inquiries about your return or exchange
              </p>
              <a 
                href="mailto:returns@atelier.com" 
                className="text-gray-900 font-medium hover:underline"
              >
                returns@atelier.com
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">
                For immediate assistance with your return or exchange
              </p>
              <a 
                href="tel:+18001234567" 
                className="text-gray-900 font-medium hover:underline"
              >
                +1 (800) 123-4567
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}