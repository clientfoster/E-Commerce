import { motion } from 'framer-motion';

export function SizeGuidePage() {
  const sizeGuides = [
    {
      category: "Women's Tops",
      sizes: [
        { size: "XS", chest: "32-34\"", waist: "24-26\"", hips: "34-36\"" },
        { size: "S", chest: "34-36\"", waist: "26-28\"", hips: "36-38\"" },
        { size: "M", chest: "36-38\"", waist: "28-30\"", hips: "38-40\"" },
        { size: "L", chest: "38-40\"", waist: "30-32\"", hips: "40-42\"" },
        { size: "XL", chest: "40-42\"", waist: "32-34\"", hips: "42-44\"" },
      ]
    },
    {
      category: "Men's Tops",
      sizes: [
        { size: "S", chest: "34-36\"", waist: "28-30\"", hips: "34-36\"" },
        { size: "M", chest: "36-38\"", waist: "30-32\"", hips: "36-38\"" },
        { size: "L", chest: "38-40\"", waist: "32-34\"", hips: "38-40\"" },
        { size: "XL", chest: "40-42\"", waist: "34-36\"", hips: "40-42\"" },
        { size: "XXL", chest: "42-44\"", waist: "36-38\"", hips: "42-44\"" },
      ]
    },
    {
      category: "Women's Bottoms",
      sizes: [
        { size: "XS", waist: "24-26\"", hips: "34-36\"", inseam: "30\"" },
        { size: "S", waist: "26-28\"", hips: "36-38\"", inseam: "30\"" },
        { size: "M", waist: "28-30\"", hips: "38-40\"", inseam: "30\"" },
        { size: "L", waist: "30-32\"", hips: "40-42\"", inseam: "30\"" },
        { size: "XL", waist: "32-34\"", hips: "42-44\"", inseam: "30\"" },
      ]
    },
    {
      category: "Men's Bottoms",
      sizes: [
        { size: "S", waist: "28-30\"", hips: "34-36\"", inseam: "32\"" },
        { size: "M", waist: "30-32\"", hips: "36-38\"", inseam: "32\"" },
        { size: "L", waist: "32-34\"", hips: "38-40\"", inseam: "32\"" },
        { size: "XL", waist: "34-36\"", hips: "40-42\"", inseam: "32\"" },
        { size: "XXL", waist: "36-38\"", hips: "42-44\"", inseam: "32\"" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Size Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive sizing guide. Measurements are in inches.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sizeGuides.map((guide, index) => (
            <motion.div
              key={guide.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {guide.category}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Size</th>
                      {Object.keys(guide.sizes[0]).filter(key => key !== 'size').map((measurement) => (
                        <th key={measurement} className="text-left py-3 px-4 font-semibold text-gray-900 capitalize">
                          {measurement.replace(/([A-Z])/g, ' $1')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guide.sizes.map((row, rowIndex) => (
                      <tr 
                        key={rowIndex} 
                        className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="py-3 px-4 font-medium text-gray-900">{row.size}</td>
                        {Object.entries(row).filter(([key]) => key !== 'size').map(([, value], colIndex) => (
                          <td key={colIndex} className="py-3 px-4 text-gray-700">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How to Measure Yourself
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chest/Bust</h3>
              <p className="text-gray-600">
                Measure around the fullest part of your chest/bust, keeping the tape measure level.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Waist</h3>
              <p className="text-gray-600">
                Measure around your natural waistline, keeping the tape measure comfortably loose.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hips</h3>
              <p className="text-gray-600">
                Measure around the fullest part of your hips, keeping the tape measure level.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}