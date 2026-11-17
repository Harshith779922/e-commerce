import React from 'react';
import prisma from '@/lib/prisma';
import { formatINR } from '@/lib/utils';
import { Users, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      profile: true,
      orders: {
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      },
      addresses: true,
    },
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#242424] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-megaLuxury uppercase text-[#C5A46D] block mb-1">
            Client Relations Atelier
          </span>
          <h1 className="font-serif text-3xl text-[#F5F0E8] uppercase tracking-wide font-light">
            Patron Directory ({users.length})
          </h1>
        </div>
      </div>

      <div className="bg-[#121212] border border-[#2B2B2B] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#242424] text-[#C5A46D] font-mono text-[10px] uppercase">
              <th className="py-3 px-4">Patron Name</th>
              <th className="py-3 px-4">Role / Tier</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Orders Placed</th>
              <th className="py-3 px-4">Lifetime Spend</th>
              <th className="py-3 px-4">Enrolled Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C1C]">
            {users.map((u) => {
              const spent = u.orders.reduce((sum, o) => sum + o.total, 0);
              return (
                <tr key={u.id} className="hover:bg-[#171717]">
                  <td className="py-3 px-4">
                    <p className="font-serif text-xs text-[#F5F0E8] font-medium">{u.name}</p>
                    <p className="text-[10px] text-[#A8A29A] font-mono">{u.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-[#C5A46D] text-black'
                          : 'bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30'
                      }`}
                    >
                      {u.role === 'ADMIN' ? 'Atelier Director' : `${u.profile?.loyaltyTier || 'Silver'} Member`}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#A8A29A]">
                    {u.phone || 'Private Concierge Line'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#F5F0E8]">
                    {u.orders.length} consignments
                  </td>
                  <td className="py-3 px-4 font-sans font-medium text-[#C5A46D]">
                    {formatINR(spent)}
                  </td>
                  <td className="py-3 px-4 text-[#777] font-mono text-[10px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

