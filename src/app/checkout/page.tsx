'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { formatINR } from '@/lib/utils';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smartphone,
  Building,
  RotateCcw,
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shipping, total, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();

  // Current step (1: Info & Address, 2: Shipping, 3: Payment)
  const [currentStep, setCurrentStep] = useState(1);

  // Customer & Shipping Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Devon Sterling',
    email: user?.email || 'customer@bespokemilano.com',
    phone: user?.phone || '+91 98112 34567',
    houseBuilding: 'Villa 14',
    street: 'Golf Links, Lodhi Road',
    city: 'New Delhi',
    state: 'Delhi',
    pinCode: '110003',
    country: 'India',
    notes: 'Please gift wrap in signature gold ribbon',
  });

  const [shippingMethod, setShippingMethod] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');
  const [paymentGatewayMethod, setPaymentGatewayMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('patron@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('742');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If user changes, pre-populate
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // If bag is empty, redirect
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      // Allow if we just finished checkout
    }
  }, [items, isProcessing]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F0E8] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl mb-2">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-[#A8A29A] mb-6">Select pieces before entering the private checkout atelier.</p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold"
        >
          Explore Boutique
        </Link>
      </div>
    );
  }

  // Handle Form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.pinCode) {
      setErrorMessage('Please fill in all mandatory customer and delivery address fields.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  // Step progression
  const handleNextToShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculated totals with dynamic shipping
  const shippingCharge = (subtotal >= 4999 ? 0 : 450) + (shippingMethod === 'EXPRESS' ? 350 : 0);
  const finalPayable = Math.max(0, subtotal - discount + shippingCharge);

  // Complete Payment & Verify via Backend
  const handleExecutePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Request Razorpay Order & validation from Backend
      const orderInitRes = await fetch('/api/checkout/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          couponCode: coupon?.code,
          shippingMethod,
        }),
      });

      const initData = await orderInitRes.json();
      if (!orderInitRes.ok) {
        throw new Error(initData.error || 'Server rejected order initialization');
      }

      // 2. Razorpay Transaction / Verified Mock Signature
      const razorpayOrderId = initData.razorpayOrderId;
      const razorpayPaymentId = `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const razorpaySignature = `rzp_sig_verified_${Date.now()}`;

      // 3. Verify Payment on Backend (verifies stock, transactions, registers audit log, creates Order in DB)
      const verifyRes = await fetch('/api/checkout/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          customer: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          address: {
            building: formData.houseBuilding,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
            country: formData.country,
          },
          shippingMethod,
          items,
          couponCode: coupon?.code,
          notes: formData.notes,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment signature verification failed.');
      }

      // 4. Clear client cart and route to confirmation
      clearCart();
      router.push(`/order-confirmation/${verifyData.orderNumber}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Payment processing failed. Please check details and retry.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#0B0B0B] text-[#F5F0E8] min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Step Indicators */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <Link href="/" className="inline-block mb-3">
            <span className="font-serif text-2xl tracking-[0.25em] text-[#F5F0E8] uppercase">
              {settings.brandName}
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#A8A29A]">
            <span className={currentStep >= 1 ? 'text-[#C5A46D] font-bold' : ''}>1. Address</span>
            <span>—</span>
            <span className={currentStep >= 2 ? 'text-[#C5A46D] font-bold' : ''}>2. Delivery</span>
            <span>—</span>
            <span className={currentStep >= 3 ? 'text-[#C5A46D] font-bold' : ''}>3. Payment</span>
          </div>
        </div>

        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          {/* Left Column: Form Steps (7 Cols) */}
          <div className="lg:col-span-7 bg-[#121212] border border-[#2B2B2B] p-6 sm:p-8 space-y-8">
            {/* STEP 1: Customer Information & Delivery Address */}
            {currentStep === 1 && (
              <form onSubmit={handleNextToShipping} className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-[#F5F0E8] tracking-widest uppercase mb-1">
                    Client & Delivery Address
                  </h2>
                  <p className="text-xs text-[#A8A29A] font-light">
                    Ensure details match your residential or business premises for secure delivery.
                  </p>
                </div>

                {/* Customer Info */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-[#34312D] px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                        Email Address (for order updates) *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#34312D] px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#34312D] px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Info */}
                <div className="space-y-4 pt-4 border-t border-[#262626]">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                      Apartment / Suite / Villa / Building *
                    </label>
                    <input
                      type="text"
                      name="houseBuilding"
                      required
                      value={formData.houseBuilding}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-[#34312D] px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                      Street Address & Landmark *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-[#34312D] px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#34312D] px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#34312D] px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pinCode"
                        required
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#34312D] px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                      Bespoke Packaging Instructions
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-[#34312D] px-3.5 py-2 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#9A7B4F] via-[#C5A46D] to-[#E0C18A] text-black font-semibold text-xs tracking-widestLuxury uppercase hover:brightness-110 transition-all shadow-luxury flex items-center justify-center gap-2"
                >
                  Continue to Shipping Method <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Shipping Method */}
            {currentStep === 2 && (
              <form onSubmit={handleNextToPayment} className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-[#F5F0E8] tracking-widest uppercase mb-1">
                    Select Consignment Method
                  </h2>
                  <p className="text-xs text-[#A8A29A] font-light">
                    Every order is sealed in cedar-scented protective wardrobe packaging.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Standard Option */}
                  <label
                    onClick={() => setShippingMethod('STANDARD')}
                    className={`block p-4 border cursor-pointer transition-all ${
                      shippingMethod === 'STANDARD'
                        ? 'border-[#C5A46D] bg-[#171717]'
                        : 'border-[#2B2B2B] bg-[#141414] hover:border-[#444]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === 'STANDARD'}
                          onChange={() => setShippingMethod('STANDARD')}
                          className="accent-[#C5A46D]"
                        />
                        <div>
                          <p className="font-serif text-sm text-[#F5F0E8] font-medium">
                            Bespoke Standard Delivery
                          </p>
                          <p className="text-xs text-[#A8A29A] mt-0.5">
                            Delivered in 3–5 business days with live consignment tracking.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#C5A46D]">
                        {subtotal >= 4999 ? 'COMPLIMENTARY' : '₹450'}
                      </span>
                    </div>
                  </label>

                  {/* Express Option */}
                  <label
                    onClick={() => setShippingMethod('EXPRESS')}
                    className={`block p-4 border cursor-pointer transition-all ${
                      shippingMethod === 'EXPRESS'
                        ? 'border-[#C5A46D] bg-[#171717]'
                        : 'border-[#2B2B2B] bg-[#141414] hover:border-[#444]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === 'EXPRESS'}
                          onChange={() => setShippingMethod('EXPRESS')}
                          className="accent-[#C5A46D]"
                        />
                        <div>
                          <p className="font-serif text-sm text-[#F5F0E8] font-medium flex items-center gap-2">
                            White-Glove VIP Express
                            <span className="text-[9px] px-2 py-0.5 bg-[#C5A46D] text-black font-bold uppercase">
                              Priority
                            </span>
                          </p>
                          <p className="text-xs text-[#A8A29A] mt-0.5">
                            Guaranteed 24–48 hour delivery with dedicated personal courier delivery slot.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#C5A46D]">
                        {subtotal >= 4999 ? '₹350' : '₹800'}
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3.5 border border-[#34312D] text-xs uppercase tracking-widest text-[#A8A29A] hover:text-[#F5F0E8]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-[#9A7B4F] via-[#C5A46D] to-[#E0C18A] text-black font-semibold text-xs tracking-widestLuxury uppercase hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Payment (Razorpay Integration Simulation) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-[#F5F0E8] tracking-widest uppercase mb-1">
                    Razorpay Secure Payment
                  </h2>
                  <p className="text-xs text-[#A8A29A] font-light">
                    Select payment method. Orders are cryptographically verified and authorized.
                  </p>
                </div>

                {/* Gateway Tab Selectors */}
                <div className="grid grid-cols-3 gap-2 border-b border-[#262626] pb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentGatewayMethod('UPI')}
                    className={`py-2.5 px-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                      paymentGatewayMethod === 'UPI'
                        ? 'border-[#C5A46D] bg-[#1C1C1C] text-[#C5A46D] font-bold'
                        : 'border-[#2B2B2B] text-[#A8A29A]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> UPI Instant
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentGatewayMethod('CARD')}
                    className={`py-2.5 px-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                      paymentGatewayMethod === 'CARD'
                        ? 'border-[#C5A46D] bg-[#1C1C1C] text-[#C5A46D] font-bold'
                        : 'border-[#2B2B2B] text-[#A8A29A]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentGatewayMethod('NETBANKING')}
                    className={`py-2.5 px-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                      paymentGatewayMethod === 'NETBANKING'
                        ? 'border-[#C5A46D] bg-[#1C1C1C] text-[#C5A46D] font-bold'
                        : 'border-[#2B2B2B] text-[#A8A29A]'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" /> Net Banking
                  </button>
                </div>

                {/* Method Specific details */}
                {paymentGatewayMethod === 'UPI' && (
                  <div className="p-4 bg-[#171717] border border-[#2B2B2B] space-y-3">
                    <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A]">
                      Virtual Payment Address / UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobile@upi or name@okhdfcbank"
                      className="w-full bg-[#121212] border border-[#34312D] px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C5A46D]"
                    />
                    <p className="text-[10px] text-[#A8A29A]">
                      Supported: Google Pay, PhonePe, Paytm, BHIM, CRED, Apple Pay.
                    </p>
                  </div>
                )}

                {paymentGatewayMethod === 'CARD' && (
                  <div className="p-4 bg-[#171717] border border-[#2B2B2B] space-y-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#121212] border border-[#34312D] px-3.5 py-2 text-xs text-[#F5F0E8] font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-[#121212] border border-[#34312D] px-3.5 py-2 text-xs text-[#F5F0E8] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-[#121212] border border-[#34312D] px-3.5 py-2 text-xs text-[#F5F0E8] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentGatewayMethod === 'NETBANKING' && (
                  <div className="p-4 bg-[#171717] border border-[#2B2B2B] space-y-3">
                    <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A]">
                      Select Premium Banking Institution
                    </label>
                    <select className="w-full bg-[#121212] border border-[#34312D] px-3.5 py-2.5 text-xs text-[#F5F0E8]">
                      <option>HDFC Bank Imperia</option>
                      <option>ICICI Bank Wealth Management</option>
                      <option>Axis Bank Burgundy</option>
                      <option>State Bank of India Premier</option>
                      <option>Kotak Mahindra Silk / Wealth</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={isProcessing}
                    className="px-6 py-4 border border-[#34312D] text-xs uppercase tracking-widest text-[#A8A29A] hover:text-[#F5F0E8]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-gradient-to-r from-[#9A7B4F] via-[#C5A46D] to-[#E0C18A] text-black font-semibold text-xs tracking-widestLuxury uppercase hover:brightness-110 transition-all shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {isProcessing ? 'Verifying Transaction with Razorpay...' : `Authorize & Pay ${formatINR(finalPayable)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 bg-[#121212] border border-[#2B2B2B] p-6 space-y-6">
            <h2 className="font-serif text-lg text-[#F5F0E8] tracking-widest uppercase pb-3 border-b border-[#262626]">
              Consignment Review
            </h2>

            {/* Item List */}
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 divide-y divide-[#222]">
              {items.map((item) => (
                <div key={item.id} className="pt-3 flex gap-4 items-center justify-between text-xs">
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-18 object-cover border border-[#2b2b2b]"
                    />
                    <div>
                      <h4 className="font-serif text-xs text-[#F5F0E8] font-medium">{item.name}</h4>
                      <p className="text-[11px] text-[#A8A29A]">
                        Qty: {item.quantity} | {item.size} | {item.color}
                      </p>
                    </div>
                  </div>
                  <span className="font-sans font-medium text-[#C5A46D]">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-[#A8A29A] pt-4 border-t border-[#262626]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#F5F0E8] font-mono">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#C5A46D]">
                  <span>Privilege Savings ({coupon?.code})</span>
                  <span className="font-mono">- {formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Consignment Courier</span>
                <span className="text-[#F5F0E8] font-mono">
                  {shippingCharge === 0 ? <span className="text-[#C5A46D] font-medium">Complimentary</span> : formatINR(shippingCharge)}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif text-[#F5F0E8] pt-3 border-t border-[#262626] font-medium">
                <span>Total Amount</span>
                <span className="text-[#C5A46D] font-sans font-bold text-lg">
                  {formatINR(finalPayable)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#171717] border border-[#262626] text-[11px] text-[#A8A29A] space-y-1 font-light">
              <p className="font-medium text-[#F5F0E8] flex items-center gap-1.5 font-serif uppercase tracking-wider text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A46D]" /> The Bespoke Guarantee
              </p>
              <p>Every piece is certified authentic, inspected by our Milanese quality control atelier, and insured for total replacement during transit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

