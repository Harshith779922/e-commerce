import prisma from '@/lib/prisma';
import HeroSection from '@/components/home/HeroSection';
import BrandBenefits from '@/components/home/BrandBenefits';
import ShopByCategory from '@/components/home/ShopByCategory';
import NewArrivals from '@/components/home/NewArrivals';
import FeaturedCollectionBanner from '@/components/home/FeaturedCollectionBanner';
import BestSellers from '@/components/home/BestSellers';
import EditorialSection from '@/components/home/EditorialSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { Product } from '@/lib/types';

export const revalidate = 0; // Fresh data for demo

export default async function HomePage() {
  // Fetch active products with relations
  const products = (await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      variants: true,
      category: true,
      collection: true,
    },
  })) as unknown as Product[];

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] text-[#F5F0E8]">
      {/* 1. Hero Section — The Italian Collection Carousel */}
      <HeroSection />

      {/* 2. Brand Benefits Section */}
      <BrandBenefits />

      {/* 3. Shop by Category */}
      <ShopByCategory />

      {/* 4. New Arrivals Showcase (5 items) */}
      <NewArrivals products={products} />

      {/* 5. Featured Collection Banner — The Dolce Collection */}
      <FeaturedCollectionBanner />

      {/* 6. Best Sellers Showcase */}
      <BestSellers products={products} />

      {/* 7. Magazine-Inspired Editorial Section — The Art of Dressing */}
      <EditorialSection />

      {/* 8. Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}

