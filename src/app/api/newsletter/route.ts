import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalized },
    });

    const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'EXAMPLE E-COM';

    if (existing) {
      return NextResponse.json({ success: true, message: `You are already subscribed to the ${brandName} Gazette.` });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: normalized },
    });

    return NextResponse.json({
      success: true,
      message: `Welcome to the world of ${brandName}. Your private invitation code MILANO10 has been unlocked.`,
    });
  } catch (error: any) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

