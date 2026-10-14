import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Bell, 
  ShoppingBag, 
  FileCode2, 
  RotateCcw,
  User as UserIcon,
  ChevronRight,
  ShieldCheck,
  Search,
  Menu,
  X,
  Heart,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCreateModal: () => void;
  openAuthModal: () => void;
  openArchitectureModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openCreateModal,
  openAuthModal,
  openArchitectureModal,
  searchQuery,
  setSearchQuery,
}) => {
  const { 
    currentUser, 
    switchUserRole, 
    notifications, 
    markNotificationAsRead, 
    orders,
    watchlist,
    currency,
    setCurrency,
    resetDatabase 
  } = useMarketplace();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const bagCount = orders.length;
  const watchlistCount = watchlist.length;

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
      {/* Top Subtle Luxury Gold Accent Bar */}
      <div className="bg-[#0b1726] text-neutral-300 text-[11px] py-1.5 px-4 hidden sm:block border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono-num text-[10px] text-[#bfa054] font-bold tracking-widest uppercase">
              AUTHENTICATED GALLERY LOTS
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400 text-[10px] tracking-wide">
              MUSEUM PROVENANCE & INSURED VAULT ESCROW
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] tracking-wider text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE AUCTIONS OPEN
            </span>
            <span>·</span>
            <button 
              onClick={openArchitectureModal}
              className="text-neutral-300 hover:text-[#bfa054] transition-colors cursor-pointer flex items-center gap-1"
            >
              <FileCode2 className="w-3 h-3 text-[#bfa054]" />
              <span>JAVA/SQL STACK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar matching the Screenshot layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger + Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex flex-col">
            <button
              onClick={() => handleNavClick('home')}
              className="font-serif-luxury text-2xl sm:text-3xl font-extrabold tracking-[0.22em] text-[#0b1726] hover:opacity-90 transition-opacity cursor-pointer uppercase flex items-center gap-1.5"
            >
              <span>CURIO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#bfa054] inline-block mb-1" />
            </button>
            <span className="hidden sm:block text-[9px] font-mono-num tracking-[0.3em] uppercase text-neutral-400 -mt-1">
              EST. 2026 · LONDON & NEW YORK
            </span>
          </div>
        </div>

        {/* Center: Primary Navigation Links matching Screenshot 1 & 2 */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-semibold tracking-wider text-[#1e293b]">
          <button
            onClick={() => handleNavClick('home')}
            className={`relative py-1 cursor-pointer tracking-widest uppercase transition-all ${
              currentTab === 'home'
                ? 'text-[#0c1827] font-bold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#bfa054]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            HOME
          </button>

          <button
            onClick={() => handleNavClick('explore')}
            className={`relative py-1 cursor-pointer tracking-widest uppercase transition-all ${
              currentTab === 'explore'
                ? 'text-[#0c1827] font-bold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#bfa054]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            SHOP
          </button>

          <button
            onClick={() => handleNavClick('how_it_works')}
            className={`relative py-1 cursor-pointer tracking-widest uppercase transition-all ${
              currentTab === 'how_it_works'
                ? 'text-[#0c1827] font-bold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#bfa054]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            HOW IT WORKS
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`relative py-1 cursor-pointer tracking-widest uppercase transition-all ${
              currentTab === 'about'
                ? 'text-[#0c1827] font-bold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#bfa054]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            ABOUT
          </button>

          <button
            onClick={() => {
              if (currentUser) {
                handleNavClick('dashboard');
              } else {
                openAuthModal();
              }
            }}
            className={`relative py-1 cursor-pointer tracking-widest uppercase transition-all ${
              currentTab === 'dashboard'
                ? 'text-[#0c1827] font-bold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#bfa054]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            PORTFOLIO
          </button>

          <button
            onClick={() => handleNavClick('blog')}
            className={`relative py-1 cursor-pointer tracking-widest uppercase transition-all ${
              currentTab === 'blog'
                ? 'text-[#0c1827] font-bold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#bfa054]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            BLOG
          </button>

          <button
            onClick={() => handleNavClick('book_online')}
            className={`relative py-1 cursor-pointer tracking-widest uppercase transition-all ${
              currentTab === 'book_online'
                ? 'text-[#0c1827] font-bold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#bfa054]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            BOOK ONLINE
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`relative py-1 cursor-pointer tracking-widest uppercase transition-all ${
              currentTab === 'contact'
                ? 'text-[#0c1827] font-bold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#bfa054]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            CONTACT
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative py-1 cursor-pointer tracking-widest uppercase text-neutral-600 hover:text-black transition-colors flex items-center gap-1"
          >
            <span>NOTIFICATIONS</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#bfa054] text-white text-[9px] font-mono-num font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={openCreateModal}
            className="transition-all py-1.5 px-3 cursor-pointer tracking-widest uppercase text-[#bfa054] hover:text-white hover:bg-[#bfa054] border border-[#bfa054]/40 hover:border-[#bfa054] rounded font-bold shadow-xs"
          >
            START AUCTION
          </button>

          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`relative py-1 cursor-pointer tracking-widest uppercase transition-all ${
                currentTab === 'admin'
                  ? 'text-amber-700 font-bold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-600'
                  : 'text-amber-700/80 hover:text-amber-900 font-semibold'
              }`}
            >
              ADMIN
            </button>
          )}
        </nav>

        {/* Right Section: Quick Search + Currency Toggle + User Circle + Shopping Bag */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Search Toggle / Input */}
          <div className="relative flex items-center">
            {isSearchExpanded ? (
              <div className="flex items-center bg-neutral-100 border border-neutral-300 rounded-full px-2.5 py-1 text-xs transition-all w-48 sm:w-60 shadow-xs">
                <Search className="w-3.5 h-3.5 text-neutral-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentTab !== 'explore') setCurrentTab('explore');
                  }}
                  placeholder="Search lots, makers..."
                  className="bg-transparent border-none outline-none text-neutral-900 text-xs w-full placeholder-neutral-400"
                />
                <button
                  onClick={() => setIsSearchExpanded(false)}
                  className="text-neutral-400 hover:text-black ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSearchExpanded(true);
                  if (currentTab !== 'explore') setCurrentTab('explore');
                }}
                className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                title="Search gallery lots"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Currency Toggle (₹ INR / $ USD) */}
          <div className="hidden sm:flex items-center bg-neutral-100 p-0.5 rounded text-[11px] font-medium border border-neutral-200">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                currency === 'INR' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                currency === 'USD' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Architecture / Java Code Explorer Button */}
          <button
            onClick={openArchitectureModal}
            title="Inspect Java Servlets, DAO & MySQL schema"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-xs text-neutral-700 font-medium transition-colors cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5 text-[#bfa054]" />
            <span>Architecture</span>
          </button>

          {/* User Avatar Circle matching Screenshot 1 */}
          <div className="relative">
            <button
              onClick={() => {
                if (currentUser) {
                  setShowUserMenu(!showUserMenu);
                } else {
                  openAuthModal();
                }
              }}
              className="flex items-center gap-1 p-1 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
              aria-label="User account"
            >
              <div className="w-8 h-8 rounded-full bg-[#f1f3f7] border border-neutral-300 flex items-center justify-center text-[#0c1827] hover:border-[#bfa054] transition-colors">
                <UserIcon className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
            </button>

            {/* Profile Menu Popover */}
            {showUserMenu && currentUser && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-neutral-100">
                  <p className="text-xs font-bold text-neutral-900">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                      {currentUser.role}
                    </span>
                    <span className="text-[10px] text-neutral-400">Rating: {currentUser.rating} ★</span>
                  </div>
                </div>

                <div className="px-3 py-2 border-b border-neutral-100">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">Switch Persona</p>
                  <div className="flex flex-col gap-1 text-xs">
                    <button
                      onClick={() => { switchUserRole('USER'); setShowUserMenu(false); }}
                      className={`text-left px-2 py-1 rounded transition-colors ${
                        currentUser.role === 'USER' ? 'bg-neutral-100 font-bold text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Collector (sarvesh_collector)
                    </button>
                    <button
                      onClick={() => { switchUserRole('ADMIN'); setShowUserMenu(false); }}
                      className={`text-left px-2 py-1 rounded transition-colors ${
                        currentUser.role === 'ADMIN' ? 'bg-neutral-100 font-bold text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Administrator (admin_curio)
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      resetDatabase();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                    Reset Initial State
                  </button>
                  <button
                    onClick={() => {
                      switchUserRole('GUEST');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-neutral-50 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Minimalist Shopping Bag icon with Number Counter matching Screenshot 1 & 2 */}
          <button
            onClick={() => {
              if (currentUser) {
                handleNavClick('dashboard');
              } else {
                openAuthModal();
              }
            }}
            className="relative flex items-center justify-center p-1 text-[#0b1726] hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="View orders and cart"
            title="Orders & Escrow Vault"
          >
            <div className="relative">
              <ShoppingBag className="w-7 h-7 stroke-[1.6]" />
              <span className="absolute inset-0 flex items-center justify-center font-mono-num text-[11px] font-bold text-[#0b1726] pt-1.5">
                {bagCount}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentTab !== 'explore') setCurrentTab('explore');
              }}
              placeholder="Search gallery lots, makers..."
              className="w-full bg-[#f8f9fa] border border-neutral-200 rounded-lg pl-9 pr-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#bfa054]"
            />
          </div>

          {/* Navigation Links list */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold tracking-wider uppercase">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-3 text-left rounded-lg transition-colors ${
                currentTab === 'home' ? 'bg-[#0b1726] text-white font-bold' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => handleNavClick('explore')}
              className={`p-3 text-left rounded-lg transition-colors ${
                currentTab === 'explore' ? 'bg-[#0b1726] text-white font-bold' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              SHOP
            </button>
            <button
              onClick={() => handleNavClick('how_it_works')}
              className={`p-3 text-left rounded-lg transition-colors ${
                currentTab === 'how_it_works' ? 'bg-[#0b1726] text-white font-bold' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              HOW IT WORKS
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`p-3 text-left rounded-lg transition-colors ${
                currentTab === 'about' ? 'bg-[#0b1726] text-white font-bold' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              ABOUT
            </button>
            <button
              onClick={() => {
                if (currentUser) handleNavClick('dashboard');
                else openAuthModal();
              }}
              className={`p-3 text-left rounded-lg transition-colors ${
                currentTab === 'dashboard' ? 'bg-[#0b1726] text-white font-bold' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              PORTFOLIO
            </button>
            <button
              onClick={() => handleNavClick('blog')}
              className={`p-3 text-left rounded-lg transition-colors ${
                currentTab === 'blog' ? 'bg-[#0b1726] text-white font-bold' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              BLOG
            </button>
            <button
              onClick={() => handleNavClick('watchlist')}
              className={`p-3 text-left rounded-lg transition-colors flex items-center justify-between ${
                currentTab === 'watchlist' ? 'bg-[#0b1726] text-white font-bold' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span>WATCHLIST</span>
              {watchlistCount > 0 && (
                <span className="px-1.5 py-0.5 bg-[#bfa054] text-white text-[10px] rounded-full font-mono-num">
                  {watchlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('book_online')}
              className={`p-3 text-left rounded-lg transition-colors ${
                currentTab === 'book_online' ? 'bg-[#0b1726] text-white font-bold' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              BOOK ONLINE
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`p-3 text-left rounded-lg transition-colors col-span-2 ${
                currentTab === 'contact' ? 'bg-[#0b1726] text-white font-bold' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              CONTACT & SALEROOMS
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => {
                openCreateModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#bfa054] hover:bg-[#a98c42] text-white font-bold text-xs tracking-widest uppercase rounded shadow-xs text-center cursor-pointer"
            >
              START AUCTION LISTING
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-neutral-500 font-medium">Currency Display</span>
              <div className="flex items-center bg-neutral-100 p-0.5 rounded border border-neutral-200">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1 rounded cursor-pointer ${
                    currency === 'INR' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded cursor-pointer ${
                    currency === 'USD' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                openArchitectureModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-xs rounded text-center flex items-center justify-center gap-1.5"
            >
              <FileCode2 className="w-3.5 h-3.5 text-[#bfa054]" />
              <span>Inspect Java Servlets & SQL Architecture</span>
            </button>
          </div>
        </div>
      )}

      {/* Notifications Popover if open */}
      {showNotifications && (
        <div className="absolute right-4 sm:right-8 top-20 w-80 sm:w-96 bg-white border border-neutral-200 rounded-xl shadow-2xl py-2 z-50">
          <div className="px-4 py-2.5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#bfa054]" />
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Gallery Dispatches
              </span>
            </div>
            <span className="text-[11px] text-[#bfa054] font-bold font-mono-num">
              {unreadCount} unread
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-xs text-neutral-400 text-center">No notifications yet.</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markNotificationAsRead(item.id)}
                  className={`p-3.5 text-xs cursor-pointer hover:bg-neutral-50 transition-colors ${
                    !item.isRead ? 'bg-amber-50/40 border-l-2 border-[#bfa054]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-neutral-900">
                    <span className="font-serif-luxury">{item.title}</span>
                    <span className="text-[10px] text-neutral-400 font-mono-num">{item.timeAgo}</span>
                  </div>
                  <p className="text-neutral-600 text-[11px] mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  );
};
