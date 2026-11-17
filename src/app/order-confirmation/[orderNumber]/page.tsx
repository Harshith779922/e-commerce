import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatINR } from '@/lib/utils';
import { CheckCircle, Truck, Package, Clock, ShieldCheck, Printer, ArrowRight } from 'lucide-react';
import PrintButton from './PrintButton';

export const revalidate = 0;

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { orderNumber: params.orderNumber },
        { id: params.orderNumber },
      ],
    },
    include: {
      items: true,
      payments: true,
    },
  });

  if (!order) {
    notFound();
  }

  let addressObj: any = {};
  try {
    addressObj = JSON.parse(order.shippingAddress);
  } catch (e) {
    addressObj = { street: order.shippingAddress };
  }

  const estimatedDateStr = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : 'Within 3-4 business days';

  return (
    <div className="bg-[#0B0B0B] text-[#F5F0E8] min-h-screen pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center space-y-4 pb-12 border-b border-[#262626]">
          <div className="w-16 h-16 rounded-full border border-[#C5A46D] bg-[#C5A46D]/10 flex items-center justify-center mx-auto text-[#C5A46D]">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-mono tracking-megaLuxury uppercase text-[#C5A46D] block">
            Payment Verified & Authenticated
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F5F0E8] uppercase tracking-wide font-light">
            Thank You, {order.customerName}
          </h1>
          <p className="text-xs sm:text-sm text-[#A8A29A] max-w-lg mx-auto font-light leading-relaxed">
            Your consignment has been confirmed and scheduled with the Milanese packaging atelier. A formal receipt has been dispatched to <span className="text-[#F5F0E8] font-mono">{order.customerEmail}</span>.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <span className="px-4 py-2 bg-[#171717] border border-[#34312D]">
              Order Number: <strong className="text-[#C5A46D]">{order.orderNumber}</strong>
            </span>
            <span className="px-4 py-2 bg-[#171717] border border-[#34312D]">
              Tracking: <strong className="text-[#F5F0E8]">{order.trackingNumber || 'Assigned in 12h'}</strong>
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="my-10 p-6 bg-[#121212] border border-[#2B2B2B]">
          <h3 className="font-serif text-xs uppercase tracking-widest text-[#C5A46D] mb-6">
            Consignment Lifecycle
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-wider">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#C5A46D] text-black font-bold flex items-center justify-center mx-auto">
                ✓
              </div>
              <p className="font-semibold text-[#F5F0E8]">Confirmed</p>
              <p className="text-[9px] text-[#A8A29A]">Payment Verified</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#C5A46D] text-[#C5A46D] flex items-center justify-center mx-auto animate-pulse">
                2
              </div>
              <p className="font-semibold text-[#F5F0E8]">Atelier Care</p>
              <p className="text-[9px] text-[#A8A29A]">Hand Pressed</p>
            </div>
            <div className="space-y-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#444] text-[#888] flex items-center justify-center mx-auto">
                3
              </div>
              <p className="text-[#A8A29A]">In Transit</p>
              <p className="text-[9px] text-[#666]">White-Glove Courier</p>
            </div>
            <div className="space-y-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#444] text-[#888] flex items-center justify-center mx-auto">
                4
              </div>
              <p className="text-[#A8A29A]">Delivered</p>
              <p className="text-[9px] text-[#666]">{estimatedDateStr}</p>
            </div>
          </div>
        </div>

        {/* Consignment Items & Invoice Table */}
        <div className="bg-[#121212] border border-[#2B2B2B] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4">
            <h2 className="font-serif text-lg tracking-widest uppercase">
              Bespoke Consignment Details
            </h2>
            <PrintButton />
          </div>

          <div className="divide-y divide-[#222]">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-20 object-cover border border-[#2B2B2B]"
                    />
                  )}
                  <div>
                    <h4 className="font-serif text-sm text-[#F5F0E8]">{item.productName}</h4>
                    <p className="text-[11px] text-[#A8A29A] mt-0.5">
                      Size: <span className="font-mono text-[#F5F0E8]">{item.size}</span> | Hue: {item.color} | Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-sans font-medium text-[#C5A46D]">
                  {formatINR(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-[#262626] space-y-2 text-xs text-[#A8A29A]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#F5F0E8] font-mono">{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#C5A46D]">
                <span>Privilege Discount</span>
                <span className="font-mono">- {formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Consignment Delivery ({order.shippingMethod})</span>
              <span className="text-[#F5F0E8] font-mono">
                {order.shippingFee === 0 ? 'Complimentary' : formatINR(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif text-[#F5F0E8] pt-3 border-t border-[#262626]">
              <span>Grand Total Paid</span>
              <span className="text-[#C5A46D] font-sans font-bold text-lg">
                {formatINR(order.total)}
              </span>
            </div>
          </div>

          {/* Delivery & Payment Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#262626] text-xs">
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#C5A46D] mb-2">
                Shipping Destination
              </h4>
              <p className="text-[#F5F0E8] font-medium">{order.customerName}</p>
              <p className="text-[#A8A29A]">{addressObj.building || ''} {addressObj.street}</p>
              <p className="text-[#A8A29A]">{addressObj.city}, {addressObj.state} - {addressObj.pinCode}</p>
              <p className="text-[#A8A29A]">{addressObj.country || 'India'}</p>
              <p className="text-[11px] text-[#A8A29A] font-mono mt-1">Tel: {order.customerPhone}</p>
            </div>

            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#C5A46D] mb-2">
                Payment Verification
              </h4>
              <p className="text-[#A8A29A]">Gateway: <span className="text-[#F5F0E8]">Razorpay Verified</span></p>
              <p className="text-[#A8A29A]">Status: <span className="text-green-400 font-bold uppercase">{order.paymentStatus}</span></p>
              <p className="text-[#A8A29A]">Transaction Ref: <span className="font-mono text-[#F5F0E8]">{order.razorpayPaymentId || 'pay_verified_2026'}</span></p>
              <p className="text-[#A8A29A] mt-2">Estimated Arrival: <span className="text-[#C5A46D] font-medium">{estimatedDateStr}</span></p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A] transition-colors"
          >
            Return to Boutique Atelier <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

