import prisma from '@/lib/prisma';
import MaisonEntrance from '@/components/home/MaisonEntrance';
import MaisonIdentity from '@/components/home/MaisonIdentity';
import CollectionGallery from '@/components/home/CollectionGallery';
import TheBoutique from '@/components/home/TheBoutique';
import ArtOfDetail from '@/components/home/ArtOfDetail';
import TheCampaign from '@/components/home/TheCampaign';
import TheJournal from '@/components/home/TheJournal';
import { Product } from '@/lib/types';

export const revalidate = 0; // Fresh dynamic data

export default async function HomePage() {
  // Fetch active products with relations for the boutique
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
    <div className="flex flex-col min-h-screen bg-[#101010] text-[#F2EEE5] selection:bg-[#4B171C] selection:text-[#F2EEE5]">
      {/* Chapter 1 — The Entrance & Hero */}
      <MaisonEntrance />

      {/* Chapter 2 — The Identity */}
      <MaisonIdentity />

      {/* Chapter 3 — The Collection Gallery */}
      <CollectionGallery />

      {/* Chapter 4 — The Boutique */}
      <TheBoutique products={products} />

      {/* Chapter 5 — The Art of Detail */}
      <ArtOfDetail />

      {/* Chapter 6 — The Campaign */}
      <TheCampaign />

      {/* Chapter 7 — The Journal */}
      <TheJournal />

      {/* Chapter 8 — The Signature is rendered in RootLayout as Footer */}
    </div>
  );
}
