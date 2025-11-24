/*
  # Seed Sample E-Commerce Data

  ## Overview
  Populates database with sample categories and products for demonstration

  ## Data Added
  
  ### Categories
  - Premium Outerwear
  - Designer Tops
  - Luxury Bottoms
  
  ### Products
  6 sample fashion products with:
  - High-quality placeholder images from Pexels
  - Multiple color options
  - Various sizes
  - Material choices
  - Competitive pricing
  - 3D model support flags

  ## Notes
  - All products are marked as active and featured
  - Stock quantities set to reasonable amounts
  - Product slugs are URL-friendly
  - Images use production-ready Pexels URLs
*/

-- Insert categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Outerwear', 'outerwear', 'Premium jackets and coats', 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'),
('Tops', 'tops', 'Designer shirts and blouses', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'),
('Bottoms', 'bottoms', 'Luxury pants and skirts', 'https://images.pexels.com/photos/1895943/pexels-photo-1895943.jpeg')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (
  name, slug, description, price, category_id, images, sizes, colors, materials, 
  stock_quantity, is_featured, is_active
) VALUES
(
  'Minimal Tailored Blazer',
  'minimal-tailored-blazer',
  'A perfectly structured blazer in premium wool blend. Features clean lines, peak lapels, and a modern slim fit. Timeless sophistication for any occasion.',
  299.00,
  (SELECT id FROM categories WHERE slug = 'outerwear' LIMIT 1),
  '["https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg", "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg"]'::jsonb,
  '["XS", "S", "M", "L", "XL"]'::jsonb,
  '[{"name": "Black", "hex": "#1a1a1a"}, {"name": "Navy", "hex": "#1e3a5f"}, {"name": "Charcoal", "hex": "#36454f"}]'::jsonb,
  '[{"name": "Wool Blend"}, {"name": "Pure Wool"}]'::jsonb,
  50,
  true,
  true
),
(
  'Silk Draped Blouse',
  'silk-draped-blouse',
  'Luxurious silk blouse with elegant draping and fluid movement. Features a relaxed fit, subtle sheen, and delicate button details. Pure elegance.',
  189.00,
  (SELECT id FROM categories WHERE slug = 'tops' LIMIT 1),
  '["https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg", "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg"]'::jsonb,
  '["XS", "S", "M", "L"]'::jsonb,
  '[{"name": "Ivory", "hex": "#f5f5dc"}, {"name": "Blush", "hex": "#de5d83"}, {"name": "Sage", "hex": "#9caf88"}]'::jsonb,
  '[{"name": "Pure Silk"}, {"name": "Silk Satin"}]'::jsonb,
  40,
  true,
  true
),
(
  'Wide-Leg Trousers',
  'wide-leg-trousers',
  'Contemporary wide-leg trousers crafted from premium Italian fabric. High-waisted silhouette with a flowing leg and tailored pleats. Effortless sophistication.',
  225.00,
  (SELECT id FROM categories WHERE slug = 'bottoms' LIMIT 1),
  '["https://images.pexels.com/photos/1895943/pexels-photo-1895943.jpeg", "https://images.pexels.com/photos/5706666/pexels-photo-5706666.jpeg"]'::jsonb,
  '["24", "26", "28", "30", "32"]'::jsonb,
  '[{"name": "Black", "hex": "#000000"}, {"name": "Camel", "hex": "#c19a6b"}, {"name": "Slate", "hex": "#708090"}]'::jsonb,
  '[{"name": "Crepe"}, {"name": "Wool Crepe"}]'::jsonb,
  45,
  true,
  true
),
(
  'Cashmere Turtleneck',
  'cashmere-turtleneck',
  'Ultra-soft cashmere turtleneck with a relaxed fit. Lightweight yet warm, perfect for layering. Timeless piece for your capsule wardrobe.',
  275.00,
  (SELECT id FROM categories WHERE slug = 'tops' LIMIT 1),
  '["https://images.pexels.com/photos/8148577/pexels-photo-8148577.jpeg", "https://images.pexels.com/photos/5868283/pexels-photo-5868283.jpeg"]'::jsonb,
  '["XS", "S", "M", "L", "XL"]'::jsonb,
  '[{"name": "Cream", "hex": "#fffdd0"}, {"name": "Charcoal", "hex": "#36454f"}, {"name": "Burgundy", "hex": "#800020"}]'::jsonb,
  '[{"name": "Pure Cashmere"}]'::jsonb,
  30,
  true,
  true
),
(
  'Leather Midi Skirt',
  'leather-midi-skirt',
  'Butter-soft leather midi skirt with a sleek silhouette. Features a flattering A-line cut and invisible side zip. Modern luxury at its finest.',
  349.00,
  (SELECT id FROM categories WHERE slug = 'bottoms' LIMIT 1),
  '["https://images.pexels.com/photos/3755769/pexels-photo-3755769.jpeg", "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg"]'::jsonb,
  '["XS", "S", "M", "L"]'::jsonb,
  '[{"name": "Black", "hex": "#000000"}, {"name": "Chocolate", "hex": "#3f2616"}, {"name": "Tan", "hex": "#d2b48c"}]'::jsonb,
  '[{"name": "Lambskin"}, {"name": "Vegan Leather"}]'::jsonb,
  25,
  true,
  true
),
(
  'Oversized Trench Coat',
  'oversized-trench-coat',
  'Contemporary take on the classic trench. Features dropped shoulders, oversized silhouette, and premium cotton gabardine. Statement outerwear piece.',
  425.00,
  (SELECT id FROM categories WHERE slug = 'outerwear' LIMIT 1),
  '["https://images.pexels.com/photos/8148580/pexels-photo-8148580.jpeg", "https://images.pexels.com/photos/4937449/pexels-photo-4937449.jpeg"]'::jsonb,
  '["XS", "S", "M", "L", "XL"]'::jsonb,
  '[{"name": "Beige", "hex": "#f5f5dc"}, {"name": "Black", "hex": "#000000"}, {"name": "Khaki", "hex": "#c3b091"}]'::jsonb,
  '[{"name": "Cotton Gabardine"}, {"name": "Waterproof Cotton"}]'::jsonb,
  35,
  true,
  true
)
ON CONFLICT (slug) DO NOTHING;