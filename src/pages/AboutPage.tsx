import { motion } from 'framer-motion';
import { Heart, Award, Leaf, Truck } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About Atelier
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Redefining fashion through innovative 3D experiences and timeless design.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="aspect-[21/9] bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg"
              alt="Atelier Studio"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 2024, Atelier was born from a vision to revolutionize how people
                experience fashion online. We believe that shopping for clothing should be
                as immersive and engaging as visiting a physical boutique.
              </p>
              <p>
                By combining cutting-edge 3D technology with carefully curated collections,
                we've created a platform where you can truly visualize and customize each
                piece before making it yours.
              </p>
              <p>
                Every item in our collection is selected with meticulous attention to
                quality, craftsmanship, and timeless style. We partner with artisans and
                manufacturers who share our commitment to excellence and sustainability.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                We're on a mission to make high-quality fashion accessible while minimizing
                our environmental impact. Each piece is designed to be versatile, durable,
                and timeless.
              </p>
              <p>
                Through innovative 3D visualization, we help you make confident purchasing
                decisions, reducing returns and waste. Our interactive product configurator
                lets you explore materials, colors, and details in unprecedented ways.
              </p>
              <p>
                We're building more than a store—we're creating a community of conscious
                consumers who appreciate quality, innovation, and sustainable practices.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Craftsmanship</h3>
            <p className="text-gray-600 text-sm">
              Every piece is crafted with attention to detail and quality
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Award className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
            <p className="text-gray-600 text-sm">
              Premium materials and construction that lasts
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Leaf className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
            <p className="text-gray-600 text-sm">
              Eco-friendly practices and responsible sourcing
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Truck className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
            <p className="text-gray-600 text-sm">
              Quick delivery with eco-friendly packaging
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay updated with our latest collections, exclusive offers, and behind-the-scenes
            content. Follow us on social media and be part of the Atelier family.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">
              Follow Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
