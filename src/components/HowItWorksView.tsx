import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Gavel, 
  Lock, 
  Truck, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface HowItWorksViewProps {
  onStartBidding: () => void;
  onConsignItem: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onStartBidding,
  onConsignItem,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does CURIO guarantee fair bidding without race conditions?',
      a: 'We implement rigorous database pessimistic row locking (SELECT ... FOR UPDATE) inside atomic transactions. When a bid arrives, the auction row is exclusively locked on the server until timestamp validation, credit checks, and minimum increments are verified. This ensures no two concurrent bids collide, and every bidder receives instantaneous deterministic confirmation.',
    },
    {
      q: 'What is the CURIO Escrow Vault guarantee?',
      a: 'When you win an auction or purchase through Buy Now, your payment is held securely in our neutral escrow account. Funds are released to the consignor only after our white-glove armored logistics delivers the item and you confirm satisfactory receipt.',
    },
    {
      q: 'What happens if the Reserve Price is not met?',
      a: 'If bidding closes below the confidential Reserve Price set by the consignor, the lot is marked "UNSOLD". The highest bidder may enter into a private treaty negotiation with the consignor facilitated by our senior specialists.',
    },
    {
      q: 'What are the buyer and seller fees?',
      a: 'For buyers, CURIO applies a standard 5% platform escrow & provenance guarantee fee. For consignors, we offer transparent commission tiers from 5% to 8%, which includes professional catalog photography, physical grading, and insured storage.',
    },
    {
      q: 'Can I inspect an item in person before placing a bid?',
      a: 'Yes. Accredited collectors may request a private viewing appointment at any of our global salerooms in London Mayfair, New York Madison Avenue, Geneva, or Tokyo Ginza by using our Book Online consultation service.',
    },
    {
      q: 'How does the Buy Now option work in an active auction?',
      a: 'Certain consignors enable an immediate "Buy Now" price. Any authenticated collector can exercise Buy Now at any time before the final gavel falls, instantly closing the lot and transferring it to the escrow checkout vault.',
    },
  ];

  return (
    <div className="bg-white min-h-[85vh]">
      {/* Header */}
      <section className="bg-[#0b1726] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-800 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="font-mono-num text-[11px] uppercase tracking-widest text-[#bfa054] font-bold block">
            THE COLLECTOR'S PRIMER
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-normal tracking-tight text-white leading-tight">
            How Curio Auctions Work
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto font-light leading-relaxed">
            A transparent four-stage process designed to protect collectors, preserve historical integrity, and guarantee absolute escrow security.
          </p>
        </div>
      </section>

      {/* 4-Step Process Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="p-6 bg-[#f8f9fb] border border-neutral-200 rounded-xl space-y-4 relative">
            <span className="font-mono-num text-3xl font-extrabold text-[#bfa054]">01</span>
            <h3 className="font-serif-luxury text-xl font-semibold text-[#0c1926]">
              Browse & Authenticate
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Explore high-resolution macro photography, manufacturer references, origin dates, and multi-angle condition reports prepared by our curators.
            </p>
            <div className="pt-2 text-[11px] text-[#bfa054] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Specialist Verified</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-[#f8f9fb] border border-neutral-200 rounded-xl space-y-4 relative">
            <span className="font-mono-num text-3xl font-extrabold text-[#bfa054]">02</span>
            <h3 className="font-serif-luxury text-xl font-semibold text-[#0c1926]">
              Register & Authorize
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Create an accredited collector profile. Seamlessly participate across multiple active saleroom sessions in both INR (₹) and USD ($).
            </p>
            <div className="pt-2 text-[11px] text-[#bfa054] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Instant Credentialing</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-[#f8f9fb] border border-neutral-200 rounded-xl space-y-4 relative">
            <span className="font-mono-num text-3xl font-extrabold text-[#bfa054]">03</span>
            <h3 className="font-serif-luxury text-xl font-semibold text-[#0c1926]">
              Atomic Real-Time Bids
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Place manual bids or quick increments. Pessimistic row locking ensures zero lost bids and prevents race condition collisions.
            </p>
            <div className="pt-2 text-[11px] text-[#bfa054] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Immutable Audit Ledger</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 bg-[#f8f9fb] border border-neutral-200 rounded-xl space-y-4 relative">
            <span className="font-mono-num text-3xl font-extrabold text-[#bfa054]">04</span>
            <h3 className="font-serif-luxury text-xl font-semibold text-[#0c1926]">
              Escrow & Armored Transit
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Winning bids are settled via our insured escrow vault. Our armored courier delivers your item directly into your hands with white-glove care.
            </p>
            <div className="pt-2 text-[11px] text-[#bfa054] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Insured Custody Handover</span>
            </div>
          </div>
        </div>

        {/* Feature Comparison / Fee Transparency Table */}
        <div className="bg-[#f8f9fb] border border-neutral-200 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono-num uppercase tracking-wider text-[#bfa054] font-bold">
              TRANSPARENT ECONOMICS
            </span>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#0c1926]">
              Saleroom Premium & Commission Schedule
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-mono-num uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Buyer Premium</th>
                  <th className="py-3 px-4">Consignor Commission</th>
                  <th className="py-3 px-4">Insurance & Transit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                <tr>
                  <td className="py-3 px-4 font-semibold text-neutral-900">Standard Lots (under $10,000)</td>
                  <td className="py-3 px-4 font-mono-num">5.0% Escrow Fee</td>
                  <td className="py-3 px-4 font-mono-num">8.0% Net Payout</td>
                  <td className="py-3 px-4">Fully Insured White-Glove</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-neutral-900">Marquee Lots ($10,000 - $50,000)</td>
                  <td className="py-3 px-4 font-mono-num">4.0% Escrow Fee</td>
                  <td className="py-3 px-4 font-mono-num">6.5% Net Payout</td>
                  <td className="py-3 px-4">Complimentary Armored Courier</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-neutral-900">Museum / High-Value ($50,000+)</td>
                  <td className="py-3 px-4 font-mono-num">3.0% Escrow Fee</td>
                  <td className="py-3 px-4 font-mono-num">5.0% Bespoke</td>
                  <td className="py-3 px-4">Private Vault Custody Transfer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono-num uppercase tracking-wider text-[#bfa054] font-bold">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h3 className="font-serif-luxury text-3xl font-bold text-[#0c1926]">
              Everything You Need to Know
            </h3>
          </div>

          <div className="space-y-3 pt-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-neutral-200 rounded-xl overflow-hidden bg-white transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0c1926] hover:text-[#bfa054] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#bfa054]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-neutral-600 leading-relaxed font-light border-t border-neutral-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#0b1726] rounded-2xl p-8 sm:p-12 text-center text-white space-y-6">
          <h3 className="font-serif-luxury text-3xl font-normal">
            Begin Your Collection Today
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-light">
            Bid on active museum-grade pieces or consign your rare collectibles to a worldwide network of accredited collectors.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartBidding}
              className="px-8 py-3 bg-[#bfa054] hover:bg-[#a98c42] text-white font-bold text-xs tracking-widest uppercase rounded cursor-pointer transition-colors shadow-lg"
            >
              Explore Active Lots
            </button>
            <button
              onClick={onConsignItem}
              className="px-8 py-3 bg-transparent hover:bg-white/10 text-white border border-neutral-600 font-semibold text-xs tracking-widest uppercase rounded cursor-pointer transition-colors"
            >
              Consign a Collectible
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
