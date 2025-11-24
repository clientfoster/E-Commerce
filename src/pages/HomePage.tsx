import { useEffect, useState } from 'react';
import { Hero } from '../components/Home/Hero';
import { FeaturedProducts } from '../components/Home/FeaturedProducts';
import { supabase } from '../lib/supabase';
import type { Product, Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page, productSlug?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(6);

    if (data) setFeaturedProducts(data as Product[]);
  };

  return (
    <div>
      <Hero onNavigate={onNavigate} />
      <FeaturedProducts products={featuredProducts} onNavigate={onNavigate} />
    </div>
  );
}
