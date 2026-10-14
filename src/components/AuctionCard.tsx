import React, { useState, useEffect } from 'react';
import { Auction, Product } from '../data/initialData';
import { useMarketplace } from '../context/MarketplaceContext';
import { Heart, Clock, CheckCircle2 } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface AuctionCardProps {
  auction: Auction;
  product: Product;
  onSelect: (auctionId: number) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  product,
  onSelect,
}) => {
  const { toggleWatchlist, isWatchlisted, formatPrice } = useMarketplace();
  const watchlisted = isWatchlisted(auction.id);

  // Real-time countdown state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; ended: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(auction.endTime).getTime() - Date.now();
      if (diff <= 0 || auction.status !== 'ACTIVE') {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, ended: true });
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      setTimeLeft({ hours, minutes, seconds, ended: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime, auction.status]);

  const reserveMet = !auction.reservePrice || auction.currentPrice >= auction.reservePrice;

  return (
    <div
      onClick={() => onSelect(auction.id)}
      className="group bg-white border border-neutral-200 hover:border-[#bfa054] rounded-lg overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* 1. Imagery: Clean white museum framing */}
      <div className="relative aspect-[4/3] bg-neutral-50 overflow-hidden flex items-center justify-center p-2">
        <img
          src={resolveImageUrl(product.imageUrl)}
          alt={product.title}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain filter contrast-105 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Watchlist Quick Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(auction.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            watchlisted
              ? 'bg-rose-50 text-rose-500 border border-rose-200'
              : 'bg-white/80 text-neutral-400 hover:text-neutral-800 border border-neutral-200'
          }`}
          aria-label="Add to watchlist"
        >
          <Heart className={`w-3.5 h-3.5 ${watchlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Status / Countdown overlay */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono-num text-neutral-800 border border-neutral-200 shadow-xs flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#bfa054]" />
          {timeLeft.ended ? (
            <span className="text-neutral-500 font-medium">Concluded</span>
          ) : (
            <span>
              {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          )}
        </div>

        {auction.buyNowPrice && (
          <div className="absolute top-2.5 left-2.5 bg-[#bfa054] text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shadow-xs">
            Buy Now
          </div>
        )}
      </div>

      {/* 2. Unboxed Clean Typography & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.year > 0 ? product.year : 'Antique'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-600 font-medium">{product.condition}</span>
          </div>

          <h4 className="font-serif-luxury text-sm font-semibold text-[#0c1926] group-hover:text-[#bfa054] transition-colors mt-1 line-clamp-1 leading-snug">
            {product.title}
          </h4>
        </div>

        <div className="pt-2 border-t border-neutral-100 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">Current Bid</span>
              <span className="font-mono-num text-lg font-bold text-[#0c1926]">
                {formatPrice(auction.currentPrice)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">Total Bids</span>
              <span className="font-mono-num text-xs text-neutral-600 font-semibold">
                {auction.totalBids} {auction.totalBids === 1 ? 'bid' : 'bids'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className={`w-3 h-3 ${reserveMet ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <span className={reserveMet ? 'text-emerald-700' : 'text-neutral-500'}>
                {reserveMet ? 'Reserve Met' : 'Reserve Pending'}
              </span>
            </span>

            {auction.buyNowPrice && (
              <span className="text-neutral-600">
                Buy Now: <strong className="font-mono-num text-[#bfa054] font-bold">{formatPrice(auction.buyNowPrice)}</strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
