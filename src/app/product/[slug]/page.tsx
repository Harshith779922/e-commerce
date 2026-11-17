import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { Product } from '@/lib/types';

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
      isActive: true,
    },
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      variants: true,
      category: true,
      collection: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Recommended products in the same category or collection
  const recommended = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      OR: [
        { categoryId: product.categoryId },
        { collectionId: product.collectionId || undefined },
      ],
    },
    take: 4,
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      variants: true,
      category: true,
    },
  });

  // Frequently bought together companion product
  const companion = await prisma.product.findFirst({
    where: {
      isActive: true,
      id: { not: product.id },
      category: { slug: 'accessories' },
    },
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      variants: true,
    },
  });

  return (
    <ProductDetailClient
      product={product as unknown as Product}
      recommended={recommended as unknown as Product[]}
      companion={companion as unknown as Product | null}
    />
  );
}

