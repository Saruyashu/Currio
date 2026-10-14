import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  ShieldAlert, 
  Users, 
  DollarSign, 
  Gavel, 
  AlertTriangle, 
  CheckCircle, 
  Ban, 
  Trash2,
  Lock
} from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    users,
    auctions,
    products,
    orders,
    adminSuspendUser,
    adminActivateUser,
    adminRemoveListing,
    adminCancelAuction,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'listings' | 'reports'>('metrics');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  if (!isOpen || currentUser?.role !== 'ADMIN') return null;

  // Platform Metrics
  const totalVolume = orders.reduce((acc, o) => acc + o.amount, 0);
  const totalRevenue = orders.reduce((acc, o) => acc + o.platformFee, 0);
  const activeAuctionsCount = auctions.filter((a) => a.status === 'ACTIVE').length;
  const soldAuctionsCount = auctions.filter((a) => a.status === 'SOLD').length;

  const triggerNotice = (msg: string) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-[#11141c] border border-[#232938] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#141822] border-b border-[#232938] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-white">
                CURIO Enterprise Admin Console
              </h3>
              <p className="text-xs text-neutral-400">
                Logged in as Super Administrator: <strong>{currentUser.username}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-6 bg-[#131620] border-b border-[#232938] flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'metrics' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Marketplace Analytics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'users' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'listings' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Lot Moderation ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'reports' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Provenance Disputes (2)
          </button>
        </div>

        {/* Notice alert */}
        {adminNotice && (
          <div className="mx-6 mt-4 p-3 bg-amber-950/40 border border-amber-800/40 rounded-lg text-xs text-amber-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            <span>{adminNotice}</span>
          </div>
        )}

        {/* Body Container */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#141822] border border-[#242b3a] rounded-xl">
                  <span className="text-[11px] text-neutral-400 block mb-1">Gross Marketplace Volume</span>
                  <p className="font-mono-num text-2xl font-bold text-amber-400">
                    ${totalVolume.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-[#141822] border border-[#242b3a] rounded-xl">
                  <span className="text-[11px] text-neutral-400 block mb-1">Platform Fee Revenue (5%)</span>
                  <p className="font-mono-num text-2xl font-bold text-emerald-400">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-[#141822] border border-[#242b3a] rounded-xl">
                  <span className="text-[11px] text-neutral-400 block mb-1">Active Bidding Sessions</span>
                  <p className="font-mono-num text-2xl font-bold text-white">{activeAuctionsCount}</p>
                </div>
                <div className="p-4 bg-[#141822] border border-[#242b3a] rounded-xl">
                  <span className="text-[11px] text-neutral-400 block mb-1">Settled Auctions (Sold)</span>
                  <p className="font-mono-num text-2xl font-bold text-white">{soldAuctionsCount}</p>
                </div>
              </div>

              {/* Transactions Log */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Recent Platform Escrow Settlements
                </h4>
                <div className="bg-[#141822] border border-[#242b3a] rounded-xl overflow-hidden divide-y divide-[#1e2330]">
                  {orders.map((o) => (
                    <div key={o.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-mono-num font-bold text-white">{o.orderNumber}</p>
                        <p className="text-neutral-400 text-[11px]">
                          Buyer #{o.buyerId} · Seller #{o.sellerId} · Escrow {o.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right font-mono-num">
                        <p className="font-bold text-amber-400">${o.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-emerald-400">CURIO Take: +${o.platformFee.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Manage Registered Collectors & Roles
              </h4>
              <div className="bg-[#141822] border border-[#242b3a] rounded-xl overflow-hidden divide-y divide-[#1e2330]">
                {users.map((u) => (
                  <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{u.username}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-neutral-800 text-neutral-300 rounded">
                          {u.role}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-950/60 text-emerald-400'
                              : 'bg-rose-950/60 text-rose-400'
                          }`}
                        >
                          {u.status}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-[11px] mt-0.5">
                        {u.firstName} {u.lastName} ({u.email}) · Rating: {u.rating} ★
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {u.role !== 'ADMIN' && (
                        u.status === 'ACTIVE' ? (
                          <button
                            onClick={() => {
                              adminSuspendUser(u.id);
                              triggerNotice(`User ${u.username} has been suspended.`);
                            }}
                            className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              adminActivateUser(u.id);
                              triggerNotice(`User ${u.username} has been re-activated.`);
                            }}
                            className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 rounded text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Re-activate</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Catalogue Listings Moderation
              </h4>
              <div className="bg-[#141822] border border-[#242b3a] rounded-xl overflow-hidden divide-y divide-[#1e2330]">
                {products.map((p) => {
                  const auc = auctions.find((a) => a.productId === p.id);
                  return (
                    <div key={p.id} className="p-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(p.imageUrl)}
                          alt=""
                          onError={handleImageError}
                          className="w-12 h-12 object-cover rounded bg-[#090b0e]"
                        />
                        <div>
                          <p className="font-semibold text-white">{p.title}</p>
                          <p className="text-neutral-400 text-[11px]">
                            Brand: {p.brand} · Condition: {p.condition} · Status: {p.status}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {auc && auc.status === 'ACTIVE' && (
                          <button
                            onClick={() => {
                              adminCancelAuction(auc.id);
                              triggerNotice(`Auction for "${p.title}" was cancelled.`);
                            }}
                            className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40 rounded text-xs cursor-pointer"
                          >
                            Cancel Auction
                          </button>
                        )}
                        {p.status === 'ACTIVE' && (
                          <button
                            onClick={() => {
                              adminRemoveListing(p.id);
                              triggerNotice(`Listing "${p.title}" removed from gallery.`);
                            }}
                            className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Reported Listings & Authentication Inquiries
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-[#141822] border border-[#242b3a] rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-white">Dispute #891: Bezel Authenticity Inquiry</span>
                      <p className="text-neutral-400 text-[11px] mt-0.5">
                        Reported on Lot #001 (1968 Rolex Submariner) by collector <code>brian_bidder</code>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-950/60 text-amber-300 border border-amber-800/40 rounded text-[10px]">
                      Under Inspection
                    </span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    "Requesting high-resolution macro inspection of the bezel pip insert to confirm tritium luminescence decay curve match."
                  </p>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => triggerNotice('Dispute #891 resolved: Archive certificate verified.')}
                      className="px-3 py-1 bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 rounded text-xs cursor-pointer"
                    >
                      Verify Provenance & Resolve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
