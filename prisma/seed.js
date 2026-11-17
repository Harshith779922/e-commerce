const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Luxury Fashion Seeding for BESPOKE MILANO ---');

  // Clear existing records safely
  await prisma.auditLog.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.customerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleaned existing data.');

  // 1. Users
  const adminPasswordHash = await bcrypt.hash('AdminPassword2026!', 10);
  const customerPasswordHash = await bcrypt.hash('CustomerPassword2026!', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@bespokemilano.com',
      passwordHash: adminPasswordHash,
      name: 'Lorenzo De Luca',
      phone: '+91 98201 12345',
      role: 'ADMIN',
      profile: {
        create: {
          loyaltyTier: 'BESPOKE_VIP',
          spentTotal: 345000,
          preferences: JSON.stringify({ newsletter: true, currency: 'INR', style: 'Sartorial Evening' }),
        },
      },
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@bespokemilano.com',
      passwordHash: customerPasswordHash,
      name: 'Devon Sterling',
      phone: '+91 98112 34567',
      role: 'CUSTOMER',
      profile: {
        create: {
          loyaltyTier: 'PLATINUM',
          spentTotal: 68500,
          preferences: JSON.stringify({ newsletter: true, sizePreference: '48 / M' }),
        },
      },
      addresses: {
        create: [
          {
            fullName: 'Devon Sterling',
            phone: '+91 98112 34567',
            street: 'Villa 14, Golf Links, Lodhi Road',
            city: 'New Delhi',
            state: 'Delhi',
            pinCode: '110003',
            country: 'India',
            isDefault: true,
            type: 'HOME',
          },
          {
            fullName: 'Devon Sterling',
            phone: '+91 98112 34567',
            street: 'Executive Penthouse 8B, Maker Towers, Cuffe Parade',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400005',
            country: 'India',
            isDefault: false,
            type: 'WORK',
          },
        ],
      },
    },
  });

  console.log('Created admin and customer users.');

  // 2. Categories
  const categoriesData = [
    {
      name: 'Suits & Blazers',
      slug: 'suits-blazers',
      description: 'Hand-canvassed Italian tailoring in Super 150s wool, velvet and English mohair.',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
      displayOrder: 1,
    },
    {
      name: 'Designer Shirts',
      slug: 'designer-shirts',
      description: 'Egyptian Giza cotton and washed silk shirts cut with sculptural Italian collars.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1600&auto=format&fit=crop',
      displayOrder: 2,
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Hand-rolled Como silk pocket squares, 24k gold cufflinks and woven leather belts.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
      displayOrder: 3,
    },
    {
      name: 'Bags & Travel',
      slug: 'bags-travel',
      description: 'Full-grain Tuscan calfskin duffels, briefcases and artisanal weekender bags.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1600&auto=format&fit=crop',
      displayOrder: 4,
    },
    {
      name: 'Dresses & Eveningwear',
      slug: 'dresses-eveningwear',
      description: 'Floor-skimming silk crepe gowns, architectural corsetry and sculpted silhouettes.',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
      displayOrder: 5,
    },
    {
      name: 'Trousers & Footwear',
      slug: 'trousers-footwear',
      description: 'Double-pleated wool trousers and Goodyear-welted leather Chelsea boots and loafers.',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=1600&auto=format&fit=crop',
      displayOrder: 6,
    },
  ];

  const categories = {};
  for (const c of categoriesData) {
    categories[c.slug] = await prisma.category.create({ data: c });
  }
  console.log('Created categories.');

  // 3. Collections
  const collectionsData = [
    {
      name: 'The Signature Collection',
      slug: 'the-signature-collection',
      subtitle: 'An Expression of Individuality, Crafted with Intention',
      description: 'Sculptural eveningwear, tactile virgin wools, and handcrafted accents built for discerning longevity.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop',
      featured: true,
    },
    {
      name: 'The Italian Collection',
      slug: 'the-italian-collection',
      subtitle: 'Tailored Luxury for the Modern Icon',
      description: 'Mastered in Lombardy, where traditional Savile-level tailoring meets Milanese nonchalance.',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
      featured: true,
    },
    {
      name: 'The Dolce Collection',
      slug: 'the-dolce-collection',
      subtitle: 'A Tribute to Italian Craftsmanship',
      description: 'Opulent baroque jacquards, 24k gold embroidered buttons and midnight black velvet.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      featured: true,
    },
    {
      name: 'Sartoriale Silk & Cashmere',
      slug: 'sartoriale-silk-cashmere',
      subtitle: 'The Featherweight Renaissance',
      description: 'Sourced from the Biella valleys and woven into sublime double-faced overcoats and knitwear.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
      featured: true,
    },
    {
      name: 'Alta Notte Evening',
      slug: 'alta-notte-evening',
      subtitle: 'Uncompromising Gala & Black Tie',
      description: 'Dramatic architectural lapels, hand-pleated bibs and satin-striped evening trousers.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      featured: true,
    },
  ];

  const collections = {};
  for (const col of collectionsData) {
    collections[col.slug] = await prisma.collection.create({ data: col });
  }
  console.log('Created collections.');

  // 4. Products - 32 total products: 12 Men's, 12 Women's, 8 Accessories
  const productsData = [
    // --- MEN'S (12 Products) ---
    {
      name: 'Baroque Evening Blazer',
      slug: 'baroque-evening-blazer',
      sku: 'BM-M-BLZ-001',
      gender: 'MEN',
      price: 16999,
      salePrice: 14999,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'suits-blazers',
      collectionSlug: 'the-signature-collection',
      shortDescription: 'Tailored jacquard blazer accented with ornate baroque filigree and silk-satin lapels.',
      description: 'An architectural evening centerpiece woven with fine metallic gold threads against an obsidian black jacquard ground. Designed with sharp roped shoulders, a hand-stitched peak lapel and horn buttons finished with a bespoke crest.',
      fabricDetails: 'Outer: 65% Mulberry Silk, 35% Gold Lurex Jacquard; Lining: 100% Cupro Bemberg.',
      careInstructions: 'Specialist dry clean only. Steam with cloth guard. Store on wide wooden hanger with garment bag.',
      specifications: JSON.stringify({ Fit: 'Tailored Slim Drop 7', Construction: 'Full Floating Canvas', Lapel: 'Satin Peak Lapel 9.5cm', Origin: 'Biella, Italy' }),
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1555069519-127aadedf1ee?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '48 / M', colorName: 'Obsidian & Gold', colorHex: '#C5A46D', stock: 8 },
        { size: '50 / L', colorName: 'Obsidian & Gold', colorHex: '#C5A46D', stock: 6 },
        { size: '52 / XL', colorName: 'Obsidian & Gold', colorHex: '#C5A46D', stock: 4 },
        { size: '48 / M', colorName: 'Midnight Navy & Silver', colorHex: '#1E293B', stock: 5 },
        { size: '50 / L', colorName: 'Midnight Navy & Silver', colorHex: '#1E293B', stock: 4 },
      ]
    },
    {
      name: 'Textured Cotton Poplin Shirt',
      slug: 'textured-cotton-poplin-shirt',
      sku: 'BM-M-SHR-002',
      gender: 'MEN',
      price: 4999,
      salePrice: null,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'designer-shirts',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Crisp two-ply Giza cotton dress shirt with spread collar and mother-of-pearl buttons.',
      description: 'Spun from extra-long staple Giza 87 Egyptian cotton, this bespoke shirt offers an immaculate silky hand-feel and natural luster. Features an Italian spread collar, removable brass collar stays, and Australian mother-of-pearl buttons.',
      fabricDetails: '100% Two-Ply Giza Egyptian Cotton (140/2 yarn count).',
      careInstructions: 'Machine wash delicate at 30°C. Do not bleach. Warm iron damp.',
      specifications: JSON.stringify({ Collar: 'Italian Cutaway Spread', Cuffs: 'Mitered Two-Button Cuffs', Placket: 'French Front Clean Placket', Origin: 'Bergamo, Italy' }),
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1620012253295-c15c429fcc36?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '39 / 15.5', colorName: 'Crisp Ivory', colorHex: '#F5F0E8', stock: 12 },
        { size: '41 / 16.0', colorName: 'Crisp Ivory', colorHex: '#F5F0E8', stock: 15 },
        { size: '43 / 17.0', colorName: 'Crisp Ivory', colorHex: '#F5F0E8', stock: 8 },
        { size: '41 / 16.0', colorName: 'Raven Black', colorHex: '#171717', stock: 10 },
      ]
    },
    {
      name: 'Signature Silk-Cashmere Polo',
      slug: 'signature-silk-cashmere-polo',
      sku: 'BM-M-KNT-003',
      gender: 'MEN',
      price: 3999,
      salePrice: 3499,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'designer-shirts',
      collectionSlug: 'sartoriale-silk-cashmere',
      shortDescription: 'Ultra-fine 18-gauge knitted polo with open Johnny collar and ribbed trims.',
      description: 'The epitome of refined casual luxury. Blended from grade-A Mongolian cashmere and grade-6A Mulberry silk for breathability and unrivaled softness against the bare skin.',
      fabricDetails: '70% Silk, 30% Cashmere.',
      careInstructions: 'Hand wash cold with wool detergent. Dry flat in shade. Do not tumble dry.',
      specifications: JSON.stringify({ Gauge: '18-Gauge Fine Knit', Collar: 'Johnny Open Resort Collar', Origin: 'Perugia, Italy' }),
      images: [
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'S', colorName: 'Champagne Taupe', colorHex: '#D4C5B9', stock: 7 },
        { size: 'M', colorName: 'Champagne Taupe', colorHex: '#D4C5B9', stock: 14 },
        { size: 'L', colorName: 'Champagne Taupe', colorHex: '#D4C5B9', stock: 10 },
        { size: 'M', colorName: 'Charcoal Noir', colorHex: '#212121', stock: 9 },
      ]
    },
    {
      name: 'Tailored Double-Pleated Wool Trousers',
      slug: 'tailored-double-pleated-wool-trousers',
      sku: 'BM-M-TRS-004',
      gender: 'MEN',
      price: 6499,
      salePrice: null,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'trousers-footwear',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'High-waisted trousers with double forward pleats and extended side-tab adjusters.',
      description: 'Crafted with timeless sartorial proportions. High-rise waistline with gurkha-style side adjusters that eliminate the need for a belt, falling into an elegant drape with 2-inch turn-up cuffs.',
      fabricDetails: '100% Super 130s Merino Wool (280g/m).',
      careInstructions: 'Dry clean only. Press with wool setting.',
      specifications: JSON.stringify({ Rise: 'High Rise 11.5"', Waist: 'Side Tabs with Brass Buckles', Hem: '2" Turn-up Cuffs', Origin: 'Naples, Italy' }),
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '32 / 48', colorName: 'Piazza Charcoal', colorHex: '#383838', stock: 8 },
        { size: '34 / 50', colorName: 'Piazza Charcoal', colorHex: '#383838', stock: 12 },
        { size: '36 / 52', colorName: 'Piazza Charcoal', colorHex: '#383838', stock: 5 },
      ]
    },
    {
      name: 'Leather Low-Top Court Sneakers',
      slug: 'leather-low-top-court-sneakers',
      sku: 'BM-M-SHO-005',
      gender: 'MEN',
      price: 7999,
      salePrice: 6999,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'trousers-footwear',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Full-grain Italian calf leather sneakers with stitched Margom rubber cupsoles.',
      description: 'The definitive minimalist luxury sneaker. Made from vegetable-tanned nappa leather that ages with character. Hand-buffed edges and gold foil serial number stamped on the heel.',
      fabricDetails: 'Upper: 100% Italian Box Calf Leather; Sole: 100% Natural Rubber.',
      careInstructions: 'Condition with bespoke leather balm. Store with cedar shoe trees.',
      specifications: JSON.stringify({ Sole: 'Margom Italian Cupsole', Lining: 'Calfskin Leather', Origin: 'Civitanova Marche, Italy' }),
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'EU 41 / UK 7', colorName: 'Chalk White & Gold', colorHex: '#FDFBF7', stock: 6 },
        { size: 'EU 42 / UK 8', colorName: 'Chalk White & Gold', colorHex: '#FDFBF7', stock: 11 },
        { size: 'EU 43 / UK 9', colorName: 'Chalk White & Gold', colorHex: '#FDFBF7', stock: 7 },
        { size: 'EU 44 / UK 10', colorName: 'Chalk White & Gold', colorHex: '#FDFBF7', stock: 4 },
      ]
    },
    {
      name: 'Midnight Velvet Tuxedo Jacket',
      slug: 'midnight-velvet-tuxedo-jacket',
      sku: 'BM-M-BLZ-006',
      gender: 'MEN',
      price: 18999,
      salePrice: null,
      isFeatured: true,
      isNewArrival: false,
      categorySlug: 'suits-blazers',
      collectionSlug: 'alta-notte-evening',
      shortDescription: 'Plush Italian cotton-silk velvet tuxedo jacket with grosgrain shawl collar.',
      description: 'Channeling glamorous cinema evenings at the Venice Lido. Woven from deep indigo velvet with a deep pile that captures light dramatically.',
      fabricDetails: '82% Cotton, 18% Mulberry Silk Velvet; 100% Silk Grosgrain Facings.',
      careInstructions: 'Dry clean only by velvet specialist. Do not iron directly.',
      specifications: JSON.stringify({ Collar: 'Silk Grosgrain Shawl', Buttons: 'Hand-covered Silk Grosgrain', Vent: 'Sartorial Ventless' }),
      images: [
        'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '48 / M', colorName: 'Midnight Indigo', colorHex: '#0B132B', stock: 5 },
        { size: '50 / L', colorName: 'Midnight Indigo', colorHex: '#0B132B', stock: 6 },
        { size: '52 / XL', colorName: 'Midnight Indigo', colorHex: '#0B132B', stock: 3 },
      ]
    },
    {
      name: 'Double-Breasted Pinstripe Suit',
      slug: 'double-breasted-pinstripe-suit',
      sku: 'BM-M-SUT-007',
      gender: 'MEN',
      price: 24999,
      salePrice: 22499,
      isFeatured: false,
      isNewArrival: false,
      categorySlug: 'suits-blazers',
      collectionSlug: 'the-signature-collection',
      shortDescription: 'Six-on-two double-breasted power suit in chalk-stripe Super 150s wool.',
      description: 'An authoritative sartorial statement. Cut with generous 11cm peak lapels, roped shoulder expression, and fluid drape that honors 1940s Milanese tailoring.',
      fabricDetails: '100% Super 150s Virgin Wool by Vitale Barberis Canonico.',
      careInstructions: 'Specialist dry clean only. Brush after wearing.',
      specifications: JSON.stringify({ Construction: 'Full Canvas Horsehair', Buttons: 'Smoked Mother-of-Pearl', Style: '6x2 Double Breasted' }),
      images: [
        'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '48 / M', colorName: 'Navy Chalkstripe', colorHex: '#1B263B', stock: 4 },
        { size: '50 / L', colorName: 'Navy Chalkstripe', colorHex: '#1B263B', stock: 5 },
        { size: '52 / XL', colorName: 'Navy Chalkstripe', colorHex: '#1B263B', stock: 3 },
      ]
    },
    {
      name: 'Imperial Band Collar Silk Shirt',
      slug: 'imperial-band-collar-silk-shirt',
      sku: 'BM-M-SHR-008',
      gender: 'MEN',
      price: 5999,
      salePrice: null,
      isFeatured: false,
      isNewArrival: true,
      categorySlug: 'designer-shirts',
      collectionSlug: 'the-dolce-collection',
      shortDescription: 'Matte washed silk shirt with grandad mandarin collar and gold-trimmed buttons.',
      description: 'An understated luxury shirt designed for contemporary evening styling. Hand-finished seams with concealed fly front and discreet monogram embroidery on the cuff.',
      fabricDetails: '100% Heavy Mulberry Silk Crepe de Chine.',
      careInstructions: 'Dry clean or gentle hand wash in lukewarm water with silk shampoo.',
      specifications: JSON.stringify({ Collar: 'Grandad Mandarin Stand', Buttons: 'Concealed Fly Front', Fit: 'Relaxed Tailored' }),
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '39 / 15.5', colorName: 'Obsidian Noir', colorHex: '#0B0B0B', stock: 8 },
        { size: '41 / 16.0', colorName: 'Obsidian Noir', colorHex: '#0B0B0B', stock: 10 },
        { size: '43 / 17.0', colorName: 'Alabaster White', colorHex: '#F4F0E9', stock: 6 },
      ]
    },
    {
      name: 'Hand-Welted Wholecut Oxford Shoes',
      slug: 'hand-welted-wholecut-oxford-shoes',
      sku: 'BM-M-SHO-009',
      gender: 'MEN',
      price: 13999,
      salePrice: null,
      isFeatured: false,
      isNewArrival: false,
      categorySlug: 'trousers-footwear',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Crafted from a single piece of flawless museum calfskin with beveled fiddleback waist.',
      description: 'The pinnacle of formal footwear. Created by master artisans using a single skin cut without seams, featuring hand-painted patina and brass nail detailing.',
      fabricDetails: '100% French Museum Calf; Hand-carved Argentine Leather Sole.',
      careInstructions: 'Apply Saphir Medaille d’Or cream and wax polish regularly.',
      specifications: JSON.stringify({ Construction: 'Goodyear Welted with Fiddleback Waist', Patina: 'Hand-rubbed Espresso Burnish' }),
      images: [
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'EU 41', colorName: 'Espresso Patina', colorHex: '#3E2723', stock: 4 },
        { size: 'EU 42', colorName: 'Espresso Patina', colorHex: '#3E2723', stock: 6 },
        { size: 'EU 43', colorName: 'Espresso Patina', colorHex: '#3E2723', stock: 5 },
      ]
    },
    {
      name: 'Cashmere Double-Faced Overcoat',
      slug: 'cashmere-double-faced-overcoat',
      sku: 'BM-M-COT-010',
      gender: 'MEN',
      price: 29999,
      salePrice: 26999,
      isFeatured: true,
      isNewArrival: false,
      categorySlug: 'suits-blazers',
      collectionSlug: 'sartoriale-silk-cashmere',
      shortDescription: 'Unlined double-faced cashmere coat meticulously hand-split and blind-stitched.',
      description: 'Two layers of supreme cashmere split by hand along every seam and hand-turned inwards with thousands of invisible stitches. Incredibly lightweight yet extraordinarily warm.',
      fabricDetails: '100% Pure Mongolian Cashmere (550g/m).',
      careInstructions: 'Dry clean only. Store in breathable garment cover.',
      specifications: JSON.stringify({ Stitching: 'Sartorial Hand Blind-Stitch', Pockets: 'Flap Jet Pockets with Ticket Pocket' }),
      images: [
        'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '48 / M', colorName: 'Camel Melange', colorHex: '#C19A6B', stock: 3 },
        { size: '50 / L', colorName: 'Camel Melange', colorHex: '#C19A6B', stock: 4 },
        { size: '52 / XL', colorName: 'Onyx Black', colorHex: '#121212', stock: 2 },
      ]
    },
    {
      name: 'Pleated Linen Safari Jacket',
      slug: 'pleated-linen-safari-jacket',
      sku: 'BM-M-JKT-011',
      gender: 'MEN',
      price: 8999,
      salePrice: null,
      isFeatured: false,
      isNewArrival: true,
      categorySlug: 'suits-blazers',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Irish linen travel overshirt with box-pleat bellows pockets and self-fabric belt.',
      description: 'Inspired by Riviera expeditions. Breathable master-grade Irish linen washed with Italian spring water for effortless softness and structured drape.',
      fabricDetails: '100% Heavyweight Irish Linen (320g/m).',
      careInstructions: 'Dry clean or machine wash cold gentle.',
      specifications: JSON.stringify({ Belt: 'Removable Waist Belt', Pockets: '4 Box-Pleat Bellows Pockets' }),
      images: [
        'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'M', colorName: 'Olive Drab', colorHex: '#556B2F', stock: 6 },
        { size: 'L', colorName: 'Olive Drab', colorHex: '#556B2F', stock: 7 },
        { size: 'M', colorName: 'Sandstone Khaki', colorHex: '#C2B280', stock: 8 },
      ]
    },
    {
      name: 'Artisanal Woven Leather Loafers',
      slug: 'artisanal-woven-leather-loafers',
      sku: 'BM-M-SHO-012',
      gender: 'MEN',
      price: 9499,
      salePrice: null,
      isFeatured: false,
      isNewArrival: false,
      categorySlug: 'trousers-footwear',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Intrecciato hand-braided calfskin penny loafers with unlined softness.',
      description: 'Individually woven strips of glove-soft calfskin shaped onto a streamlined almond toe last. Crafted with Blake rapid construction for supreme flexibility from day one.',
      fabricDetails: '100% Braided Tuscan Calfskin.',
      careInstructions: 'Clean with soft bristle brush. Polish with neutral beeswax.',
      specifications: JSON.stringify({ Construction: 'Blake Rapid Flexible Stitched', Sole: 'Channel-Stitched Leather Sole' }),
      images: [
        'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'EU 41', colorName: 'Cognac Brown', colorHex: '#8B4513', stock: 5 },
        { size: 'EU 42', colorName: 'Cognac Brown', colorHex: '#8B4513', stock: 6 },
        { size: 'EU 43', colorName: 'Noir Black', colorHex: '#111111', stock: 4 },
      ]
    },

    // --- WOMEN'S (12 Products) ---
    {
      name: 'Architectural Silk Crepe Column Gown',
      slug: 'architectural-silk-crepe-column-gown',
      sku: 'BM-W-DRS-001',
      gender: 'WOMEN',
      price: 21999,
      salePrice: 19999,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'dresses-eveningwear',
      collectionSlug: 'alta-notte-evening',
      shortDescription: 'Sculptural floor-length gown with internal boned corset and draped asymmetric shoulder.',
      description: 'A masterpiece of Roman high fashion. Heavyweight silk double-crepe falls in a statuesque column, accented by a daring side slit and hand-draped godet train.',
      fabricDetails: '100% Pure Silk Morocain (4 ply); Silk Habilot Lining.',
      careInstructions: 'Professional haute couture dry clean only.',
      specifications: JSON.stringify({ Corsetry: 'Hand-Basted Internal Spiral Boning', Closure: 'Hand-sewn Invisible Zip with Silk Hook', Origin: 'Rome, Italy' }),
      images: [
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'IT 38 / XS', colorName: 'Obsidian Noir', colorHex: '#0B0B0B', stock: 3 },
        { size: 'IT 40 / S', colorName: 'Obsidian Noir', colorHex: '#0B0B0B', stock: 5 },
        { size: 'IT 42 / M', colorName: 'Obsidian Noir', colorHex: '#0B0B0B', stock: 4 },
        { size: 'IT 40 / S', colorName: 'Imperial Crimson', colorHex: '#800020', stock: 3 },
      ]
    },
    {
      name: 'Gold Filigree Tailored Blazer',
      slug: 'gold-filigree-tailored-blazer',
      sku: 'BM-W-BLZ-002',
      gender: 'WOMEN',
      price: 17499,
      salePrice: null,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'suits-blazers',
      collectionSlug: 'the-signature-collection',
      shortDescription: 'Couture hourglass jacket with hand-cast 24k gold lion buttons and velvet collar.',
      description: 'Sensual yet formidable. Cinched waist tailored to celebrate the feminine form, framed with midnight black velvet notched lapels and exquisite gold rope passementerie.',
      fabricDetails: 'Wool Crepe 85%, Silk 15%; Italian Cotton Velvet Accents.',
      careInstructions: 'Specialist dry clean only. Protect metal hardware during cleaning.',
      specifications: JSON.stringify({ Silhouette: 'Hourglass Cinched Peplum', Buttons: 'Hand-Cast 24k Gold Plated Brass' }),
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'IT 38 / XS', colorName: 'Black & Gold', colorHex: '#C5A46D', stock: 4 },
        { size: 'IT 40 / S', colorName: 'Black & Gold', colorHex: '#C5A46D', stock: 6 },
        { size: 'IT 42 / M', colorName: 'Black & Gold', colorHex: '#C5A46D', stock: 3 },
      ]
    },
    {
      name: 'Cascading Silk Georgette Blouse',
      slug: 'cascading-silk-georgette-blouse',
      sku: 'BM-W-SHR-003',
      gender: 'WOMEN',
      price: 5499,
      salePrice: 4799,
      isFeatured: true,
      isNewArrival: false,
      categorySlug: 'designer-shirts',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Airy silk georgette blouse featuring an elongated lavallière bow and bishop sleeves.',
      description: 'Ethereal sophistication. Designed to flutter gracefully with every movement, finished with elongated cuffs adorned with bespoke gold filigree shank buttons.',
      fabricDetails: '100% Mulberry Silk Georgette.',
      careInstructions: 'Hand wash gently in cold water with silk rinse. Dry flat.',
      specifications: JSON.stringify({ Collar: 'Convertible Lavallière Pussy-Bow', Sleeves: 'Voluminous Bishop Sleeves' }),
      images: [
        'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'IT 38 / XS', colorName: 'Pearl White', colorHex: '#FDFBF7', stock: 8 },
        { size: 'IT 40 / S', colorName: 'Pearl White', colorHex: '#FDFBF7', stock: 12 },
        { size: 'IT 42 / M', colorName: 'Pearl White', colorHex: '#FDFBF7', stock: 7 },
        { size: 'IT 40 / S', colorName: 'Champagne Gold', colorHex: '#E0C18A', stock: 5 },
      ]
    },
    {
      name: 'Pleated Wide-Leg Palazzo Trousers',
      slug: 'pleated-wide-leg-palazzo-trousers',
      sku: 'BM-W-TRS-004',
      gender: 'WOMEN',
      price: 6999,
      salePrice: null,
      isFeatured: false,
      isNewArrival: true,
      categorySlug: 'trousers-footwear',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'High-rise flowing palazzo trousers in fluid virgin wool cady with floor grazing drape.',
      description: 'Effortless grandeur. Cut with deep inverted pleats that create sweeping volume when walking, paired with a clean waistband and discreet side zip.',
      fabricDetails: '96% Virgin Wool, 4% Elastane Cady.',
      careInstructions: 'Dry clean only. Steam press.',
      specifications: JSON.stringify({ Rise: 'Super High Waist 12.5"', 'Leg Opening': 'Wide 24" Palazzo' }),
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'IT 38', colorName: 'Ivory Cream', colorHex: '#F4F0E9', stock: 5 },
        { size: 'IT 40', colorName: 'Ivory Cream', colorHex: '#F4F0E9', stock: 9 },
        { size: 'IT 42', colorName: 'Jet Black', colorHex: '#121212', stock: 6 },
      ]
    },
    {
      name: 'Sculpted Leather Corset Belt',
      slug: 'sculpted-leather-corset-belt',
      sku: 'BM-W-ACC-005',
      gender: 'WOMEN',
      price: 4499,
      salePrice: null,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'accessories',
      collectionSlug: 'the-dolce-collection',
      shortDescription: 'Molded calfskin wide belt with dual baroque gold buckles to define the waist.',
      description: 'Hand-burnished Italian harness leather curved to sit flush against overcoats, blazers or fluid dresses. Finished with engraved antique gold hardware.',
      fabricDetails: '100% Vegetable-Tanned Saddle Leather; Solid Brass Hardware.',
      careInstructions: 'Wipe with soft cloth. Keep away from direct sunlight and water.',
      specifications: JSON.stringify({ Width: '10cm at back contouring to 7cm at front', Hardware: '24k Gold Plated Brass' }),
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'S (65-75cm)', colorName: 'Nero Black & Gold', colorHex: '#0B0B0B', stock: 7 },
        { size: 'M (75-85cm)', colorName: 'Nero Black & Gold', colorHex: '#0B0B0B', stock: 10 },
      ]
    },
    {
      name: 'Cashmere Belted Wrap Coat',
      slug: 'cashmere-belted-wrap-coat',
      sku: 'BM-W-COT-006',
      gender: 'WOMEN',
      price: 27999,
      salePrice: 24999,
      isFeatured: true,
      isNewArrival: false,
      categorySlug: 'suits-blazers',
      collectionSlug: 'sartoriale-silk-cashmere',
      shortDescription: 'Sumptuous double-faced zibeline cashmere coat with exaggerated shawl collar.',
      description: 'Crafted with the iconic rippled zibeline finish that glimmers softly in natural light. Relaxed kimono-cut sleeves with a wide sash belt that knots effortlessly.',
      fabricDetails: '100% Premium Zibeline Finished Cashmere.',
      careInstructions: 'Specialist dry clean only.',
      specifications: JSON.stringify({ Finish: 'Rippled Zibeline Wave', Closure: 'Self-Fabric Tie Sash Belt' }),
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'IT 38 / XS', colorName: 'Vicuna Tan', colorHex: '#C5A059', stock: 3 },
        { size: 'IT 40 / S', colorName: 'Vicuna Tan', colorHex: '#C5A059', stock: 4 },
        { size: 'IT 42 / M', colorName: 'Nero Black', colorHex: '#141414', stock: 3 },
      ]
    },
    {
      name: 'Pleated Metallic Brocade Cocktail Dress',
      slug: 'pleated-metallic-brocade-cocktail-dress',
      sku: 'BM-W-DRS-007',
      gender: 'WOMEN',
      price: 15999,
      salePrice: null,
      isFeatured: false,
      isNewArrival: true,
      categorySlug: 'dresses-eveningwear',
      collectionSlug: 'the-dolce-collection',
      shortDescription: 'Fit-and-flare cocktail dress woven with gold botanical motifs and sweetheart neckline.',
      description: 'A dazzling celebration of Italian celebratory style. Heavy brocade jacquard holds an architectural bell skirt complete with concealed silk-lined pockets.',
      fabricDetails: 'Silk Brocade 70%, Metal Thread 30%.',
      careInstructions: 'Dry clean only.',
      specifications: JSON.stringify({ Silhouette: 'Bell Fit-and-Flare', Length: 'Midi Knee Length 105cm' }),
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'IT 38', colorName: 'Gold Tapestry', colorHex: '#D4AF37', stock: 4 },
        { size: 'IT 40', colorName: 'Gold Tapestry', colorHex: '#D4AF37', stock: 6 },
        { size: 'IT 42', colorName: 'Gold Tapestry', colorHex: '#D4AF37', stock: 2 },
      ]
    },
    {
      name: 'Stiletto Suede Pointed Pumps',
      slug: 'stiletto-suede-pointed-pumps',
      sku: 'BM-W-SHO-008',
      gender: 'WOMEN',
      price: 8499,
      salePrice: null,
      isFeatured: false,
      isNewArrival: false,
      categorySlug: 'trousers-footwear',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Sculpted 105mm heels in velvety Tuscan goat suede with signature gold sole accent.',
      description: 'Handcrafted in Parabiago by third-generation shoemakers. Cut low across the vamp to elongate the leg, finished with padded memory leather insoles.',
      fabricDetails: 'Upper: 100% Kid Suede; Sole: Hand-lacquered Italian Leather.',
      careInstructions: 'Protect with suede spray. Brush with rubber crepe brush.',
      specifications: JSON.stringify({ Heel: '105mm Lacquered Stiletto', Insole: 'Ergonomic Memory Foam Arch' }),
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'EU 37', colorName: 'Noir Suede', colorHex: '#1A1A1A', stock: 5 },
        { size: 'EU 38', colorName: 'Noir Suede', colorHex: '#1A1A1A', stock: 8 },
        { size: 'EU 39', colorName: 'Noir Suede', colorHex: '#1A1A1A', stock: 6 },
      ]
    },
    {
      name: 'Silk Slip Dress in Liquid Gold',
      slug: 'silk-slip-dress-in-liquid-gold',
      sku: 'BM-W-DRS-009',
      gender: 'WOMEN',
      price: 11999,
      salePrice: 9999,
      isFeatured: true,
      isNewArrival: false,
      categorySlug: 'dresses-eveningwear',
      collectionSlug: 'the-signature-collection',
      shortDescription: 'Bias-cut 22-momme silk satin slip dress that drapes liquidly across the body.',
      description: 'The sensual 90s minimalism re-envisioned with master Italian bias cutting. Featuring delicate spaghetti straps and a low cowl back.',
      fabricDetails: '100% Grade 6A Mulberry Silk Satin (22 momme).',
      careInstructions: 'Dry clean or cold hand wash with silk detergent.',
      specifications: JSON.stringify({ Cut: 'True 45° Bias Cut', Back: 'Deep Scoop Cowl Back' }),
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'IT 38', colorName: 'Liquid Champagne', colorHex: '#F7E7CE', stock: 5 },
        { size: 'IT 40', colorName: 'Liquid Champagne', colorHex: '#F7E7CE', stock: 7 },
        { size: 'IT 42', colorName: 'Liquid Champagne', colorHex: '#F7E7CE', stock: 4 },
      ]
    },
    {
      name: 'Double-Breasted Wool Tuxedo Blazer',
      slug: 'double-breasted-wool-tuxedo-blazer',
      sku: 'BM-W-BLZ-010',
      gender: 'WOMEN',
      price: 15499,
      salePrice: null,
      isFeatured: false,
      isNewArrival: true,
      categorySlug: 'suits-blazers',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Feminine Le Smoking blazer in Super 130s wool with contrasting satin lapels.',
      description: 'Empowerment through tailoring. Strong padded shoulders, elongated torso line and welt pockets cut at an elegant angle.',
      fabricDetails: '100% Super 130s Wool with Duchesse Satin Lapels.',
      careInstructions: 'Dry clean only.',
      specifications: JSON.stringify({ Fit: 'Slightly Oversized Boy-Fit', Lapels: 'Duchesse Silk Satin Peak' }),
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'IT 38', colorName: 'Tuxedo Black', colorHex: '#0F0F0F', stock: 6 },
        { size: 'IT 40', colorName: 'Tuxedo Black', colorHex: '#0F0F0F', stock: 8 },
        { size: 'IT 42', colorName: 'Tuxedo Black', colorHex: '#0F0F0F', stock: 4 },
      ]
    },
    {
      name: 'Fine Pleated Silk Chiffon Maxi Skirt',
      slug: 'fine-pleated-silk-chiffon-maxi-skirt',
      sku: 'BM-W-SKR-011',
      gender: 'WOMEN',
      price: 8999,
      salePrice: null,
      isFeatured: false,
      isNewArrival: false,
      categorySlug: 'dresses-eveningwear',
      collectionSlug: 'sartoriale-silk-cashmere',
      shortDescription: 'Sunray pleated multi-layered silk chiffon skirt with satin waistband.',
      description: 'Hypnotic kinetic movement. Hundreds of precision sunray knife pleats radiate from a fitted waistband down to a gentle floor brush.',
      fabricDetails: 'Outer: 100% Silk Chiffon; Underlay: 100% Silk Habotai.',
      careInstructions: 'Specialist pleat-preserving dry clean only.',
      specifications: JSON.stringify({ Pleats: 'Permanent Sunray Accordion', Waistband: '2.5cm Grosgrain Lined' }),
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'IT 38', colorName: 'Muted Gold', colorHex: '#C5A46D', stock: 4 },
        { size: 'IT 40', colorName: 'Muted Gold', colorHex: '#C5A46D', stock: 6 },
        { size: 'IT 42', colorName: 'Muted Gold', colorHex: '#C5A46D', stock: 3 },
      ]
    },
    {
      name: 'Cashmere Knit Turtleneck Sweater',
      slug: 'cashmere-knit-turtleneck-sweater',
      sku: 'BM-W-KNT-012',
      gender: 'WOMEN',
      price: 6499,
      salePrice: 5499,
      isFeatured: false,
      isNewArrival: true,
      categorySlug: 'designer-shirts',
      collectionSlug: 'sartoriale-silk-cashmere',
      shortDescription: 'Sublime 12-gauge seamless knit turtleneck in un-dyed organic cashmere.',
      description: 'Spun from the finest underfleece of Capra Hircus goats. Seamless whole-garment 3D knitting technology ensures zero chafing and a glove-like contour.',
      fabricDetails: '100% Pure Organic Cashmere (2-ply).',
      careInstructions: 'Hand wash cold. Dry flat on a clean towel.',
      specifications: JSON.stringify({ Knitting: 'Seamless Whole-Garment 3D Knit', Neck: 'Soft Ribbed Roll Neck' }),
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'XS', colorName: 'Oatmeal Heather', colorHex: '#D7CEC7', stock: 5 },
        { size: 'S', colorName: 'Oatmeal Heather', colorHex: '#D7CEC7', stock: 9 },
        { size: 'M', colorName: 'Oatmeal Heather', colorHex: '#D7CEC7', stock: 8 },
      ]
    },

    // --- ACCESSORIES & BAGS (8 Products) ---
    {
      name: 'Tuscan Calfskin Travel Duffle Bag',
      slug: 'tuscan-calfskin-travel-duffle-bag',
      sku: 'BM-A-BAG-001',
      gender: 'UNISEX',
      price: 18499,
      salePrice: 16999,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'bags-travel',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Full-grain vegetable-tanned leather weekender with heavy brass zippers and luggage tag.',
      description: 'Engineered for discerning jetsetters. Crafted in Santa Croce sull’Arno from thick full-grain bovine leather that develops a rich, glossy patina over decades.',
      fabricDetails: '100% Full Grain Tuscan Calfskin; Solid Antiqued Brass Hardware; Cotton Canvas Lining.',
      careInstructions: 'Clean with damp cloth and apply organic leather cream bi-annually.',
      specifications: JSON.stringify({ Dimensions: '52 x 28 x 25 cm', Capacity: '36 Liters (Cabin Approved)', ShoulderStrap: 'Detachable Padded Leather Strap' }),
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'One Size', colorName: 'Chestnut Saddle', colorHex: '#6F4E37', stock: 6 },
        { size: 'One Size', colorName: 'Midnight Obsidian', colorHex: '#141414', stock: 7 },
      ]
    },
    {
      name: 'Lake Como Silk Twill Pocket Square',
      slug: 'lake-como-silk-twill-pocket-square',
      sku: 'BM-A-ACC-002',
      gender: 'MEN',
      price: 1899,
      salePrice: null,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'accessories',
      collectionSlug: 'the-dolce-collection',
      shortDescription: 'Hand-rolled 16-momme silk twill square featuring Renaissance fresco motifs.',
      description: 'Screen-printed in the historic silk mills of Como, Italy. Every edge is meticulously rolled and sewn by hand with silk thread taking over 45 minutes per piece.',
      fabricDetails: '100% Pure Mulberry Silk Twill (16 momme).',
      careInstructions: 'Dry clean only. Press lightly on reverse side.',
      specifications: JSON.stringify({ Dimensions: '42 x 42 cm', Hem: 'Hand-Rolled & Stitched Roulé Edges', Print: '18-Screen Hand Silkscreen' }),
      images: [
        'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '42 x 42 cm', colorName: 'Gold & Cobalt Baroque', colorHex: '#C5A46D', stock: 25 },
        { size: '42 x 42 cm', colorName: 'Emerald & Bronze', colorHex: '#2E8B57', stock: 18 },
      ]
    },
    {
      name: '24k Gold-Plated Heraldic Cufflinks',
      slug: '24k-gold-plated-heraldic-cufflinks',
      sku: 'BM-A-ACC-003',
      gender: 'MEN',
      price: 3299,
      salePrice: null,
      isFeatured: false,
      isNewArrival: true,
      categorySlug: 'accessories',
      collectionSlug: 'the-dolce-collection',
      shortDescription: 'Lost-wax cast brass cufflinks electroplated with 3 microns of 24-karat gold.',
      description: 'Bearing the historic Bespoke Milano crest with an eagle and laurels. Hand-enameled black background creates high contrast against the polished relief.',
      fabricDetails: 'Solid Jeweler Brass with 24k Gold Micron Plating and Cold Vitreous Enamel.',
      careInstructions: 'Buff with provided jeweler’s cloth. Keep in presentation box.',
      specifications: JSON.stringify({ Closure: 'Swivel T-Bar Clasp', Dimensions: '18mm Diameter', Plating: '3-Micron Hard 24k Gold' }),
      images: [
        'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'Standard', colorName: '24k Polished Gold', colorHex: '#FFD700', stock: 15 },
      ]
    },
    {
      name: 'Monogrammed Leather Flap Clutch',
      slug: 'monogrammed-leather-flap-clutch',
      sku: 'BM-A-BAG-004',
      gender: 'WOMEN',
      price: 9999,
      salePrice: 8499,
      isFeatured: true,
      isNewArrival: false,
      categorySlug: 'bags-travel',
      collectionSlug: 'the-signature-collection',
      shortDescription: 'Structured evening envelope clutch in glossy croco-embossed leather with gold chain.',
      description: 'An iconic silhouette for black-tie galas. Magnetic closure, satin lining with slip pockets for cards and phone, and a detachable braided gold chain strap.',
      fabricDetails: 'Crocodile-Embossed Italian Calf Leather; Velvet Microfiber Lining.',
      careInstructions: 'Store in soft dust bag away from dampness.',
      specifications: JSON.stringify({ Dimensions: '26 x 15 x 5 cm', Chain: 'Detachable 50cm Gold Curb Chain' }),
      images: [
        'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: 'One Size', colorName: 'Jet Gloss Croc', colorHex: '#0D0D0D', stock: 9 },
        { size: 'One Size', colorName: 'Ivory Bone Croc', colorHex: '#F0ECE1', stock: 6 },
      ]
    },
    {
      name: 'Reversible Woven Dress Belt',
      slug: 'reversible-woven-dress-belt',
      sku: 'BM-A-ACC-005',
      gender: 'MEN',
      price: 3499,
      salePrice: null,
      isFeatured: false,
      isNewArrival: false,
      categorySlug: 'accessories',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Reversible French box calf belt with twist-mechanism polished palladium buckle.',
      description: 'Two versatile styles in one. Reverses smoothly between rich dark mocha and timeless jet black with a simple pull-and-twist of the engineered buckle.',
      fabricDetails: '100% French Box Calfskin; Solid Palladium Finish Brass Buckle.',
      careInstructions: 'Wipe clean with dry cloth.',
      specifications: JSON.stringify({ Width: '32mm Formal Width', Mechanism: 'Engineered Quick-Twist Buckle' }),
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '90 cm (32-34")', colorName: 'Black / Espresso Reversible', colorHex: '#222222', stock: 12 },
        { size: '100 cm (36-38")', colorName: 'Black / Espresso Reversible', colorHex: '#222222', stock: 10 },
      ]
    },
    {
      name: 'Bespoke Milano Signature Fragrance (100ml)',
      slug: 'bespoke-milano-signature-fragrance',
      sku: 'BM-A-FRG-006',
      gender: 'UNISEX',
      price: 6999,
      salePrice: null,
      isFeatured: true,
      isNewArrival: true,
      categorySlug: 'accessories',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Eau de Parfum with top notes of Calabrian bergamot, Tuscan leather and Florentine iris.',
      description: 'An evocative olfactory portrait of twilight in the Piazza del Duomo. Notes of smoked cedarwood, ambrette seed and saffron melt into a sensual base of golden amber.',
      fabricDetails: 'Heavy Crystal Glass Flacon with 24k Gold Zamak Cap; 25% Pure Perfume Oil.',
      careInstructions: 'Store in cool place away from direct sunlight.',
      specifications: JSON.stringify({ Concentration: 'Eau De Parfum (25% Extrait)', Nose: 'Master Perfumer Grasse, France', Size: '100ml / 3.4 fl. oz.' }),
      images: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '100 ml', colorName: 'Amber Nectar', colorHex: '#E0A96D', stock: 20 },
      ]
    },
    {
      name: 'Aviator Acetate & Titanium Sunglasses',
      slug: 'aviator-acetate-titanium-sunglasses',
      sku: 'BM-A-EYE-007',
      gender: 'UNISEX',
      price: 7499,
      salePrice: 6499,
      isFeatured: false,
      isNewArrival: true,
      categorySlug: 'accessories',
      collectionSlug: 'the-italian-collection',
      shortDescription: 'Mazzucchelli acetate sunglasses with Japanese titanium bridge and Carl Zeiss lenses.',
      description: 'Handcrafted in Cadore, the historic cradle of Italian eyewear. Premium anti-reflective polarized green lenses offer 100% UVA/UVB protection.',
      fabricDetails: 'Hand-Polished Mazzucchelli 1849 Acetate; Beta Titanium; Zeiss CR-39 Lenses.',
      careInstructions: 'Clean with microfiber pouch. Do not use abrasive cleaners.',
      specifications: JSON.stringify({ Lens: 'Polarized Category 3 Carl Zeiss', Protection: '100% UV400 Rating' }),
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '54-19-145', colorName: 'Havana Tortoise & Gold', colorHex: '#7B3F00', stock: 11 },
        { size: '54-19-145', colorName: 'Gloss Black & Gold', colorHex: '#0A0A0A', stock: 8 },
      ]
    },
    {
      name: 'Cashmere Stole with Hand-Fringed Ends',
      slug: 'cashmere-stole-hand-fringed',
      sku: 'BM-A-STP-008',
      gender: 'UNISEX',
      price: 5299,
      salePrice: null,
      isFeatured: false,
      isNewArrival: false,
      categorySlug: 'accessories',
      collectionSlug: 'sartoriale-silk-cashmere',
      shortDescription: 'Featherlight 200x70cm woven cashmere wrap in natural ivory with delicate eyelash fringes.',
      description: 'So soft and lightweight it passes through a wedding ring. Woven on traditional shuttle looms in Biella from pristine unbleached white cashmere.',
      fabricDetails: '100% Ultra-Fine Cashmere.',
      careInstructions: 'Dry clean only or delicate cold water wash.',
      specifications: JSON.stringify({ Dimensions: '200 x 70 cm', Finish: 'Hand-Twisted Eyelash Fringes' }),
      images: [
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop'
      ],
      variants: [
        { size: '200 x 70 cm', colorName: 'Ivory Cloud', colorHex: '#FDFCF7', stock: 14 },
        { size: '200 x 70 cm', colorName: 'Charcoal Ombre', colorHex: '#3A3A3A', stock: 10 },
      ]
    },
  ];

  for (const item of productsData) {
    const category = categories[item.categorySlug];
    const collection = item.collectionSlug ? collections[item.collectionSlug] : null;

    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        gender: item.gender,
        price: item.price,
        salePrice: item.salePrice,
        isFeatured: item.isFeatured,
        isNewArrival: item.isNewArrival,
        shortDescription: item.shortDescription,
        description: item.description,
        fabricDetails: item.fabricDetails,
        careInstructions: item.careInstructions,
        specifications: item.specifications,
        categoryId: category.id,
        collectionId: collection ? collection.id : null,
      },
    });

    // Create images
    for (let i = 0; i < item.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: item.images[i],
          altText: `${item.name} - Luxury Editorial View ${i + 1}`,
          isPrimary: i === 0,
          displayOrder: i,
        },
      });
    }

    // Create variants
    for (let vIdx = 0; vIdx < item.variants.length; vIdx++) {
      const v = item.variants[vIdx];
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex,
          sku: `${item.sku}-${v.size.replace(/[^a-zA-Z0-9]/g, '')}-${vIdx}`,
          stockQuantity: v.stock,
        },
      });
    }

    // Create verified reviews for flagship products
    if (item.isFeatured) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: customerUser.id,
          rating: 5,
          title: 'Exquisite Italian Craftsmanship',
          comment: 'The quality of the drape and hand-stitched detailing exceeds Savile Row standards. Packaging was immaculate with cedar hanger and garment cover.',
          isVerifiedPurchase: true,
        },
      });
    }
  }
  console.log(`Created ${productsData.length} luxury products with variants and images.`);

  // 5. Hero Banners (3 slides)
  const bannersData = [
    {
      title: 'BESPOKE WEAR',
      subtitle: 'Tailored Luxury for the Modern Icon.',
      tag: 'THE ITALIAN COLLECTION',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1920&auto=format&fit=crop',
      linkUrl: '/collections/the-italian-collection',
      ctaText: 'SHOP MEN',
      placement: 'HERO',
      displayOrder: 1,
    },
    {
      title: 'ALTA NOTTE',
      subtitle: 'Black Tie & Gala Grandeur Inspired by Venice.',
      tag: 'EVENING COUTURE',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop',
      linkUrl: '/collections/alta-notte-evening',
      ctaText: 'SHOP WOMEN',
      placement: 'HERO',
      displayOrder: 2,
    },
    {
      title: 'SILK & CASHMERE',
      subtitle: 'Featherlight Elegance Sourced from Biella.',
      tag: 'NEW ARRIVALS 2026',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1920&auto=format&fit=crop',
      linkUrl: '/collections/sartoriale-silk-cashmere',
      ctaText: 'EXPLORE COLLECTION',
      placement: 'HERO',
      displayOrder: 3,
    },
  ];

  for (const b of bannersData) {
    await prisma.banner.create({ data: b });
  }
  console.log('Created hero banners.');

  // 6. Active Discount Coupons
  const couponsData = [
    {
      code: 'MILANO10',
      description: 'Exclusive 10% welcome privilege across all collections.',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 2000,
      maxDiscount: 5000,
      isActive: true,
    },
    {
      code: 'ROYALVIP',
      description: 'Complimentary ₹2,500 privilege voucher for orders above ₹10,000.',
      discountType: 'FIXED',
      discountValue: 2500,
      minOrderValue: 10000,
      maxDiscount: null,
      isActive: true,
    },
    {
      code: 'BESPOKE500',
      description: 'Instant ₹500 saving on your first bespoke purchase.',
      discountType: 'FIXED',
      discountValue: 500,
      minOrderValue: 3000,
      maxDiscount: null,
      isActive: true,
    },
  ];

  for (const cp of couponsData) {
    await prisma.coupon.create({ data: cp });
  }
  console.log('Created coupons.');

  // 7. Demonstration Orders with Indian shipping addresses
  const sampleProduct1 = await prisma.product.findUnique({ where: { slug: 'baroque-evening-blazer' } });
  const sampleProduct2 = await prisma.product.findUnique({ where: { slug: 'textured-cotton-poplin-shirt' } });
  const sampleProduct3 = await prisma.product.findUnique({ where: { slug: 'tuscan-calfskin-travel-duffle-bag' } });

  const ordersData = [
    {
      orderNumber: 'BM-2026-8801',
      userId: customerUser.id,
      customerEmail: 'customer@bespokemilano.com',
      customerName: 'Devon Sterling',
      customerPhone: '+91 98112 34567',
      shippingAddress: JSON.stringify({
        fullName: 'Devon Sterling',
        phone: '+91 98112 34567',
        street: 'Villa 14, Golf Links, Lodhi Road',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110003',
        country: 'India'
      }),
      shippingMethod: 'EXPRESS',
      subtotal: 16999,
      discount: 1699.9,
      shippingFee: 0,
      total: 15299.1,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'RAZORPAY',
      razorpayOrderId: 'order_test_98801',
      razorpayPaymentId: 'pay_test_98801',
      trackingNumber: 'BM-FEDEX-902184',
      carrier: 'Bespoke White-Glove Courier',
      items: [
        {
          productId: sampleProduct1.id,
          productName: sampleProduct1.name,
          productPrice: 16999,
          size: '50 / L',
          color: 'Obsidian & Gold',
          quantity: 1,
          subtotal: 16999,
          imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
        },
      ],
    },
    {
      orderNumber: 'BM-2026-8794',
      userId: customerUser.id,
      customerEmail: 'customer@bespokemilano.com',
      customerName: 'Devon Sterling',
      customerPhone: '+91 98112 34567',
      shippingAddress: JSON.stringify({
        fullName: 'Devon Sterling',
        phone: '+91 98112 34567',
        street: 'Executive Penthouse 8B, Maker Towers, Cuffe Parade',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400005',
        country: 'India'
      }),
      shippingMethod: 'STANDARD',
      subtotal: 23498,
      discount: 2500,
      shippingFee: 0,
      total: 20998,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      paymentMethod: 'RAZORPAY',
      razorpayOrderId: 'order_test_98794',
      razorpayPaymentId: 'pay_test_98794',
      trackingNumber: 'BM-DHL-667102',
      carrier: 'DHL Express VIP',
      items: [
        {
          productId: sampleProduct2.id,
          productName: sampleProduct2.name,
          productPrice: 4999,
          size: '41 / 16.0',
          color: 'Crisp Ivory',
          quantity: 1,
          subtotal: 4999,
          imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop',
        },
        {
          productId: sampleProduct3.id,
          productName: sampleProduct3.name,
          productPrice: 18499,
          size: 'One Size',
          color: 'Chestnut Saddle',
          quantity: 1,
          subtotal: 18499,
          imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
        },
      ],
    },
  ];

  for (const ord of ordersData) {
    const { items, ...orderHeader } = ord;
    const createdOrder = await prisma.order.create({
      data: {
        ...orderHeader,
        items: {
          create: items,
        },
        payments: {
          create: {
            amount: orderHeader.total,
            status: 'PAID',
            gateway: 'RAZORPAY',
            gatewayOrderId: orderHeader.razorpayOrderId,
            gatewayPaymentId: orderHeader.razorpayPaymentId,
            gatewaySignature: 'sig_mock_signature_verified_2026',
          },
        },
      },
    });
  }
  console.log('Created sample orders and payments.');

  // 8. Newsletter Subscribers
  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: 'vogue.editor@editorial.com' },
      { email: 'patron.collector@bespokemilano.com' },
      { email: 'allegra.versari@milano.it' },
    ],
  });

  console.log('--- Luxury Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
