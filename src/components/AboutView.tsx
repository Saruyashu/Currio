import React from 'react';
import { ShieldCheck, Award, Globe, Building2, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface AboutViewProps {
  onExploreClick: () => void;
  onBookConsignment: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onExploreClick, onBookConsignment }) => {
  return (
    <div className="bg-white min-h-[85vh]">
      {/* Editorial Header */}
      <section className="bg-[#0b1726] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <span className="font-mono-num text-[11px] uppercase tracking-widest text-[#bfa054] font-bold block">
            THE CURIO HERITAGE & PROVENANCE
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-normal tracking-tight text-white leading-tight">
            Curators of Rarity, <br />
            Guardians of History
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            CURIO is an accredited digital auction house and private saleroom dedicated to fine mechanical timepieces, archaic numismatics, certified folios, and historical memorabilia.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-16 sm:py-20 border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-[11px] font-mono-num uppercase tracking-wider text-[#bfa054] font-bold block">
                OUR PHILOSOPHY
              </span>
              <h2 className="font-serif-luxury text-3xl font-normal text-[#0c1926] leading-snug">
                Where Archival Rigor Meets Modern Saleroom Technology
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                Established as an alternative to chaotic open marketplaces, CURIO bridges the timeless connoisseurship of traditional London and Geneva auction houses with real-time atomic transaction engines.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                Every lot consigned through our salerooms undergoes multi-spectral analysis, archival reference checks, and physical custody authentication before bidding opens.
              </p>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-neutral-200">
              <img
                src={resolveImageUrl('/images/curio_hero_banner_1791467008185.jpg')}
                alt="CURIO Gallery Saleroom Exhibition"
                onError={handleImageError}
                className="w-full h-full object-cover filter contrast-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Pillars of Curation */}
      <section className="bg-[#f8f9fb] py-16 sm:py-20 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono-num uppercase tracking-wider text-[#bfa054] font-bold block">
              COLLECTOR ASSURANCE
            </span>
            <h3 className="font-serif-luxury text-3xl font-normal text-[#0c1926]">
              Our Guiding Standards
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 font-light">
              Rigorous governance protecting accredited buyers and consignors alike.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-[#bfa054] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">
                100% Provenance Warranty
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Every object carries our perpetual warranty of authenticity backed by physical specialist examination.
              </p>
            </div>

            <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-800 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">
                Specialist Curators
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Department heads with decades of scholarship across horology, numismatics, and classical antiquities.
              </p>
            </div>

            <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">
                Atomic Escrow Vault
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Funds are held in secure escrow custody until white-glove armored delivery is confirmed by the recipient.
              </p>
            </div>

            <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">
                Fair Bidding Protocol
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Pessimistic database row locking completely eliminates race conditions, sniper exploits, and lost bids.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Salerooms */}
      <section className="py-16 sm:py-20 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono-num uppercase tracking-wider text-[#bfa054] font-bold block">
              GLOBAL PRESENCE
            </span>
            <h3 className="font-serif-luxury text-3xl font-normal text-[#0c1926]">
              Private Viewing Salerooms
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 font-light">
              Visit our gallery locations by appointment for private lot inspections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-6 border border-neutral-200 rounded-xl space-y-2 bg-neutral-50">
              <span className="text-[#bfa054] font-bold font-mono-num uppercase">LONDON MAYFAIR</span>
              <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">Mayfair Saleroom</h4>
              <p className="text-neutral-600 leading-relaxed">
                24 Old Bond Street, Mayfair<br />
                London W1S 4PB, United Kingdom
              </p>
              <p className="text-neutral-400 font-mono-num pt-1">+44 (0) 20 7946 0912</p>
            </div>

            <div className="p-6 border border-neutral-200 rounded-xl space-y-2 bg-neutral-50">
              <span className="text-[#bfa054] font-bold font-mono-num uppercase">NEW YORK</span>
              <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">Madison Avenue Gallery</h4>
              <p className="text-neutral-600 leading-relaxed">
                980 Madison Avenue, 4th Floor<br />
                New York, NY 10075, United States
              </p>
              <p className="text-neutral-400 font-mono-num pt-1">+1 (212) 555-0188</p>
            </div>

            <div className="p-6 border border-neutral-200 rounded-xl space-y-2 bg-neutral-50">
              <span className="text-[#bfa054] font-bold font-mono-num uppercase">GENEVA</span>
              <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">Rue du Rhône Vault</h4>
              <p className="text-neutral-600 leading-relaxed">
                Rue du Rhône 42<br />
                1204 Genève, Switzerland
              </p>
              <p className="text-neutral-400 font-mono-num pt-1">+41 22 555 0142</p>
            </div>

            <div className="p-6 border border-neutral-200 rounded-xl space-y-2 bg-neutral-50">
              <span className="text-[#bfa054] font-bold font-mono-num uppercase">TOKYO GINZA</span>
              <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">Ginza Exhibition Room</h4>
              <p className="text-neutral-600 leading-relaxed">
                6-10-1 Ginza, Chuo-ku<br />
                Tokyo 104-0061, Japan
              </p>
              <p className="text-neutral-400 font-mono-num pt-1">+81 3 5555 0199</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0b1726] py-16 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h3 className="font-serif-luxury text-3xl font-normal">
            Ready to Discover Rare Collectibles?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto">
            Browse our current active lots or schedule a private consultation with our curatorial board.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="px-8 py-3 bg-[#bfa054] hover:bg-[#a98c42] text-white font-bold text-xs tracking-widest uppercase rounded cursor-pointer transition-colors"
            >
              Explore Current Lots
            </button>
            <button
              onClick={onBookConsignment}
              className="px-8 py-3 bg-transparent hover:bg-white/10 text-white border border-neutral-600 font-semibold text-xs tracking-widest uppercase rounded cursor-pointer transition-colors"
            >
              Consign an Item
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
