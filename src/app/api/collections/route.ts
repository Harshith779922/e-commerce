import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ collections });
  } catch (error: any) {
    console.error('Collections error:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

