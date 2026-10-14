import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORIES } from '../data/initialData';
import { AuctionCard } from './AuctionCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface ExploreMarketplaceProps {
  onSelectAuction: (id: number) => void;
  selectedCategory: number | null;
  setSelectedCategory: (catId: number | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const ExploreMarketplace: React.FC<ExploreMarketplaceProps> = ({
  onSelectAuction,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const { auctions, products, formatPrice } = useMarketplace();

  // Filters
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [onlyBuyNow, setOnlyBuyNow] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('ending_soon');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const filteredAuctions = useMemo(() => {
    return auctions
      .filter((auction) => {
        if (auction.status !== 'ACTIVE') return false;

        const product = products.find((p) => p.id === auction.productId);
        if (!product) return false;

        // Category filter
        if (selectedCategory && product.categoryId !== selectedCategory) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== 'ALL' && product.condition !== selectedCondition) {
          return false;
        }

        // Buy Now filter
        if (onlyBuyNow && !auction.buyNowPrice) {
          return false;
        }

        // Price range
        if (minPrice && auction.currentPrice < parseFloat(minPrice)) {
          return false;
        }
        if (maxPrice && auction.currentPrice > parseFloat(maxPrice)) {
          return false;
        }

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = product.title.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchBrand && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'ending_soon') {
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        }
        if (sortBy === 'price_high') {
          return b.currentPrice - a.currentPrice;
        }
        if (sortBy === 'price_low') {
          return a.currentPrice - b.currentPrice;
        }
        if (sortBy === 'most_bids') {
          return b.totalBids - a.totalBids;
        }
        if (sortBy === 'newest') {
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        }
        return 0;
      });
  }, [auctions, products, selectedCategory, selectedCondition, onlyBuyNow, minPrice, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedCondition('ALL');
    setOnlyBuyNow(false);
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSortBy('ending_soon');
  };

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedCondition !== 'ALL' ||
    onlyBuyNow ||
    minPrice !== '' ||
    maxPrice !== '' ||
    searchQuery !== '';

  return (
    <div className="bg-white min-h-[85vh] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title & Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 pb-6">
            <div>
              <span className="font-mono-num text-[11px] uppercase tracking-wider text-[#bfa054] font-bold block mb-1">
                CURATED GALLERY LOTS
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#0c1926]">
                Collector Marketplace
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-light">
                Discover authenticated horology, numismatics, rare folios, and cinema memorabilia.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lots, makers, references..."
                className="w-full bg-[#f8f9fa] border border-neutral-200 rounded-md pl-9 pr-8 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#bfa054] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer rounded-none border-b-2 ${
                selectedCategory === null
                  ? 'border-[#bfa054] text-[#0c1926] font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All Departments
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer rounded-none border-b-2 ${
                  selectedCategory === cat.id
                    ? 'border-[#bfa054] text-[#0c1926] font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Bar */}
        <div className="p-4 bg-[#f8f9fb] border border-neutral-200 rounded-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-semibold uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#bfa054]" />
              <span>Filter:</span>
            </div>

            {/* Condition Dropdown */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:border-[#bfa054] cursor-pointer"
            >
              <option value="ALL">All Conditions</option>
              <option value="MINT">Mint</option>
              <option value="NEAR_MINT">Near Mint</option>
              <option value="EXCELLENT">Excellent</option>
              <option value="VERY_GOOD">Very Good</option>
              <option value="GOOD">Good</option>
            </select>

            {/* Buy Now Toggle */}
            <button
              onClick={() => setOnlyBuyNow(!onlyBuyNow)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                onlyBuyNow
                  ? 'bg-[#bfa054] text-white border-[#bfa054]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:text-black'
              }`}
            >
              Instant Buy Now Available
            </button>

            {/* Price Bounds */}
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-18 bg-white border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-900 focus:outline-none focus:border-[#bfa054]"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-18 bg-white border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-900 focus:outline-none focus:border-[#bfa054]"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#bfa054] hover:text-[#9c7d35] font-semibold underline underline-offset-2 ml-1 cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Sort Dropdown & Count */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-500 font-mono-num">
              <strong>{filteredAuctions.length}</strong> active lots
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:border-[#bfa054] cursor-pointer"
            >
              <option value="ending_soon">Closing Soonest</option>
              <option value="most_bids">Most Bids</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="newest">Newly Listed</option>
            </select>
          </div>
        </div>

        {/* Auction Lots Grid */}
        {filteredAuctions.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4">
            <p className="font-serif-luxury text-lg text-neutral-700">No active lots match your filter criteria.</p>
            <p className="text-xs text-neutral-500">Try broadening your price bounds or removing search keywords.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#0c1926] text-white text-xs font-semibold uppercase tracking-wider rounded"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAuctions.map((auction) => {
              const product = products.find((p) => p.id === auction.productId);
              if (!product) return null;
              return (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  product={product}
                  onSelect={onSelectAuction}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
