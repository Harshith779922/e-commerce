import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const collection = searchParams.get('collection');
    const gender = searchParams.get('gender');
    const isFeatured = searchParams.get('featured');
    const isNewArrival = searchParams.get('newArrival');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'featured';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const where: any = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }

    if (collection) {
      where.collection = { slug: collection };
    }

    if (gender) {
      where.gender = { in: [gender.toUpperCase(), 'UNISEX'] };
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (isNewArrival === 'true') {
      where.isNewArrival = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { shortDescription: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-high') {
      orderBy = { price: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'featured') {
      orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
        category: true,
        collection: true,
      },
    });

    return NextResponse.json({ products, total: products.length });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      price,
      salePrice,
      gender,
      isFeatured,
      isNewArrival,
      categoryId,
      collectionId,
      fabricDetails,
      careInstructions,
      images,
      variants,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku,
        description,
        shortDescription,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        gender: gender || 'UNISEX',
        isFeatured: Boolean(isFeatured),
        isNewArrival: Boolean(isNewArrival),
        categoryId,
        collectionId: collectionId || null,
        fabricDetails,
        careInstructions,
        images: {
          create: images?.map((img: any, i: number) => ({
            url: img.url,
            altText: img.altText || name,
            isPrimary: i === 0,
            displayOrder: i,
          })) || [],
        },
        variants: {
          create: variants?.map((v: any, vIdx: number) => ({
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex || '#000000',
            sku: `${sku}-${v.size}-${vIdx}`,
            stockQuantity: parseInt(v.stockQuantity) || 10,
          })) || [],
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Product create error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

