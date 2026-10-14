import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ChevronRight } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface GalleryProductsSectionProps {
  onSelectAuction: (id: number) => void;
  onExploreMore: () => void;
}

export const GalleryProductsSection: React.FC<GalleryProductsSectionProps> = ({
  onSelectAuction,
  onExploreMore,
}) => {
  const { auctions, products, formatPrice } = useMarketplace();

  // Find the exact screenshot items (IDs 7, 8, 9, 10 or fallback to first 4)
  const targetIds = [7, 8, 9, 10];
  const galleryLots = targetIds
    .map((id) => {
      const auc = auctions.find((a) => a.id === id);
      const prod = products.find((p) => p.id === auc?.productId);
      return auc && prod ? { auction: auc, product: prod } : null;
    })
    .filter(Boolean) as { auction: any; product: any }[];

  // Fallback to top active auctions if any missing
  const displayLots = galleryLots.length >= 4 
    ? galleryLots 
    : auctions.slice(0, 4).map((a) => ({ auction: a, product: products.find((p) => p.id === a.productId)! })).filter((x) => x.product);

  return (
    <section className="bg-white py-16 sm:py-20 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Gallery Horizontal Grid matching Screenshot 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-start">
            {displayLots.map(({ auction, product }) => (
              <div
                key={auction.id}
                onClick={() => onSelectAuction(auction.id)}
                className="group flex flex-col cursor-pointer transition-all"
              >
                {/* Clean Pure White Museum Frame */}
                <div className="aspect-[4/5] bg-white rounded-none overflow-hidden flex items-center justify-center p-3 relative transition-transform duration-300 group-hover:-translate-y-1">
                  <img
                    src={resolveImageUrl(product.imageUrl)}
                    alt={product.title}
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter contrast-105"
                  />
                  {/* Subtle live indicator on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/80 text-white text-[10px] px-2 py-0.5 rounded font-mono-num">
                    {auction.totalBids} bids
                  </div>
                </div>

                {/* Typography below image matching Screenshot 2 */}
                <div className="text-center pt-4 space-y-1">
                  <h4 className="font-serif-luxury text-sm sm:text-base font-normal text-[#1a1f28] group-hover:text-amber-800 transition-colors line-clamp-1">
                    {product.title}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm font-light text-[#222834]">
                    {formatPrice(auction.currentPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Carousel Arrow matching Screenshot 2 */}
          <button
            onClick={onExploreMore}
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 hover:bg-neutral-100 border border-neutral-200 rounded-full items-center justify-center text-neutral-700 shadow-md transition-all cursor-pointer z-10"
            title="Explore more collectibles"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* CURIO Wordmark & Minimalist Bag matching Screenshot 2 bottom */}
        <div className="pt-16 mt-12 border-t border-neutral-100 flex items-center justify-between">
          <span className="font-serif-luxury text-3xl font-bold tracking-widest text-[#0e1b2b]">
            CURIO
          </span>
          <div className="flex items-center gap-6 text-xs text-neutral-500 font-medium">
            <span className="hidden sm:inline">AUTHENTICATED NUMISMATICS · FINE ART · HOROLOGY</span>
          </div>
        </div>
      </div>
    </section>
  );
};
