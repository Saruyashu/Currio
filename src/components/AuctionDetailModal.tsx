import React, { useState, useEffect, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  Clock, 
  ShieldCheck, 
  Gavel, 
  Heart, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  History,
  TrendingUp,
  FastForward,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  Eye,
  ArrowLeft,
  ArrowRight,
  Layers
} from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface AuctionDetailModalProps {
  auctionId: number | null;
  onClose: () => void;
  onSelectOtherAuction: (id: number) => void;
  onOpenAuth: () => void;
}

export const AuctionDetailModal: React.FC<AuctionDetailModalProps> = ({
  auctionId,
  onClose,
  onSelectOtherAuction,
  onOpenAuth,
}) => {
  const {
    currentUser,
    auctions,
    products,
    bids,
    users,
    placeBid,
    buyNow,
    toggleWatchlist,
    isWatchlisted,
    simulateCompetitorBid,
    fastForwardEndAuction,
    formatPrice,
  } = useMarketplace();

  const auction = auctions.find((a) => a.id === auctionId);
  const product = products.find((p) => p.id === auction?.productId);
  const seller = users.find((u) => u.id === auction?.sellerId);
  const auctionBids = bids.filter((b) => b.auctionId === auctionId);

  // Responsive & Viewport sizing state
  const [isExpandedSize, setIsExpandedSize] = useState<boolean>(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState<boolean>(false);
  const [showCatalogDrawer, setShowCatalogDrawer] = useState<boolean>(true);

  const [activeImage, setActiveImage] = useState<string>('');
  const [bidInput, setBidInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [showBuyNowModal, setShowBuyNowModal] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<string>('742 Evergreen Terrace, Springfield, IL 62704');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Time remaining calculation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; ended: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
  });

  // Lot-to-lot navigation calculations
  const allAuctions = useMemo(() => auctions, [auctions]);
  const currentIndex = allAuctions.findIndex((a) => a.id === auctionId);
  const prevAuction = currentIndex > 0 ? allAuctions[currentIndex - 1] : allAuctions[allAuctions.length - 1];
  const nextAuction = currentIndex >= 0 && currentIndex < allAuctions.length - 1 ? allAuctions[currentIndex + 1] : allAuctions[0];

  const prevProduct = prevAuction ? products.find((p) => p.id === prevAuction.productId) : null;
  const nextProduct = nextAuction ? products.find((p) => p.id === nextAuction.productId) : null;

  // Compute all available images for this lot
  const allImages = useMemo(() => {
    if (!product) return [];
    const list = [product.imageUrl];
    if (product.galleryUrls && Array.isArray(product.galleryUrls)) {
      product.galleryUrls.forEach((url) => {
        if (url && !list.includes(url)) list.push(url);
      });
    }
    return list;
  }, [product]);

  const currentImageIndex = allImages.indexOf(activeImage) >= 0 ? allImages.indexOf(activeImage) : 0;

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    const nextIdx = currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1;
    setActiveImage(allImages[nextIdx]);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    const nextIdx = currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0;
    setActiveImage(allImages[nextIdx]);
  };

  // Reset active image and input when changing lots
  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
      setFeedback(null);
      setBidInput('');
    }
  }, [product?.id]);

  // Global Keyboard Navigation: Left/Right arrows navigate lots, Escape exits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        if (isFullscreenImage) {
          setIsFullscreenImage(false);
        } else if (showBuyNowModal) {
          setShowBuyNowModal(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (isFullscreenImage && allImages.length > 1) {
          handlePrevImage();
        } else if (prevAuction) {
          onSelectOtherAuction(prevAuction.id);
        }
      } else if (e.key === 'ArrowRight') {
        if (isFullscreenImage && allImages.length > 1) {
          handleNextImage();
        } else if (nextAuction) {
          onSelectOtherAuction(nextAuction.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevAuction?.id, nextAuction?.id, onClose, isFullscreenImage, allImages, currentImageIndex, showBuyNowModal]);

  // Countdown timer
  useEffect(() => {
    if (!auction) return;
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
  }, [auction?.endTime, auction?.status]);

  if (!auction || !product) return null;

  const minNextBid =
    auction.totalBids === 0
      ? auction.startingPrice
      : auction.currentPrice + auction.bidIncrement;

  const reserveMet = !auction.reservePrice || auction.currentPrice >= auction.reservePrice;
  const isOwner = currentUser?.id === auction.sellerId;
  const watchlisted = isWatchlisted(auction.id);

  // Handle Bidding
  const handlePlaceBid = (amountToBid?: number) => {
    const val = amountToBid !== undefined ? amountToBid : parseFloat(bidInput);
    if (!val || isNaN(val)) {
      setFeedback({ success: false, message: 'Please enter a valid numerical bid amount.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = placeBid(auction.id, val);
      setFeedback(res);
      if (res.success) {
        setBidInput('');
      }
      setIsSubmitting(false);
    }, 150);
  };

  // Handle Buy Now
  const handleConfirmBuyNow = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = buyNow(auction.id, shippingAddress);
      setFeedback({ success: res.success, message: res.message });
      setShowBuyNowModal(false);
      setIsSubmitting(false);
    }, 300);
  };

  // Similar lots
  const similarAuctions = auctions
    .filter((a) => a.id !== auction.id && a.status === 'ACTIVE')
    .slice(0, 3);

  return (
    <div 
      onClick={(e) => {
        // Exit when clicking the outer backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 transition-all"
    >
      {/* Floating Desktop Flank Left Arrow to navigate previous lot */}
      {prevAuction && (
        <button
          onClick={() => onSelectOtherAuction(prevAuction.id)}
          aria-label={`Previous lot: ${prevProduct?.title || ''}`}
          title={`Previous lot: Lot #${prevAuction.id} (${prevProduct?.title}) [← Key]`}
          className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 z-60 w-12 h-12 rounded-full bg-white/90 hover:bg-[#0c1926] text-neutral-800 hover:text-white border border-neutral-300 hover:border-[#bfa054] shadow-2xl items-center justify-center transition-all cursor-pointer group"
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
          <span className="sr-only">Previous Lot</span>
        </button>
      )}

      {/* Floating Desktop Flank Right Arrow to navigate next lot */}
      {nextAuction && (
        <button
          onClick={() => onSelectOtherAuction(nextAuction.id)}
          aria-label={`Next lot: ${nextProduct?.title || ''}`}
          title={`Next lot: Lot #${nextAuction.id} (${nextProduct?.title}) [→ Key]`}
          className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-60 w-12 h-12 rounded-full bg-white/90 hover:bg-[#0c1926] text-neutral-800 hover:text-white border border-neutral-300 hover:border-[#bfa054] shadow-2xl items-center justify-center transition-all cursor-pointer group"
        >
          <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
          <span className="sr-only">Next Lot</span>
        </button>
      )}

      {/* Main Modal Card Container - Resizes according to screen and size mode */}
      <div 
        className={`relative w-full ${
          isExpandedSize ? 'max-w-7xl' : 'max-w-5xl xl:max-w-6xl'
        } max-h-[94vh] sm:max-h-[90vh] flex flex-col bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden my-auto transition-all duration-300 animate-in fade-in zoom-in-95`}
      >
        {/* Sticky Top Header: Navigation Controls, Lot Indicator, and Cross Exit Button */}
        <div className="sticky top-0 z-30 px-4 sm:px-6 py-3.5 bg-white/95 backdrop-blur-md border-b border-neutral-200 flex items-center justify-between gap-3 shadow-xs">
          {/* Left: Lot Badge & Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="font-mono-num text-xs font-bold px-2.5 py-1 bg-[#0c1926] text-amber-400 rounded-md tracking-wider shadow-xs">
              LOT #{String(auction.id).padStart(3, '0')}
            </span>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs text-neutral-900 font-semibold truncate max-w-[180px] md:max-w-[260px]">
                {product.title}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">
                {product.brand} · {product.location}
              </span>
            </div>
          </div>

          {/* Center: Lot-to-Lot Navigation (< Prev | Lot X of Y | Next >) */}
          <div className="flex items-center gap-1 sm:gap-2 bg-[#f4f5f7] px-2 py-1 rounded-xl border border-neutral-200/80">
            {prevAuction && (
              <button
                onClick={() => onSelectOtherAuction(prevAuction.id)}
                aria-label="Navigate to previous lot"
                title={`Previous Lot: #${prevAuction.id} (${prevProduct?.title}) [Arrow Left]`}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-neutral-700 hover:text-black hover:bg-white text-xs font-medium transition-all cursor-pointer border border-transparent hover:border-neutral-200 shadow-none hover:shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline text-[11px]">Prev Lot</span>
              </button>
            )}

            <div className="px-1.5 sm:px-2 py-0.5 text-[11px] font-mono-num text-neutral-600 font-semibold whitespace-nowrap">
              <span className="text-neutral-900 font-bold">{currentIndex >= 0 ? currentIndex + 1 : 1}</span>
              <span className="text-neutral-400 mx-1">/</span>
              <span>{allAuctions.length}</span>
            </div>

            {nextAuction && (
              <button
                onClick={() => onSelectOtherAuction(nextAuction.id)}
                aria-label="Navigate to next lot"
                title={`Next Lot: #${nextAuction.id} (${nextProduct?.title}) [Arrow Right]`}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-neutral-700 hover:text-black hover:bg-white text-xs font-medium transition-all cursor-pointer border border-transparent hover:border-neutral-200 shadow-none hover:shadow-xs"
              >
                <span className="hidden md:inline text-[11px]">Next Lot</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right: Actions (Watchlist, Resize Toggle, and Prominent Exit Cross Button) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Watchlist toggle */}
            <button
              onClick={() => toggleWatchlist(auction.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                watchlisted
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-neutral-400 border-neutral-200 hover:text-black hover:border-neutral-300'
              }`}
              title={watchlisted ? 'Saved in Watchlist' : 'Add to Watchlist'}
            >
              <Heart className={`w-4 h-4 ${watchlisted ? 'fill-rose-600' : ''}`} />
            </button>

            {/* Resize / Expand Viewport Toggle */}
            <button
              onClick={() => setIsExpandedSize(!isExpandedSize)}
              className="hidden lg:flex p-2 text-neutral-500 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
              title={isExpandedSize ? 'Resize to standard size' : 'Expand to wide theater view'}
              aria-label="Toggle modal size"
            >
              {isExpandedSize ? (
                <Minimize2 className="w-4 h-4 text-neutral-600" />
              ) : (
                <Maximize2 className="w-4 h-4 text-neutral-600" />
              )}
            </button>

            {/* PROMINENT CROSS BUTTON TO EXIT */}
            <button
              onClick={onClose}
              aria-label="Exit lot details"
              title="Exit lot details (Press Escape)"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-neutral-900 hover:bg-[#0c1926] text-white border border-neutral-900 hover:border-amber-400/50 transition-all font-semibold text-xs cursor-pointer group shadow-md"
            >
              <X className="w-4 h-4 transition-transform group-hover:rotate-90 group-hover:scale-110" />
              <span className="text-xs font-medium tracking-wide">Exit</span>
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body: Left column (Gallery & Curatorial data) and Right column (Bidding console) */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column: Gallery, Image Navigation & Item Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Primary Image Viewport with Image Navigation & Fullscreen Zoom Option */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] max-h-[48vh] bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200 flex items-center justify-center p-3 sm:p-5 group">
                <img
                  src={resolveImageUrl(activeImage || product.imageUrl)}
                  alt={product.title}
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter contrast-105 transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer"
                  onClick={() => setIsFullscreenImage(true)}
                  title="Click to view full-resolution image"
                />

                {/* Left/Right Photo Navigation Arrows on the image */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      aria-label="Previous photo angle"
                      title="Previous photo"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 border border-neutral-200 shadow-md flex items-center justify-center transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      aria-label="Next photo angle"
                      title="Next photo"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 border border-neutral-200 shadow-md flex items-center justify-center transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Condition Badge */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono-num text-neutral-700 border border-neutral-200 shadow-xs">
                  Condition: <span className="text-emerald-700 font-bold">{product.condition}</span>
                </div>

                {/* Top Right: Inspect Fullscreen Zoom Button */}
                <button
                  onClick={() => setIsFullscreenImage(true)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-neutral-700 hover:text-black p-1.5 rounded-md border border-neutral-200 shadow-xs flex items-center gap-1 text-[11px] font-medium transition-all cursor-pointer"
                  title="Zoom and inspect high-resolution photo"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-[#bfa054]" />
                  <span className="hidden sm:inline">Inspect</span>
                </button>

                {/* Photo Counter */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-mono-num">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Carousel for angles of current item */}
              {allImages.length > 1 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                    <span>Item Gallery Angles ({allImages.length})</span>
                    <span className="font-mono-num text-[10px] text-neutral-400">Click angle to view</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
                    {allImages.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(url)}
                        className={`relative w-16 sm:w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-neutral-50 ${
                          activeImage === url ? 'border-[#bfa054] scale-105 shadow-sm' : 'border-neutral-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={resolveImageUrl(url)}
                          alt={`Angle ${idx + 1}`}
                          onError={handleImageError}
                          className="w-full h-full object-contain"
                        />
                        {activeImage === url && (
                          <div className="absolute inset-0 border border-amber-400/40 rounded-lg pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title & Detailed Provenance */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#bfa054] font-bold">
                    CURIO ARCHIVE LOT
                  </span>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#0c1926] leading-snug">
                    {product.title}
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-neutral-200 text-xs">
                  <div>
                    <span className="text-neutral-400 uppercase tracking-wider block text-[10px]">Maker / Brand</span>
                    <span className="font-semibold text-neutral-900">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 uppercase tracking-wider block text-[10px]">Reference</span>
                    <span className="font-semibold text-neutral-900">{product.model}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 uppercase tracking-wider block text-[10px]">Origin Year</span>
                    <span className="font-semibold text-neutral-900">{product.year > 0 ? product.year : 'Antique'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 uppercase tracking-wider block text-[10px]">Vault Location</span>
                    <span className="font-semibold text-neutral-900">{product.location}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                    Curatorial Provenance & Catalog Notes
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>

                {/* Seller Provenance Card */}
                <div className="p-4 bg-[#f8f9fa] border border-neutral-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0c1926] text-white flex items-center justify-center font-serif-luxury font-bold text-sm">
                      {seller ? seller.firstName[0] : 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900">{seller?.username}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded flex items-center gap-1 font-semibold">
                          <ShieldCheck className="w-2.5 h-2.5" /> Verified Consignor
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        Seller Rating: <strong className="text-amber-700">{seller?.rating || '5.0'} ★</strong> (100% positive curatorial reviews)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Auction Engine & Bidding Console */}
            <div className="lg:col-span-5 space-y-6">
              {/* Live Status & Countdown Module */}
              <div className="p-5 sm:p-6 bg-[#f8f9fa] border border-neutral-200 rounded-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                    </span>
                    <span className="text-xs uppercase tracking-wider text-neutral-900 font-bold">
                      {auction.status} AUCTION
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">Time Remaining</span>
                    <div className="font-mono-num text-sm font-bold text-[#bfa054] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {timeLeft.ended ? (
                        <span className="text-rose-600">Auction Ended</span>
                      ) : (
                        <span>
                          {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Figures */}
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    Current Highest Bid
                  </span>
                  <div className="font-mono-num text-3xl sm:text-4xl font-extrabold text-[#0c1926] tracking-tight">
                    {formatPrice(auction.currentPrice)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                    <span>Starting: {formatPrice(auction.startingPrice)}</span>
                    <span>Increment: +{formatPrice(auction.bidIncrement)}</span>
                    <span className={reserveMet ? 'text-emerald-700 font-semibold' : 'text-neutral-400'}>
                      {reserveMet ? '✓ Reserve Met' : 'Reserve Pending'}
                    </span>
                  </div>
                </div>

                {/* Bidding Feedback Alert */}
                {feedback && (
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                      feedback.success
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}
                  >
                    {feedback.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    )}
                    <span>{feedback.message}</span>
                  </div>
                )}

                {/* Active Bid Controls */}
                {auction.status === 'ACTIVE' && !timeLeft.ended ? (
                  <div className="space-y-4 pt-2">
                    {currentUser ? (
                      isOwner ? (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 text-center font-medium">
                          You listed this lot. Self-bidding is strictly prohibited by CURIO governance rules.
                        </div>
                      ) : (
                        <>
                          {/* Quick increment buttons */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">Quick Bid Presets:</span>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => handlePlaceBid(minNextBid)}
                                disabled={isSubmitting}
                                className="py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-xs font-mono-num font-bold text-neutral-800 transition-colors cursor-pointer"
                              >
                                {formatPrice(minNextBid)}
                              </button>
                              <button
                                onClick={() => handlePlaceBid(minNextBid + auction.bidIncrement)}
                                disabled={isSubmitting}
                                className="py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-xs font-mono-num font-bold text-neutral-800 transition-colors cursor-pointer"
                              >
                                {formatPrice(minNextBid + auction.bidIncrement)}
                              </button>
                              <button
                                onClick={() => handlePlaceBid(minNextBid + auction.bidIncrement * 2)}
                                disabled={isSubmitting}
                                className="py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-xs font-mono-num font-bold text-neutral-800 transition-colors cursor-pointer"
                              >
                                {formatPrice(minNextBid + auction.bidIncrement * 2)}
                              </button>
                            </div>
                          </div>

                          {/* Custom Bid Input & Place Bid */}
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="number"
                                min={minNextBid}
                                step={auction.bidIncrement}
                                value={bidInput}
                                onChange={(e) => setBidInput(e.target.value)}
                                placeholder={`Min ${formatPrice(minNextBid)}`}
                                className="w-full bg-white border border-neutral-300 rounded px-3 py-2.5 text-xs text-neutral-900 font-mono-num focus:outline-none focus:border-[#0c1926]"
                              />
                            </div>

                            <button
                              onClick={() => handlePlaceBid()}
                              disabled={isSubmitting}
                              className="px-6 py-2.5 bg-[#0c1926] hover:bg-[#1a2c3f] text-white font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs hover:border-[#bfa054]"
                            >
                              <Gavel className="w-3.5 h-3.5" />
                              <span>{isSubmitting ? 'Placing...' : 'Place Bid'}</span>
                            </button>
                          </div>
                        </>
                      )
                    ) : (
                      <button
                        onClick={onOpenAuth}
                        className="w-full py-3 bg-[#0c1926] hover:bg-[#1a2c3f] text-white font-semibold text-xs tracking-wider uppercase rounded transition-colors cursor-pointer shadow-sm"
                      >
                        Sign In to Place Bids & Verify Credentials
                      </button>
                    )}

                    {/* Buy Now Option */}
                    {auction.buyNowPrice && (
                      <div className="pt-3 border-t border-neutral-200">
                        <button
                          onClick={() => {
                            if (currentUser) {
                              setShowBuyNowModal(true);
                            } else {
                              onOpenAuth();
                            }
                          }}
                          className="w-full py-3 bg-[#bfa054] hover:bg-[#a98c42] text-white font-bold text-xs tracking-widest uppercase rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          <Zap className="w-3.5 h-3.5 text-white" />
                          <span>Instant Buy Now for {formatPrice(auction.buyNowPrice)}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-white border border-neutral-200 rounded-xl text-center space-y-1">
                    <p className="text-xs uppercase tracking-wider text-[#bfa054] font-bold">
                      This Auction Has Concluded
                    </p>
                    <p className="text-xs text-neutral-600">
                      Status: <strong>{auction.status}</strong> · Winning Bid:{' '}
                      <strong className="text-neutral-900">{formatPrice(auction.currentPrice)}</strong>
                    </p>
                  </div>
                )}

                {/* Simulation Sandbox */}
                <div className="pt-4 border-t border-neutral-200 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                    Integrity & Sandbox Testing:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const res = simulateCompetitorBid(auction.id);
                        setFeedback(res);
                      }}
                      title="Simulate another bidder submitting a valid counter-bid"
                      className="p-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-[11px] text-neutral-700 flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                    >
                      <TrendingUp className="w-3 h-3 text-[#bfa054]" />
                      <span>Simulate Competitor Bid</span>
                    </button>

                    <button
                      onClick={() => {
                        const res = fastForwardEndAuction(auction.id);
                        setFeedback(res);
                      }}
                      title="Test scheduled auction completion daemon & order creation"
                      className="p-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-[11px] text-neutral-700 flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                    >
                      <FastForward className="w-3 h-3 text-cyan-700" />
                      <span>Conclude Auction</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Permanent Bid Audit Log Table */}
              <div className="p-5 bg-[#f8f9fa] border border-neutral-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#bfa054]" />
                    <span className="text-xs font-bold text-neutral-900 tracking-wide">
                      Immutable Bid Ledger
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-num text-neutral-500">
                    {auctionBids.length} entries
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-neutral-200 rounded-lg divide-y divide-neutral-100 bg-white">
                  {auctionBids.length === 0 ? (
                    <div className="p-4 text-xs text-neutral-400 text-center">
                      No bids recorded yet. Be the opening bidder!
                    </div>
                  ) : (
                    auctionBids.map((bid) => {
                      const masked =
                        bid.bidderUsername.length > 2
                          ? bid.bidderUsername[0] + '***' + bid.bidderUsername.slice(-1)
                          : 'c***r';

                      const isCurrentWinner = bid.bidderId === auction.currentWinnerId && bid.amount === auction.currentPrice;

                      return (
                        <div
                          key={bid.id}
                          className={`px-3 py-2 text-xs flex items-center justify-between font-mono-num ${
                            isCurrentWinner ? 'bg-amber-50/60 font-semibold text-[#0c1926]' : 'text-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-3 h-3 text-neutral-400" />
                            <span>{masked}</span>
                            {isCurrentWinner && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-[#0c1926] text-white rounded font-sans font-bold">
                                LEADING
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-400 text-[10px]">{bid.timestamp}</span>
                            <span className="font-bold">{formatPrice(bid.amount)}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Catalog Reel / Quick Lot Navigator Bar - Click any lot to jump directly to it */}
          <div className="p-4 sm:p-6 bg-[#f8f9fa] border-t border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#bfa054]" />
                <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-[#0c1926]">
                  Saleroom Catalog ({allAuctions.length} Lots)
                </h3>
                <span className="text-[10px] text-neutral-400 font-light hidden sm:inline">
                  Click any lot to navigate directly
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono-num">
                <span>Use <strong>←</strong> / <strong>→</strong> keys to navigate</span>
              </div>
            </div>

            {/* Horizontal scrollable strip of all lots */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {allAuctions.map((auc, index) => {
                const aucProd = products.find((p) => p.id === auc.productId);
                if (!aucProd) return null;
                const isSelected = auc.id === auction.id;

                return (
                  <button
                    key={auc.id}
                    onClick={() => onSelectOtherAuction(auc.id)}
                    aria-label={`Jump to Lot #${auc.id}: ${aucProd.title}`}
                    className={`shrink-0 w-36 sm:w-44 text-left p-2 rounded-xl border transition-all cursor-pointer bg-white group ${
                      isSelected
                        ? 'border-[#bfa054] ring-2 ring-[#bfa054]/30 shadow-md scale-[1.02]'
                        : 'border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100 hover:shadow-xs'
                    }`}
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-50 mb-1.5 flex items-center justify-center p-1">
                      <img
                        src={resolveImageUrl(aucProd.imageUrl)}
                        alt={aucProd.title}
                        onError={handleImageError}
                        className="w-full h-full object-contain filter contrast-105"
                      />
                      <span className="absolute top-1 left-1 bg-black/80 text-white font-mono-num text-[9px] px-1.5 py-0.2 rounded">
                        #{String(auc.id).padStart(3, '0')}
                      </span>
                      {isSelected && (
                        <span className="absolute bottom-1 right-1 bg-[#bfa054] text-white font-mono-num text-[8px] font-bold px-1 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="font-serif-luxury text-xs text-neutral-900 truncate font-medium group-hover:text-amber-800">
                      {aucProd.title}
                    </p>
                    <p className="font-mono-num text-xs font-bold text-[#0c1926] mt-0.5">
                      {formatPrice(auc.currentPrice)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Footer Action Bar on mobile: Exit Button and Prev/Next Lot buttons */}
          <div className="px-4 py-3 bg-white border-t border-neutral-200 flex items-center justify-between text-xs sm:hidden">
            <button
              onClick={() => prevAuction && onSelectOtherAuction(prevAuction.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 rounded-lg text-neutral-700 font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-1.5 bg-neutral-900 text-white rounded-full font-bold"
            >
              <X className="w-3.5 h-3.5" /> Exit Lot
            </button>
            <button
              onClick={() => nextAuction && onSelectOtherAuction(nextAuction.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 rounded-lg text-neutral-700 font-medium"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* High-Resolution Fullscreen Image Inspector Lightbox with its own Exit Cross Button and Photo Navigation */}
      {isFullscreenImage && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreenImage(false);
          }}
          className="fixed inset-0 z-70 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in"
        >
          {/* Top Bar with Title and Exit Cross Button */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white pb-4 border-b border-neutral-800">
            <div className="space-y-0.5">
              <span className="font-mono-num text-[11px] text-[#bfa054] font-bold">
                LOT #{String(auction.id).padStart(3, '0')} · HIGH-RESOLUTION INSPECTOR
              </span>
              <h3 className="font-serif-luxury text-base sm:text-lg text-neutral-100">{product.title}</h3>
            </div>

            {/* Exit Cross Button for the Image Inspector */}
            <button
              onClick={() => setIsFullscreenImage(false)}
              aria-label="Exit image inspector"
              title="Exit fullscreen inspector (Esc)"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 rounded-full text-xs font-semibold transition-all cursor-pointer group"
            >
              <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Exit Inspector</span>
            </button>
          </div>

          {/* Centered High-Res Image with Left/Right Navigation */}
          <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center p-4">
            {allImages.length > 1 && (
              <button
                onClick={handlePrevImage}
                aria-label="Previous image"
                className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xl z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={resolveImageUrl(activeImage || product.imageUrl)}
              alt={product.title}
              onError={handleImageError}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[75vh] object-contain drop-shadow-2xl"
            />

            {allImages.length > 1 && (
              <button
                onClick={handleNextImage}
                aria-label="Next image"
                className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xl z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails & Photo Index */}
          <div className="w-full max-w-3xl flex items-center justify-between text-neutral-400 text-xs pt-3">
            <span className="font-mono-num">
              Photo {currentImageIndex + 1} of {allImages.length}
            </span>
            <div className="flex items-center gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-12 h-10 rounded border overflow-hidden transition-all ${
                    activeImage === img ? 'border-[#bfa054] scale-105' : 'border-neutral-700 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={resolveImageUrl(img)}
                    alt=""
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsFullscreenImage(false)}
              className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
            >
              Close (Esc)
            </button>
          </div>
        </div>
      )}

      {/* Buy Now Escrow Checkout Modal */}
      {showBuyNowModal && auction.buyNowPrice && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBuyNowModal(false);
          }}
          className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2 text-[#0c1926] font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-[#bfa054]" />
                <span className="font-serif-luxury">CURIO Vault Escrow Checkout</span>
              </div>
              <button 
                onClick={() => setShowBuyNowModal(false)} 
                aria-label="Exit checkout"
                className="text-neutral-400 hover:text-black p-1 rounded-md hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-neutral-700">
                <span>Lot Subtotal:</span>
                <span className="font-mono-num font-bold text-neutral-900">{formatPrice(auction.buyNowPrice)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Platform Escrow Fee (5%):</span>
                <span className="font-mono-num">{formatPrice(auction.buyNowPrice * 0.05)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Insured Armored Logistics:</span>
                <span className="font-mono-num">{formatPrice(35)}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-900">
                <span>Total Escrow Authorization:</span>
                <span className="font-mono-num text-[#bfa054]">
                  {formatPrice(auction.buyNowPrice + 35)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-600 font-semibold block">Armored Delivery Address:</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={2}
                className="w-full bg-neutral-50 border border-neutral-300 rounded p-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed font-light">
              Payment is held in trusted CURIO Escrow until museum inspection verifies authentic physical condition.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowBuyNowModal(false)}
                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBuyNow}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-[#bfa054] hover:bg-[#a98c42] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs cursor-pointer"
              >
                {isSubmitting ? 'Processing Vault Order...' : 'Authorize Escrow'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

