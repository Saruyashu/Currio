import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface HeroSectionProps {
  onExploreClick: () => void;
  onLotClick: (auctionId: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onLotClick,
}) => {
  const { auctions } = useMarketplace();
  const featuredAuction = auctions[0] || { id: 1 };

  return (
    <section className="relative overflow-hidden bg-[#0a0d14] border-b border-neutral-900 min-h-[520px] lg:min-h-[640px] flex items-center">
      {/* Background Texture on Dark Slate */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-[#0d121c]/90 to-transparent z-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Script Calligraphy & Editorial Text matching Screenshot 1 */}
          <div className="lg:col-span-7 space-y-6">
            {/* Ghosted serif overlay and script heading */}
            <div className="relative">
              <span className="absolute -top-6 left-2 font-serif text-5xl sm:text-7xl text-white/5 font-serif select-none pointer-events-none">
                laisish
              </span>

              <h1 className="font-script text-6xl sm:text-7xl lg:text-8xl text-white font-normal leading-[0.95] tracking-wide drop-shadow-md">
                The Art of <br />
                Collecting
              </h1>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 max-w-lg leading-relaxed font-light">
              Discover a premium marketplace for high-end collectibles and rare memorabilia. Experience a gallery-like browsing experience designed for the serious collector.
            </p>

            <div className="pt-2">
              <button
                onClick={onExploreClick}
                className="px-8 py-3.5 bg-[#101924] hover:bg-[#162232] border border-[#202f45] text-neutral-200 hover:text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-md cursor-pointer"
              >
                EXPLORE AUCTIONS
              </button>
            </div>
          </div>

          {/* Right Column: Luxury Minimalist Timepiece on Slate matching Screenshot 1 */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div 
              onClick={() => onLotClick(featuredAuction.id)}
              className="relative max-w-md w-full aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-2xl"
            >
              <img
                src={resolveImageUrl('/images/curio_item_rolex_1791467020069.jpg')}
                alt="Horology Timepiece on Slate"
                onError={handleImageError}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-neutral-200">
                <span className="font-serif-luxury text-sm font-semibold">1968 Rolex Submariner Ref. 5513</span>
                <span className="font-mono-num text-amber-400 font-bold">View Lot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
