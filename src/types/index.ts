export type Page =
  | 'home'
  | 'shop'
  | 'product'
  | 'checkout'
  | 'orders'
  | 'admin'
  | 'admin-setup'
  | 'about'
  | 'contact'
  | 'profile'
  | 'blog'
  | 'blog-post';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  images: string[];
  model_url: string | null;
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  materials: Array<{ name: string; texture?: string }>;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}
