import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Gavel, 
  Trophy, 
  Package, 
  Coins, 
  Heart, 
  Truck, 
  ShieldCheck, 
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface PortfolioPageViewProps {
  onSelectAuction: (id: number) => void;
  onOpenCreateAuction: () => void;
}

export const PortfolioPageView: React.FC<PortfolioPageViewProps> = ({
  onSelectAuction,
  onOpenCreateAuction,
}) => {
  const { currentUser, auctions, products, bids, orders, watchlist, formatPrice } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'overview' | 'bids' | 'auctions' | 'purchases' | 'sales' | 'watchlist'>('overview');

  if (!currentUser) return null;

  const userBids = bids.filter((b) => b.bidderId === currentUser.id);
  const userAuctions = auctions.filter((a) => a.sellerId === currentUser.id);
  const userPurchases = orders.filter((o) => o.buyerId === currentUser.id);
  const userSales = orders.filter((o) => o.sellerId === currentUser.id);
  const wonAuctions = auctions.filter((a) => a.status === 'SOLD' && a.currentWinnerId === currentUser.id);
  const totalSellerEarnings = userSales.reduce((acc, o) => acc + o.sellerAmount, 0);

  return (
    <div className="bg-white min-h-[85vh] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header */}
        <div className="p-6 sm:p-8 bg-[#f8f9fa] border border-neutral-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#0c1926] text-white flex items-center justify-center font-serif-luxury text-2xl font-bold">
              {currentUser.firstName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-luxury text-2xl font-bold text-[#0c1926]">
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded">
                  {currentUser.role}
                </span>
                <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Accredited Collector
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Username: <strong>{currentUser.username}</strong> · {currentUser.email} · Rating: <strong className="text-amber-700">{currentUser.rating} ★</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCreateAuction}
            className="px-6 py-2.5 bg-[#bfa054] hover:bg-[#a98c42] text-white font-semibold text-xs tracking-widest uppercase rounded shadow-xs transition-colors cursor-pointer self-start md:self-auto"
          >
            Start New Auction Listing
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-neutral-200 flex items-center gap-8 overflow-x-auto text-xs font-semibold tracking-wider uppercase">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview' ? 'border-[#bfa054] text-[#0c1926] font-bold' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bids' ? 'border-[#bfa054] text-[#0c1926] font-bold' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Active Bids ({userBids.length})
          </button>
          <button
            onClick={() => setActiveTab('auctions')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'auctions' ? 'border-[#bfa054] text-[#0c1926] font-bold' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            My Consigned Lots ({userAuctions.length})
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'purchases' ? 'border-[#bfa054] text-[#0c1926] font-bold' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Vault Purchases ({userPurchases.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sales' ? 'border-[#bfa054] text-[#0c1926] font-bold' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Sales Payouts ({userSales.length})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'watchlist' ? 'border-[#bfa054] text-[#0c1926] font-bold' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Total Bids Placed</span>
                <p className="font-mono-num text-3xl font-bold text-[#0c1926]">{userBids.length}</p>
              </div>
              <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Won Auction Lots</span>
                <p className="font-mono-num text-3xl font-bold text-emerald-700">{wonAuctions.length}</p>
              </div>
              <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Active Consignments</span>
                <p className="font-mono-num text-3xl font-bold text-[#0c1926]">{userAuctions.length}</p>
              </div>
              <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">Net Sales Disbursed</span>
                <p className="font-mono-num text-3xl font-bold text-[#bfa054]">{formatPrice(totalSellerEarnings)}</p>
              </div>
            </div>

            {/* Recent Bids Table */}
            <div className="space-y-4">
              <h3 className="font-serif-luxury text-lg font-semibold text-[#0c1926]">
                Recent Bidding Audit
              </h3>
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
                {userBids.slice(0, 6).map((bid) => {
                  const auc = auctions.find((a) => a.id === bid.auctionId);
                  const prod = products.find((p) => p.id === auc?.productId);
                  const isWinning = auc?.currentWinnerId === currentUser.id;

                  return (
                    <div
                      key={bid.id}
                      onClick={() => auc && onSelectAuction(auc.id)}
                      className="p-4 flex items-center justify-between text-xs hover:bg-[#fafafc] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {prod && (
                          <img
                            src={resolveImageUrl(prod.imageUrl)}
                            alt=""
                            onError={handleImageError}
                            className="w-12 h-12 object-contain bg-neutral-50 rounded"
                          />
                        )}
                        <div>
                          <p className="font-serif-luxury font-semibold text-neutral-900 text-sm">{prod?.title || 'Auction Lot'}</p>
                          <p className="text-neutral-500 text-[11px] mt-0.5">
                            Placed {bid.timestamp} · Lot #{bid.auctionId}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-mono-num font-bold text-neutral-900 text-sm">
                          {formatPrice(bid.amount)}
                        </p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isWinning ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {isWinning ? 'Leading Bidder' : 'Outbid'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bids' && (
          <div className="space-y-4">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#0c1926]">All Placed Bids</h3>
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
              {userBids.map((bid) => {
                const auc = auctions.find((a) => a.id === bid.auctionId);
                const prod = products.find((p) => p.id === auc?.productId);
                return (
                  <div
                    key={bid.id}
                    onClick={() => auc && onSelectAuction(auc.id)}
                    className="p-4 flex items-center justify-between text-xs hover:bg-neutral-50 cursor-pointer"
                  >
                    <div>
                      <p className="font-serif-luxury font-semibold text-sm text-neutral-900">{prod?.title}</p>
                      <p className="text-neutral-500 text-[11px]">Placed {bid.timestamp}</p>
                    </div>
                    <div className="text-right font-mono-num">
                      <p className="font-bold text-neutral-900 text-sm">{formatPrice(bid.amount)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="space-y-4">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#0c1926]">Vault Purchases & Orders</h3>
            <div className="space-y-3">
              {userPurchases.length === 0 ? (
                <p className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl">No vault orders completed yet.</p>
              ) : (
                userPurchases.map((o) => {
                  const prod = products.find((p) => p.id === o.productId);
                  return (
                    <div key={o.id} className="p-5 bg-white border border-neutral-200 rounded-xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2 text-xs">
                        <span className="font-mono-num font-bold text-neutral-900">{o.orderNumber}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">
                          {o.orderStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <p className="font-serif-luxury font-semibold text-sm text-neutral-900">{prod?.title}</p>
                          <p className="text-neutral-500 text-[11px] mt-0.5">Tracking: {o.trackingNumber}</p>
                        </div>
                        <div className="text-right font-mono-num">
                          <p className="font-bold text-base text-neutral-900">{formatPrice(o.amount)}</p>
                          <p className="text-[10px] text-emerald-700">Payment: {o.paymentStatus}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-4">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#0c1926]">Consignment Payouts</h3>
            <div className="space-y-3">
              {userSales.length === 0 ? (
                <p className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl">No items sold yet. List an item to begin!</p>
              ) : (
                userSales.map((s) => (
                  <div key={s.id} className="p-4 bg-white border border-neutral-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-mono-num font-bold text-neutral-900">Order #{s.orderNumber}</p>
                      <p className="text-neutral-500 text-[11px]">Gross Sale: {formatPrice(s.amount)} · Platform Escrow Fee (5%): {formatPrice(s.platformFee)}</p>
                    </div>
                    <div className="text-right font-mono-num">
                      <span className="font-bold text-emerald-700 text-sm">+{formatPrice(s.sellerAmount)} Net Payout</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="space-y-4">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#0c1926]">Saved Watchlist Lots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlist.map((id) => {
                const auc = auctions.find((a) => a.id === id);
                const prod = products.find((p) => p.id === auc?.productId);
                if (!auc || !prod) return null;
                return (
                  <div
                    key={auc.id}
                    onClick={() => onSelectAuction(auc.id)}
                    className="p-4 bg-white border border-neutral-200 hover:border-[#bfa054] rounded-xl flex items-center gap-4 cursor-pointer transition-colors shadow-xs"
                  >
                    <img
                      src={resolveImageUrl(prod.imageUrl)}
                      alt=""
                      onError={handleImageError}
                      className="w-16 h-16 object-contain bg-neutral-50 rounded"
                    />
                    <div>
                      <h4 className="font-serif-luxury text-sm font-semibold text-neutral-900 line-clamp-1">{prod.title}</h4>
                      <p className="font-mono-num text-xs font-bold text-neutral-900 mt-1">{formatPrice(auc.currentPrice)}</p>
                      <p className="text-[10px] text-neutral-500">{auc.totalBids} bids</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
