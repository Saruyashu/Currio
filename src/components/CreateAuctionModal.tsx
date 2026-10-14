import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORIES } from '../data/initialData';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (auctionId: number) => void;
}

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Rolex Submariner', url: '/images/curio_item_rolex_1791467020069.jpg' },
  { label: 'Antique Telescope', url: '/images/curio_brass_telescope_1791470097374.jpg' },
  { label: 'Vintage Script', url: '/images/curio_vintage_script_1791470109374.jpg' },
  { label: 'Signed Art Poster', url: '/images/curio_signed_poster_1791470122498.jpg' },
  { label: 'Silver Proof Dollar', url: '/images/curio_silver_dollar_1791470137433.jpg' },
  { label: 'Tourbillon & Spoon', url: '/images/curio_gold_spoon_watch_1791470150205.jpg' },
];

export const CreateAuctionModal: React.FC<CreateAuctionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createAuction, currentUser, formatPrice } = useMarketplace();

  // Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('1975');
  const [condition, setCondition] = useState<'MINT' | 'NEAR_MINT' | 'EXCELLENT' | 'VERY_GOOD' | 'GOOD'>('EXCELLENT');
  const [location, setLocation] = useState('London, UK');
  const [tags, setTags] = useState('vintage,rare,collectible');

  // Images
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Auction Settings
  const [startingPrice, setStartingPrice] = useState('640');
  const [reservePrice, setReservePrice] = useState('800');
  const [bidIncrement, setBidIncrement] = useState('25');
  const [durationDays, setDurationDays] = useState('7');
  const [enableBuyNow, setEnableBuyNow] = useState(true);
  const [buyNowPrice, setBuyNowPrice] = useState('950');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Lot title is required.');
      return;
    }

    const startVal = parseFloat(startingPrice);
    if (isNaN(startVal) || startVal <= 0) {
      setError('Please provide a valid starting price.');
      return;
    }

    const imgToUse = customImageUrl.trim() ? customImageUrl.trim() : selectedImage;

    const res = createAuction(
      {
        title,
        description,
        categoryId: Number(categoryId),
        brand: brand || 'Fine Maker',
        model: model || 'Exhibition',
        year: parseInt(year) || 1980,
        condition,
        location,
        tags: tags.split(',').map((t) => t.trim()),
        imageUrl: imgToUse,
        galleryUrls: [imgToUse],
      },
      {
        startingPrice: startVal,
        reservePrice: reservePrice ? parseFloat(reservePrice) : 0,
        bidIncrement: bidIncrement ? parseFloat(bidIncrement) : 25,
        buyNowPrice: enableBuyNow && buyNowPrice ? parseFloat(buyNowPrice) : undefined,
        durationDays: parseInt(durationDays) || 7,
      }
    );

    if (res.success && res.auctionId) {
      onSuccess(res.auctionId);
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="px-6 py-4 bg-[#f8f9fa] border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#bfa054]" />
            <h3 className="font-serif-luxury text-lg font-bold text-[#0c1926]">
              Consign & Start Auction Listing
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto bg-white">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-[#bfa054] font-bold border-b border-neutral-100 pb-1.5">
              1. Catalog Particulars
            </h4>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Lot Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 19th Century Marine Brass Telescope on Mahogany Tripod"
                className="w-full bg-[#f8f9fa] border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Department</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Condition Rating</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
                >
                  <option value="MINT">Mint (Museum Flawless)</option>
                  <option value="NEAR_MINT">Near Mint</option>
                  <option value="EXCELLENT">Excellent (Crisp Original Patina)</option>
                  <option value="VERY_GOOD">Very Good</option>
                  <option value="GOOD">Good (Authentic Wear)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Brand / Maker</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Dolland London"
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Model / Reference</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. 3-Inch Marine"
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Origin Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Provenance & Catalog Notes</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail authentication marks, physical provenance, previous ownership, and service history."
                className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926] leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Photography Assets */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-[#bfa054] font-bold border-b border-neutral-100 pb-1.5">
              2. Photography & Lot Assets
            </h4>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-2">Select High-Resolution Lot Image</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedImage(preset.url);
                      setCustomImageUrl('');
                    }}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 cursor-pointer transition-all bg-neutral-50 p-1 flex items-center justify-center ${
                      selectedImage === preset.url && !customImageUrl
                        ? 'border-[#bfa054] shadow-md ring-1 ring-[#bfa054]/40'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={resolveImageUrl(preset.url)}
                      alt={preset.label}
                      onError={handleImageError}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-1 left-1 right-1 bg-white/90 text-[10px] text-center text-neutral-900 font-medium py-0.5 rounded shadow-xs truncate">
                      {preset.label}
                    </span>
                  </div>
                ))}
              </div>

              <input
                type="text"
                placeholder="Or specify custom image URL (/path or https://...)"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
              />
            </div>
          </div>

          {/* Section 3: Auction Parameters */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-[#bfa054] font-bold border-b border-neutral-100 pb-1.5">
              3. Auction Parameters & Reserve Price
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Starting Price *</label>
                <input
                  type="number"
                  required
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 font-mono-num focus:outline-none focus:border-[#0c1926]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Reserve Price</label>
                <input
                  type="number"
                  value={reservePrice}
                  onChange={(e) => setReservePrice(e.target.value)}
                  placeholder="0 (No Reserve)"
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 font-mono-num focus:outline-none focus:border-[#0c1926]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Bid Increment</label>
                <input
                  type="number"
                  value={bidIncrement}
                  onChange={(e) => setBidIncrement(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 font-mono-num focus:outline-none focus:border-[#0c1926]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Exhibition Duration</label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
                >
                  <option value="3">3 Days (Flash Session)</option>
                  <option value="7">7 Days (Standard Curatorial Exhibition)</option>
                  <option value="14">14 Days (Marquee Global Showcase)</option>
                </select>
              </div>

              <div className="pt-5 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableBuyNow"
                  checked={enableBuyNow}
                  onChange={(e) => setEnableBuyNow(e.target.checked)}
                  className="rounded text-[#0c1926] focus:ring-[#0c1926] h-4 w-4"
                />
                <label htmlFor="enableBuyNow" className="text-xs font-semibold text-neutral-800 cursor-pointer">
                  Enable Instant "Buy Now"
                </label>
              </div>
            </div>

            {enableBuyNow && (
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Instant Buy Now Price</label>
                <input
                  type="number"
                  value={buyNowPrice}
                  onChange={(e) => setBuyNowPrice(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 font-mono-num focus:outline-none focus:border-[#0c1926]"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#bfa054] hover:bg-[#a98c42] text-white font-bold text-xs tracking-widest uppercase rounded shadow-xs cursor-pointer"
            >
              Publish Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
