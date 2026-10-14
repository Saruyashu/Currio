import React from 'react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface StartAuctionBannerProps {
  onStartAuction: () => void;
}

export const StartAuctionBanner: React.FC<StartAuctionBannerProps> = ({ onStartAuction }) => {
  return (
    <section className="bg-[#09121f] overflow-hidden border-b border-neutral-800">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Editorial Still Life of Gold Spoon and Blue Strap Skeleton Watch */}
        <div className="relative aspect-[4/3] lg:aspect-auto min-h-[360px] lg:min-h-[480px] bg-black">
          <img
            src={resolveImageUrl('/images/curio_gold_spoon_watch_1791470150205.jpg')}
            alt="Gold Spoon and Haute Horlogerie Watch on Slate"
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Side: Midnight Navy Canvas with White Script Calligraphy matching Screenshot 3 */}
        <div className="flex flex-col items-center justify-center p-10 sm:p-16 lg:p-20 text-center space-y-8 bg-[#09121f]">
          <div className="space-y-1">
            <h2 className="font-script text-5xl sm:text-7xl lg:text-8xl text-white font-normal leading-tight tracking-wide drop-shadow-sm">
              Start Your <br />
              Auction
            </h2>
          </div>

          <p className="text-neutral-300 text-xs sm:text-sm max-w-md font-light leading-relaxed">
            Consign your rare timepieces, historical coins, and vintage memorabilia to a global network of accredited collectors.
          </p>

          <div>
            <button
              onClick={onStartAuction}
              className="px-8 py-3.5 bg-[#bfa054] hover:bg-[#b09044] text-white font-semibold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-amber-900/30 cursor-pointer"
            >
              START AUCTION
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
