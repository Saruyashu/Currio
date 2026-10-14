import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  Gavel, 
  Trophy, 
  Package, 
  Coins, 
  Heart, 
  ArrowUpRight, 
  CheckCircle,
  Truck
} from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAuction: (id: number) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  onSelectAuction,
}) => {
  const { currentUser, auctions, products, bids, orders, watchlist } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'overview' | 'bids' | 'auctions' | 'purchases' | 'sales' | 'watchlist'>('overview');

  if (!isOpen || !currentUser) return null;

  // Derive user specific items
  const userBids = bids.filter((b) => b.bidderId === currentUser.id);
  const userAuctions = auctions.filter((a) => a.sellerId === currentUser.id);
  const userPurchases = orders.filter((o) => o.buyerId === currentUser.id);
  const userSales = orders.filter((o) => o.sellerId === currentUser.id);

  // Won auctions
  const wonAuctions = auctions.filter((a) => a.status === 'SOLD' && a.currentWinnerId === currentUser.id);

  // Total sales revenue
  const totalSellerEarnings = userSales.reduce((acc, o) => acc + o.sellerAmount, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-[#11141c] border border-[#232938] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141822] border-b border-[#232938] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-sm">
              {currentUser.firstName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-display text-lg font-bold text-white">
                  Collector Portfolio: {currentUser.username}
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-neutral-800 text-amber-400 rounded">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Collector Reputation: <strong className="text-amber-400">{currentUser.rating} ★</strong> · Member since 2024
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#131620] border-b border-[#232938] flex items-center gap-4 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'overview' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'bids' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Active Bids ({userBids.length})
          </button>
          <button
            onClick={() => setActiveTab('auctions')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'auctions' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            My Listings ({userAuctions.length})
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'purchases' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Vault Purchases ({userPurchases.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'sales' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Sales & Payouts ({userSales.length})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'watchlist' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metrics cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#141822] border border-[#242b3a] rounded-xl">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
                    <Gavel className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bids Placed</span>
                  </div>
                  <p className="font-mono-num text-2xl font-bold text-white">{userBids.length}</p>
                </div>

                <div className="p-4 bg-[#141822] border border-[#242b3a] rounded-xl">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Won Lots</span>
                  </div>
                  <p className="font-mono-num text-2xl font-bold text-emerald-400">{wonAuctions.length}</p>
                </div>

                <div className="p-4 bg-[#141822] border border-[#242b3a] rounded-xl">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
                    <Package className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Active Listings</span>
                  </div>
                  <p className="font-mono-num text-2xl font-bold text-white">{userAuctions.length}</p>
                </div>

                <div className="p-4 bg-[#141822] border border-[#242b3a] rounded-xl">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>Net Sales Earnings</span>
                  </div>
                  <p className="font-mono-num text-2xl font-bold text-amber-400">
                    ${totalSellerEarnings.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Recent Bids Table */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Recent Bidding Activity
                </h4>
                <div className="bg-[#141822] border border-[#242b3a] rounded-xl overflow-hidden divide-y divide-[#1e2330]">
                  {userBids.slice(0, 5).map((bid) => {
                    const auc = auctions.find((a) => a.id === bid.auctionId);
                    const prod = products.find((p) => p.id === auc?.productId);
                    const isWinning = auc?.currentWinnerId === currentUser.id;

                    return (
                      <div
                        key={bid.id}
                        onClick={() => auc && onSelectAuction(auc.id)}
                        className="p-4 flex items-center justify-between text-xs hover:bg-[#1a202d] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          {prod && (
                            <img
                              src={resolveImageUrl(prod.imageUrl)}
                              alt=""
                              onError={handleImageError}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-white">{prod?.title || 'Auction Lot'}</p>
                            <p className="text-[11px] text-neutral-400">
                              Current Lot Price: ${auc?.currentPrice.toLocaleString()} · Status: {auc?.status}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-mono-num font-bold text-amber-400">${bid.amount.toLocaleString()}</p>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              isWinning ? 'bg-emerald-950/60 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {isWinning ? 'Leading High Bid' : 'Outbid'}
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
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">All Bid History</h4>
              <div className="bg-[#141822] border border-[#242b3a] rounded-xl overflow-hidden divide-y divide-[#1e2330]">
                {userBids.length === 0 ? (
                  <p className="p-6 text-center text-xs text-neutral-500">No active bids placed yet.</p>
                ) : (
                  userBids.map((bid) => {
                    const auc = auctions.find((a) => a.id === bid.auctionId);
                    const prod = products.find((p) => p.id === auc?.productId);
                    return (
                      <div
                        key={bid.id}
                        onClick={() => auc && onSelectAuction(auc.id)}
                        className="p-4 flex items-center justify-between text-xs hover:bg-[#1a202d] cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold text-white">{prod?.title}</p>
                          <p className="text-neutral-400 text-[11px]">Placed {bid.timestamp}</p>
                        </div>
                        <div className="text-right font-mono-num">
                          <p className="font-bold text-amber-400 text-sm">${bid.amount.toLocaleString()}</p>
                          <p className="text-neutral-500 text-[11px]">Lot #{bid.auctionId}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Vault Purchases & Orders</h4>
              <div className="space-y-3">
                {userPurchases.length === 0 ? (
                  <p className="p-6 text-center text-xs text-neutral-500">No purchases completed yet.</p>
                ) : (
                  userPurchases.map((order) => {
                    const prod = products.find((p) => p.id === order.productId);
                    return (
                      <div key={order.id} className="p-5 bg-[#141822] border border-[#242b3a] rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-[#1e2330] pb-2 text-xs">
                          <div>
                            <span className="font-mono-num font-bold text-white">{order.orderNumber}</span>
                            <span className="text-neutral-500 ml-2">({new Date(order.createdAt).toLocaleDateString()})</span>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 rounded text-[10px] font-semibold">
                            {order.orderStatus}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            {prod && (
                              <img
                                src={resolveImageUrl(prod.imageUrl)}
                                alt=""
                                onError={handleImageError}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-white">{prod?.title}</p>
                              <p className="text-[11px] text-neutral-400">Armored Tracking: {order.trackingNumber}</p>
                              <p className="text-[11px] text-neutral-400">Shipped to: {order.shippingAddress}</p>
                            </div>
                          </div>

                          <div className="text-right font-mono-num">
                            <p className="font-bold text-amber-400 text-base">${order.amount.toLocaleString()}</p>
                            <p className="text-[10px] text-emerald-400">Payment Escrow: {order.paymentStatus}</p>
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
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Seller Payouts</h4>
              <div className="space-y-3">
                {userSales.length === 0 ? (
                  <p className="p-6 text-center text-xs text-neutral-500">No items sold yet. List a lot to start selling!</p>
                ) : (
                  userSales.map((sale) => (
                    <div key={sale.id} className="p-4 bg-[#141822] border border-[#242b3a] rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between font-semibold text-white">
                        <span>Order #{sale.orderNumber}</span>
                        <span className="text-emerald-400 font-mono-num font-bold">
                          +${sale.sellerAmount.toLocaleString()} Net Payout
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-400 text-[11px]">
                        <span>Gross Sale: ${sale.amount.toLocaleString()}</span>
                        <span>Platform Escrow Fee (5%): -${sale.platformFee.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Saved Lots</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {watchlist.map((aucId) => {
                  const auc = auctions.find((a) => a.id === aucId);
                  const prod = products.find((p) => p.id === auc?.productId);
                  if (!auc || !prod) return null;
                  return (
                    <div
                      key={auc.id}
                      onClick={() => onSelectAuction(auc.id)}
                      className="p-3 bg-[#141822] border border-[#242b3a] hover:border-amber-500/40 rounded-xl flex items-center gap-3 cursor-pointer"
                    >
                      <img
                        src={resolveImageUrl(prod.imageUrl)}
                        alt=""
                        onError={handleImageError}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-white truncate">{prod.title}</p>
                        <p className="font-mono-num text-xs text-amber-400 font-bold mt-0.5">
                          ${auc.currentPrice.toLocaleString()}
                        </p>
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
    </div>
  );
};
