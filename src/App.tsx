import React, { useState, useEffect } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GalleryProductsSection } from './components/GalleryProductsSection';
import { StartAuctionBanner } from './components/StartAuctionBanner';
import { AuctionCard } from './components/AuctionCard';
import { ExploreMarketplace } from './components/ExploreMarketplace';
import { AuctionDetailModal } from './components/AuctionDetailModal';
import { CreateAuctionModal } from './components/CreateAuctionModal';
import { PortfolioPageView } from './components/PortfolioPageView';
import { BlogView } from './components/BlogView';
import { BookOnlineView } from './components/BookOnlineView';
import { AboutView } from './components/AboutView';
import { HowItWorksView } from './components/HowItWorksView';
import { ContactView } from './components/ContactView';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { ArchitectureExplorerModal } from './components/ArchitectureExplorerModal';
import { AuthModal } from './components/AuthModal';
import { CATEGORIES } from './data/initialData';
import { resolveImageUrl, handleImageError } from './utils/imageHelper';
import { 
  ShieldCheck, 
  Clock, 
  Lock, 
  Gavel, 
  ArrowRight, 
  Heart,
  ShoppingBag,
  Sparkles,
  Award,
  CheckCircle2,
  Mail,
  Send,
  Star
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { auctions, products, watchlist, formatPrice } = useMarketplace();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home'); // 'home' | 'explore' | 'watchlist' | 'dashboard' | 'admin' | 'about' | 'how_it_works' | 'contact'
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals State
  const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // VIP Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);



  // Synchronize state with URL hash for a genuine multi-page website experience
  useEffect(() => {
    const handleHashChange = () => {
      const raw = window.location.hash.replace(/^#\/?/, '');
      if (!raw) {
        setCurrentTab('home');
        return;
      }
      if (raw.startsWith('lot/')) {
        const id = parseInt(raw.replace('lot/', ''));
        if (!isNaN(id)) {
          setSelectedAuctionId(id);
        }
        return;
      }
      const validTabs = ['home', 'explore', 'dashboard', 'watchlist', 'blog', 'book_online', 'about', 'how_it_works', 'contact', 'admin'];
      if (validTabs.includes(raw)) {
        setCurrentTab(raw);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAuction = (id: number | null) => {
    setSelectedAuctionId(id);
    if (id !== null) {
      window.location.hash = `#/lot/${id}`;
    } else {
      window.location.hash = `#/${currentTab}`;
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
    }
  };

  // Home page ending soon & featured collections
  const endingSoonAuctions = auctions
    .filter((a) => a.status === 'ACTIVE')
    .sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
    .slice(0, 6);

  const watchlistedAuctions = auctions.filter((a) => watchlist.includes(a.id));

  return (
    <div className="min-h-screen bg-[#fafafc] text-[#1e293b] flex flex-col font-sans">


      {/* 1. Global Navigation Bar matching Screenshot 1 & 2 */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={navigateTo}
        openCreateModal={() => setIsCreateOpen(true)}
        openAuthModal={() => setIsAuthOpen(true)}
        openArchitectureModal={() => setIsArchitectureOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q.trim()) navigateTo('explore');
        }}
      />

      {/* 2. Main Viewport Content based on active tab */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-0">
            {/* Hero Section matching Screenshot 1 */}
            <HeroSection
              onExploreClick={() => navigateTo('explore')}
              onLotClick={(id) => handleSelectAuction(id)}
            />

            {/* Gallery Products Showcase matching Screenshot 2 */}
            <GalleryProductsSection
              onSelectAuction={(id) => handleSelectAuction(id)}
              onExploreMore={() => navigateTo('explore')}
            />

            {/* Promotional Split Showcase matching Screenshot 3 */}
            <StartAuctionBanner
              onStartAuction={() => setIsCreateOpen(true)}
            />

            {/* High-End Active Bidding Sessions */}
            <section className="bg-white py-16 sm:py-20 border-b border-neutral-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-mono-num text-[11px] uppercase tracking-wider text-[#bfa054] font-bold block mb-1">
                      REAL-TIME GALLERY SESSIONS
                    </span>
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#0c1926]">
                      Featured Active Lots
                    </h3>
                  </div>

                  <button
                    onClick={() => navigateTo('explore')}
                    className="text-xs font-semibold tracking-wider uppercase text-neutral-600 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View All Lots ({auctions.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {endingSoonAuctions.map((auction) => {
                    const prod = products.find((p) => p.id === auction.productId);
                    if (!prod) return null;
                    return (
                      <AuctionCard
                        key={auction.id}
                        auction={auction}
                        product={prod}
                        onSelect={(id) => handleSelectAuction(id)}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Curatorial Journal Highlights Section */}
            <section className="bg-[#f8f9fb] py-16 border-b border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-mono-num text-[11px] uppercase tracking-wider text-[#bfa054] font-bold block mb-1">
                      SCHOLARLY DISPATCHES
                    </span>
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#0c1926]">
                      The Curatorial Journal
                    </h3>
                  </div>

                  <button
                    onClick={() => navigateTo('blog')}
                    className="text-xs font-semibold tracking-wider uppercase text-neutral-600 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Read Journal Archives</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div 
                    onClick={() => navigateTo('blog')}
                    className="p-5 bg-white border border-neutral-200 rounded-xl space-y-3 cursor-pointer group hover:border-[#bfa054] transition-all"
                  >
                    <div className="aspect-[16/10] bg-neutral-100 rounded-lg overflow-hidden">
                      <img
                        src={resolveImageUrl('/images/curio_item_rolex_1791467020069.jpg')}
                        alt="Submariner 5513 Study"
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[10px] font-mono-num text-[#bfa054] font-bold uppercase">FINE HOROLOGY</span>
                    <h4 className="font-serif-luxury text-base font-semibold text-neutral-900 group-hover:text-[#bfa054] transition-colors line-clamp-1">
                      Identifying the "Meters First" Dial in Vintage Submariners
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-2 font-light">
                      A study of font kerning, tritium decay curves, and case chamfer preservation.
                    </p>
                  </div>

                  <div 
                    onClick={() => navigateTo('blog')}
                    className="p-5 bg-white border border-neutral-200 rounded-xl space-y-3 cursor-pointer group hover:border-[#bfa054] transition-all"
                  >
                    <div className="aspect-[16/10] bg-neutral-100 rounded-lg overflow-hidden">
                      <img
                        src={resolveImageUrl('/images/curio_item_coin_1791467051484.jpg')}
                        alt="Athenian Coin Study"
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[10px] font-mono-num text-[#bfa054] font-bold uppercase">NUMISMATICS</span>
                    <h4 className="font-serif-luxury text-base font-semibold text-neutral-900 group-hover:text-[#bfa054] transition-colors line-clamp-1">
                      Archaic Athenian Coinage: The Owl Tetradrachm
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-2 font-light">
                      How Laurion silver mines financed Athenian naval hegemony and Mediterranean trade.
                    </p>
                  </div>

                  <div 
                    onClick={() => navigateTo('blog')}
                    className="p-5 bg-white border border-neutral-200 rounded-xl space-y-3 cursor-pointer group hover:border-[#bfa054] transition-all"
                  >
                    <div className="aspect-[16/10] bg-neutral-100 rounded-lg overflow-hidden">
                      <img
                        src={resolveImageUrl('/images/curio_item_camera_1791467068473.jpg')}
                        alt="Leica M3 Study"
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[10px] font-mono-num text-[#bfa054] font-bold uppercase">VINTAGE OPTICS</span>
                    <h4 className="font-serif-luxury text-base font-semibold text-neutral-900 group-hover:text-[#bfa054] transition-colors line-clamp-1">
                      Mechanical Rangefinder Calibration: Leica M3 Legacy
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-2 font-light">
                      Why 0.91x magnification prisms remain unmatched for 50mm documentary street mastery.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Platform Integrity & Escrow Pillars */}
            <section className="bg-white py-16 border-b border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 bg-[#f8f9fb] border border-neutral-200 rounded-xl space-y-3 shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-[#bfa054] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">
                      Physical Curator Verification
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                      Every rare timepiece, manuscript, and vintage optic is verified by museum specialists prior to escrow transfer.
                    </p>
                  </div>

                  <div className="p-6 bg-[#f8f9fb] border border-neutral-200 rounded-xl space-y-3 shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-800 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">
                      Atomic Transaction Bidding
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                      Rigorous database row locking (<code>SELECT FOR UPDATE</code>) guarantees zero race condition collisions or lost bids.
                    </p>
                  </div>

                  <div className="p-6 bg-[#f8f9fb] border border-neutral-200 rounded-xl space-y-3 shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Gavel className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">
                      Insured Escrow Vault Delivery
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                      Buyer funds are safely held in escrow until armored white-glove transport delivers your collectible.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Institutional Trust & Collector Testimonials */}
            <section className="bg-[#f8f9fb] py-16 sm:py-20 border-b border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="font-mono-num text-[11px] uppercase tracking-wider text-[#bfa054] font-bold block">
                    CONNOISSEUR TESTIMONIALS
                  </span>
                  <h3 className="font-serif-luxury text-3xl font-normal text-[#0c1926]">
                    Trusted by Global Salerooms
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-4 shadow-xs">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed italic font-light">
                      "Consigning our private estate's 1968 Rolex Submariner through CURIO was effortless. The provenance report and escrow fulfillment exceeded London saleroom benchmarks."
                    </p>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-neutral-900">E. Montgomery, F.R.S.A.</span>
                      <span className="text-neutral-400">London, UK</span>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-4 shadow-xs">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed italic font-light">
                      "The deterministic row locking gives you genuine peace of mind during closing countdowns. No phantom outbids, no server lags. Pure architectural perfection."
                    </p>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-neutral-900">Dr. K. Arisawa</span>
                      <span className="text-neutral-400">Tokyo, Japan</span>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-4 shadow-xs">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed italic font-light">
                      "Armored courier delivery straight to our Manhattan gallery within 48 hours of escrow authorization. Truly the premier digital saleroom of our generation."
                    </p>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-neutral-900">S. Davenport</span>
                      <span className="text-neutral-400">New York, USA</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* VIP Saleroom Newsletter Invitation */}
            <section className="bg-[#0b1726] text-white py-16 px-4 border-b border-neutral-800">
              <div className="max-w-3xl mx-auto text-center space-y-5">
                <span className="font-mono-num text-[10px] tracking-widest uppercase text-[#bfa054] font-bold">
                  PRIVATE SALEROOM NOTICES
                </span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl font-normal">
                  Subscribe to Confidential Lot Catalogues
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-lg mx-auto">
                  Receive advance notice of private treaty sales, unreserved museum consignments, and horological auction previews.
                </p>

                {newsletterSubscribed ? (
                  <div className="p-4 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-emerald-300 text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Welcome to the Curio Private Saleroom Roster. Dispatch sent to {newsletterEmail}.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your collector email address..."
                      className="flex-1 bg-white/10 border border-neutral-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#bfa054]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#bfa054] hover:bg-[#a98c42] text-white font-bold text-xs uppercase tracking-widest rounded cursor-pointer transition-colors whitespace-nowrap shadow-xs"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>
        )}

        {currentTab === 'explore' && (
          <div className="bg-white min-h-[80vh]">
            <ExploreMarketplace
              onSelectAuction={(id) => handleSelectAuction(id)}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        )}

        {currentTab === 'watchlist' && (
          <div className="bg-white min-h-[80vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                  PRIVATE MONITOR
                </span>
                <h2 className="font-serif-luxury text-3xl font-bold text-[#0c1827]">
                  Your Saved Watchlist
                </h2>
              </div>

              {watchlistedAuctions.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4">
                  <Heart className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="text-sm font-medium text-neutral-600">No items currently on your watchlist.</p>
                  <button
                    onClick={() => navigateTo('explore')}
                    className="px-6 py-2.5 bg-[#0c1827] text-white text-xs font-semibold uppercase tracking-wider rounded"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {watchlistedAuctions.map((auction) => {
                    const prod = products.find((p) => p.id === auction.productId);
                    if (!prod) return null;
                    return (
                      <AuctionCard
                        key={auction.id}
                        auction={auction}
                        product={prod}
                        onSelect={(id) => handleSelectAuction(id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'dashboard' && (
          <PortfolioPageView
            onSelectAuction={(id) => handleSelectAuction(id)}
            onOpenCreateAuction={() => setIsCreateOpen(true)}
          />
        )}

        {currentTab === 'blog' && (
          <BlogView />
        )}

        {currentTab === 'book_online' && (
          <BookOnlineView />
        )}

        {currentTab === 'about' && (
          <AboutView 
            onExploreClick={() => navigateTo('explore')}
            onBookConsignment={() => navigateTo('book_online')}
          />
        )}

        {currentTab === 'how_it_works' && (
          <HowItWorksView 
            onStartBidding={() => navigateTo('explore')}
            onConsignItem={() => setIsCreateOpen(true)}
          />
        )}

        {currentTab === 'contact' && (
          <ContactView />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardModal
            isOpen={true}
            onClose={() => navigateTo('home')}
          />
        )}
      </main>

      {/* 3. Global Modals */}
      {selectedAuctionId !== null && (
        <AuctionDetailModal
          auctionId={selectedAuctionId}
          onClose={() => handleSelectAuction(null)}
          onSelectOtherAuction={(id) => handleSelectAuction(id)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {isCreateOpen && (
        <CreateAuctionModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={(auctionId) => {
            handleSelectAuction(auctionId);
            navigateTo('explore');
          }}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {isArchitectureOpen && (
        <ArchitectureExplorerModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      )}

      {/* 4. Luxury Footer matching Screenshot 2 bottom */}
      <footer className="bg-[#0b1726] text-white border-t border-neutral-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-neutral-800">
            {/* Brand column */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-3xl font-extrabold tracking-[0.22em] text-white">
                  CURIO
                </span>
                <span className="w-2 h-2 rounded-full bg-[#bfa054]" />
              </div>
              <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-light">
                Premier digital saleroom and verified auction marketplace for certified rare horology, archaic numismatics, historical documents, and distinguished fine collectibles.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#bfa054] font-mono-num font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% ESCROW PROTECTED · WHITE-GLOVE ARMORED COURIER</span>
              </div>
            </div>

            {/* Saleroom Departments */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-[10px] font-mono-num tracking-widest uppercase text-[#bfa054] font-bold block">
                SALEROOM DEPARTMENTS
              </span>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li>
                  <button 
                    onClick={() => { setSelectedCategory(1); navigateTo('explore'); }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Haute Horlogerie & Timepieces
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setSelectedCategory(3); navigateTo('explore'); }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Ancient & Classical Numismatics
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setSelectedCategory(4); navigateTo('explore'); }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Vintage Optics & Rangefinders
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setSelectedCategory(2); navigateTo('explore'); }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Graded Holographic Cards & Folios
                  </button>
                </li>
              </ul>
            </div>

            {/* Collector Information */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] font-mono-num tracking-widest uppercase text-[#bfa054] font-bold block">
                ABOUT & GUIDES
              </span>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li>
                  <button 
                    onClick={() => navigateTo('about')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    The Curio Heritage
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('how_it_works')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    How Auctions Work
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('blog')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Curatorial Journal
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('contact')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Contact & Salerooms
                  </button>
                </li>
              </ul>
            </div>

            {/* Curatorial & System Links */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-[10px] font-mono-num tracking-widest uppercase text-[#bfa054] font-bold block">
                COLLECTOR SERVICES
              </span>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li>
                  <button 
                    onClick={() => navigateTo('book_online')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Book Curatorial Appraisal
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsArchitectureOpen(true)}
                    className="hover:text-[#bfa054] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Java / MySQL Relational Stack</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-[#bfa054] rounded font-mono-num">MVC</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="text-[#bfa054] hover:text-white font-semibold transition-colors cursor-pointer"
                  >
                    Consign a Lot for Auction →
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigateTo('home')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                HOME
              </button>
              <button
                onClick={() => navigateTo('explore')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                SHOP
              </button>
              <button
                onClick={() => navigateTo('how_it_works')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                HOW IT WORKS
              </button>
              <button
                onClick={() => navigateTo('about')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                ABOUT
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                CONTACT
              </button>
              <button
                onClick={() => navigateTo('watchlist')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                WATCHLIST ({watchlist.length})
              </button>
              <button
                onClick={() => setIsArchitectureOpen(true)}
                className="hover:text-[#bfa054] transition-colors cursor-pointer"
              >
                ARCHITECTURE
              </button>
            </div>
            <p className="font-mono-num text-[11px] text-neutral-500">
              © 2026 CURIO Fine Auctions & Collectibles Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MainContent />
    </MarketplaceProvider>
  );
}

