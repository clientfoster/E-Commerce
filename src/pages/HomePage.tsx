import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Home/Hero';
import { FeaturedProducts } from '../components/Home/FeaturedProducts';
import { productApi } from '../lib/api';
import type { Product, Page } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await productApi.getProducts({
        isFeatured: true,
        isActive: true,
        limit: 6,
      });
      if (data) setFeaturedProducts(data as Product[]);
    } catch (error) {
      console.error('Fetch featured products error:', error);
    }
  };

  const handleNavigate = (page: Page, productSlug?: string) => {
    switch (page) {
      case 'shop':
        navigate('/shop');
        break;
      case 'product':
        if (productSlug) {
          navigate(`/product/${productSlug}`);
        }
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <div>
      <Hero onNavigate={handleNavigate} />
      <FeaturedProducts products={featuredProducts} onNavigate={handleNavigate} />
    </div>
  );
}
