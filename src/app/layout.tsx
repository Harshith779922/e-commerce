import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';

export const metadata: Metadata = {
  title: 'ELYON LECLAIR — The Digital Luxury Maison',
  description: 'An architectural expression in modern couture. Timeless silhouettes, tactile textiles, and bespoke craftsmanship for men and women.',
  keywords: 'ELYON LECLAIR, luxury fashion maison, haute couture, eveningwear, designer suits, dark luxury, bespoke tailoring',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#101010] text-[#F2EEE5] antialiased selection:bg-[#4B171C] selection:text-[#F2EEE5]">
        <SettingsProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <AnnouncementBar />
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <CartDrawer />
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
