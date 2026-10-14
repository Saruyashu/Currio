import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  Auction,
  Bid,
  Order,
  NotificationItem,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_AUCTIONS,
  INITIAL_BIDS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import { resolveImageUrl } from '../utils/imageHelper';

interface MarketplaceContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  auctions: Auction[];
  bids: Bid[];
  orders: Order[];
  notifications: NotificationItem[];
  watchlist: number[]; // auctionIds
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;
  formatPrice: (amount: number) => string;
  setCurrentUser: (user: User | null) => void;
  switchUserRole: (role: 'GUEST' | 'USER' | 'ADMIN') => void;
  placeBid: (auctionId: number, amount: number) => { success: boolean; message: string };
  buyNow: (auctionId: number, shippingAddress: string) => { success: boolean; message: string; order?: Order };
  createAuction: (productData: Omit<Product, 'id' | 'sellerId' | 'status'>, auctionData: {
    startingPrice: number;
    reservePrice?: number;
    bidIncrement: number;
    buyNowPrice?: number;
    durationDays: number;
  }) => { success: boolean; auctionId?: number; message: string };
  toggleWatchlist: (auctionId: number) => void;
  isWatchlisted: (auctionId: number) => boolean;
  simulateCompetitorBid: (auctionId: number) => { success: boolean; message: string };
  fastForwardEndAuction: (auctionId: number) => { success: boolean; message: string };
  adminSuspendUser: (userId: number) => void;
  adminActivateUser: (userId: number) => void;
  adminRemoveListing: (productId: number) => void;
  adminCancelAuction: (auctionId: number) => void;
  markNotificationAsRead: (id: number) => void;
  resetDatabase: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'curio_marketplace_';

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent or fallback to initial data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // default: sarvesh_collector (USER)
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'products');
    if (!saved) return INITIAL_PRODUCTS;
    try {
      const parsed: Product[] = JSON.parse(saved);
      return parsed.map((p) => {
        const initial = INITIAL_PRODUCTS.find((init) => init.id === p.id);
        if (initial) {
          return {
            ...p,
            imageUrl: resolveImageUrl(initial.imageUrl),
            galleryUrls: (initial.galleryUrls && initial.galleryUrls.length > 0
              ? initial.galleryUrls
              : [initial.imageUrl]
            ).map((url) => resolveImageUrl(url)),
          };
        }
        return {
          ...p,
          imageUrl: resolveImageUrl(p.imageUrl),
          galleryUrls: (p.galleryUrls && p.galleryUrls.length > 0 ? p.galleryUrls : [p.imageUrl]).map((url) =>
            resolveImageUrl(url)
          ),
        };
      });
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [auctions, setAuctions] = useState<Auction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'auctions');
    return saved ? JSON.parse(saved) : INITIAL_AUCTIONS;
  });

  const [bids, setBids] = useState<Bid[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'bids');
    return saved ? JSON.parse(saved) : INITIAL_BIDS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [watchlist, setWatchlist] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'watchlist');
    return saved ? JSON.parse(saved) : [1, 2, 4];
  });

  const [currency, setCurrency] = useState<'INR' | 'USD'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'currency');
    return (saved as 'INR' | 'USD') || 'INR'; // Default to INR to match user's screenshots!
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'currency', currency);
  }, [currency]);

  const formatPrice = (amount: number): string => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'auctions', JSON.stringify(auctions));
  }, [auctions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'bids', JSON.stringify(bids));
  }, [bids]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const switchUserRole = (role: 'GUEST' | 'USER' | 'ADMIN') => {
    if (role === 'GUEST') {
      setCurrentUser(null);
    } else if (role === 'ADMIN') {
      const admin = users.find((u) => u.role === 'ADMIN') || INITIAL_USERS[0];
      setCurrentUser(admin);
    } else {
      const regularUser = users.find((u) => u.username === 'sarvesh_collector') || INITIAL_USERS[1];
      setCurrentUser(regularUser);
    }
  };

  /**
   * Safe Bidding Logic mimicking transactional database locking
   */
  const placeBid = (auctionId: number, amount: number): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Authentication required. Please sign in to place a bid.' };
    }

    if (currentUser.status === 'SUSPENDED') {
      return { success: false, message: 'Your account is suspended. You cannot place bids.' };
    }

    const targetAuction = auctions.find((a) => a.id === auctionId);
    if (!targetAuction) {
      return { success: false, message: 'Auction lot not found.' };
    }

    if (targetAuction.status !== 'ACTIVE') {
      return { success: false, message: `Auction is not active (${targetAuction.status}).` };
    }

    if (new Date(targetAuction.endTime).getTime() <= Date.now()) {
      return { success: false, message: 'Auction time has expired.' };
    }

    if (currentUser.id === targetAuction.sellerId) {
      return { success: false, message: 'Sellers are strictly prohibited from bidding on their own listings.' };
    }

    const minRequired =
      targetAuction.totalBids === 0
        ? targetAuction.startingPrice
        : targetAuction.currentPrice + targetAuction.bidIncrement;

    if (amount < minRequired) {
      return {
        success: false,
        message: `Bid of $${amount.toLocaleString()} is below the minimum required bid of $${minRequired.toLocaleString()}.`,
      };
    }

    // Atomic update
    const previousWinnerId = targetAuction.currentWinnerId;
    const newBidId = Date.now();
    const newBid: Bid = {
      id: newBidId,
      auctionId,
      bidderId: currentUser.id,
      bidderUsername: currentUser.username,
      amount,
      timestamp: 'Just now',
    };

    setBids((prev) => [newBid, ...prev]);

    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auctionId
          ? {
              ...a,
              currentPrice: amount,
              currentWinnerId: currentUser.id,
              totalBids: a.totalBids + 1,
            }
          : a
      )
    );

    // Notify previous winner if outbid
    if (previousWinnerId && previousWinnerId !== currentUser.id) {
      const outbidNotif: NotificationItem = {
        id: Date.now() + 1,
        userId: previousWinnerId,
        type: 'OUTBID',
        title: 'You were outbid!',
        message: `A new bid of $${amount.toLocaleString()} was placed on Lot #${auctionId}.`,
        timeAgo: 'Just now',
        isRead: false,
      };
      setNotifications((prev) => [outbidNotif, ...prev]);
    }

    // Confirmation notification for bidder
    const leadingNotif: NotificationItem = {
      id: Date.now() + 2,
      userId: currentUser.id,
      type: 'HIGHEST_BIDDER',
      title: 'Highest Bid Confirmed',
      message: `Your bid of $${amount.toLocaleString()} is now leading Lot #${auctionId}.`,
      timeAgo: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [leadingNotif, ...prev]);

    return { success: true, message: `Bid of $${amount.toLocaleString()} placed successfully! You are the high bidder.` };
  };

  /**
   * Buy Now Immediate Purchase with Escrow Order Generation
   */
  const buyNow = (auctionId: number, shippingAddress: string): { success: boolean; message: string; order?: Order } => {
    if (!currentUser) {
      return { success: false, message: 'Please log in to purchase using Buy Now.' };
    }

    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction || auction.status !== 'ACTIVE' || !auction.buyNowPrice) {
      return { success: false, message: 'This item is not available for instant Buy Now.' };
    }

    if (currentUser.id === auction.sellerId) {
      return { success: false, message: 'You cannot buy your own item.' };
    }

    const price = auction.buyNowPrice;
    const platformFee = Math.round(price * 0.05 * 100) / 100;
    const sellerNet = Math.round((price - platformFee) * 100) / 100;

    const newOrder: Order = {
      id: Date.now(),
      orderNumber: `CURIO-BN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      buyerId: currentUser.id,
      sellerId: auction.sellerId,
      productId: auction.productId,
      auctionId: auction.id,
      amount: price,
      platformFee,
      sellerAmount: sellerNet,
      shippingFee: 35,
      paymentMethod: 'ESCROW_VAULT',
      paymentStatus: 'SUCCESS',
      orderStatus: 'PROCESSING',
      shippingAddress: shippingAddress || '742 Collector Way, Suite 100',
      trackingNumber: `CURIO-VAL-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Close auction
    setAuctions((prev) =>
      prev.map((a) => (a.id === auctionId ? { ...a, status: 'SOLD', currentPrice: price, currentWinnerId: currentUser.id } : a))
    );

    // Update product
    setProducts((prev) => prev.map((p) => (p.id === auction.productId ? { ...p, status: 'SOLD' } : p)));

    // Add Order
    setOrders((prev) => [newOrder, ...prev]);

    // Send notifications
    const buyerNotif: NotificationItem = {
      id: Date.now() + 1,
      userId: currentUser.id,
      type: 'ORDER_CREATED',
      title: 'Buy Now Confirmed: Order #' + newOrder.orderNumber,
      message: `Your purchase of $${price.toLocaleString()} is securely held in Escrow. Seller will ship via armored courier.`,
      timeAgo: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [buyerNotif, ...prev]);

    return { success: true, message: `Congratulations! Item purchased via Buy Now for $${price.toLocaleString()}.`, order: newOrder };
  };

  /**
   * Create New Listing and Auction
   */
  const createAuction = (
    productData: Omit<Product, 'id' | 'sellerId' | 'status'>,
    auctionData: {
      startingPrice: number;
      reservePrice?: number;
      bidIncrement: number;
      buyNowPrice?: number;
      durationDays: number;
    }
  ) => {
    if (!currentUser) {
      return { success: false, message: 'Must be logged in to create listing.' };
    }

    const newProductId = Date.now();
    const newProduct: Product = {
      ...productData,
      id: newProductId,
      sellerId: currentUser.id,
      status: 'ACTIVE',
    };

    const newAuctionId = Date.now() + 1;
    const now = Date.now();
    const end = now + auctionData.durationDays * 86400000;

    const newAuction: Auction = {
      id: newAuctionId,
      productId: newProductId,
      sellerId: currentUser.id,
      startingPrice: auctionData.startingPrice,
      reservePrice: auctionData.reservePrice || 0,
      currentPrice: auctionData.startingPrice,
      bidIncrement: auctionData.bidIncrement || 50,
      buyNowPrice: auctionData.buyNowPrice,
      startTime: new Date(now).toISOString(),
      endTime: new Date(end).toISOString(),
      totalBids: 0,
      status: 'ACTIVE',
    };

    setProducts((prev) => [newProduct, ...prev]);
    setAuctions((prev) => [newAuction, ...prev]);

    const notif: NotificationItem = {
      id: Date.now() + 3,
      userId: currentUser.id,
      type: 'LISTING_APPROVED',
      title: 'Auction Published',
      message: `Your listing "${newProduct.title}" is now active in the CURIO gallery.`,
      timeAgo: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, auctionId: newAuctionId, message: 'Auction listing successfully published!' };
  };

  /**
   * Simulate a Competitor Collector Outbidding
   */
  const simulateCompetitorBid = (auctionId: number): { success: boolean; message: string } => {
    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction || auction.status !== 'ACTIVE') {
      return { success: false, message: 'Auction is not active.' };
    }

    // Competitor accounts
    const competitors = users.filter((u) => u.id !== currentUser?.id && u.role === 'USER' && u.id !== auction.sellerId);
    const competitor = competitors[Math.floor(Math.random() * competitors.length)] || INITIAL_USERS[5];

    const current = auction.currentPrice;
    const inc = auction.bidIncrement;
    const newAmount = current + inc;

    const previousWinnerId = auction.currentWinnerId;

    const newBid: Bid = {
      id: Date.now(),
      auctionId,
      bidderId: competitor.id,
      bidderUsername: competitor.username,
      amount: newAmount,
      timestamp: 'Just now',
    };

    setBids((prev) => [newBid, ...prev]);
    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auctionId
          ? {
              ...a,
              currentPrice: newAmount,
              currentWinnerId: competitor.id,
              totalBids: a.totalBids + 1,
            }
          : a
      )
    );

    // If currentUser was previous high bidder, trigger outbid notification!
    if (previousWinnerId && currentUser && previousWinnerId === currentUser.id) {
      const outbidNotif: NotificationItem = {
        id: Date.now() + 1,
        userId: currentUser.id,
        type: 'OUTBID',
        title: 'You were outbid by a competitor!',
        message: `Collector ${competitor.username[0]}***${competitor.username.slice(-1)} placed a higher bid of $${newAmount.toLocaleString()} on Lot #${auction.id}.`,
        timeAgo: 'Just now',
        isRead: false,
      };
      setNotifications((prev) => [outbidNotif, ...prev]);
    }

    return {
      success: true,
      message: `Simulated bid placed by ${competitor.username}: $${newAmount.toLocaleString()}`,
    };
  };

  /**
   * Fast-Forward & Conclude Auction (Idempotent daemon test)
   */
  const fastForwardEndAuction = (auctionId: number): { success: boolean; message: string } => {
    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction || auction.status !== 'ACTIVE') {
      return { success: false, message: 'Auction is not active.' };
    }

    const hasBids = auction.totalBids > 0 && auction.currentWinnerId;
    const reserveMet = !auction.reservePrice || auction.currentPrice >= auction.reservePrice;

    if (hasBids && reserveMet && auction.currentWinnerId) {
      const winnerId = auction.currentWinnerId;
      const winner = users.find((u) => u.id === winnerId);
      const winnerName = winner ? winner.username : 'Collector';

      // Mark SOLD
      setAuctions((prev) =>
        prev.map((a) => (a.id === auctionId ? { ...a, status: 'SOLD', endTime: new Date().toISOString() } : a))
      );
      setProducts((prev) => prev.map((p) => (p.id === auction.productId ? { ...p, status: 'SOLD' } : p)));

      // Generate Order
      const amount = auction.currentPrice;
      const platformFee = Math.round(amount * 0.05 * 100) / 100;
      const sellerAmount = Math.round((amount - platformFee) * 100) / 100;

      const order: Order = {
        id: Date.now(),
        orderNumber: `CURIO-AUC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        buyerId: winnerId,
        sellerId: auction.sellerId,
        productId: auction.productId,
        auctionId: auction.id,
        amount,
        platformFee,
        sellerAmount,
        shippingFee: 45,
        paymentMethod: 'ESCROW_VAULT',
        paymentStatus: 'PENDING',
        orderStatus: 'PROCESSING',
        shippingAddress: 'Registered Collector Vault Address',
        trackingNumber: `CURIO-ARMORED-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [order, ...prev]);

      // Notification
      const wonNotif: NotificationItem = {
        id: Date.now() + 2,
        userId: winnerId,
        type: 'AUCTION_WON',
        title: 'You Won Lot #' + auction.id + '!',
        message: `Winning bid: $${amount.toLocaleString()}. Proceed to Escrow Vault checkout in your dashboard.`,
        timeAgo: 'Just now',
        isRead: false,
      };
      setNotifications((prev) => [wonNotif, ...prev]);

      return {
        success: true,
        message: `Auction concluded! Reserve met. Winner is ${winnerName} for $${amount.toLocaleString()}. Order created.`,
      };
    } else {
      // Unsold
      setAuctions((prev) =>
        prev.map((a) => (a.id === auctionId ? { ...a, status: 'UNSOLD', endTime: new Date().toISOString() } : a))
      );
      return {
        success: true,
        message: `Auction concluded as UNSOLD (Reserve of $${auction.reservePrice.toLocaleString()} was not reached).`,
      };
    }
  };

  const toggleWatchlist = (auctionId: number) => {
    setWatchlist((prev) =>
      prev.includes(auctionId) ? prev.filter((id) => id !== auctionId) : [...prev, auctionId]
    );
  };

  const isWatchlisted = (auctionId: number) => watchlist.includes(auctionId);

  const adminSuspendUser = (userId: number) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'SUSPENDED' } : u)));
  };

  const adminActivateUser = (userId: number) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'ACTIVE' } : u)));
  };

  const adminRemoveListing = (productId: number) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, status: 'REMOVED' } : p)));
    setAuctions((prev) => prev.map((a) => (a.productId === productId ? { ...a, status: 'CANCELLED' } : a)));
  };

  const adminCancelAuction = (auctionId: number) => {
    setAuctions((prev) => prev.map((a) => (a.id === auctionId ? { ...a, status: 'CANCELLED' } : a)));
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const resetDatabase = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[1]);
    setProducts(INITIAL_PRODUCTS);
    setAuctions(INITIAL_AUCTIONS);
    setBids(INITIAL_BIDS);
    setOrders(INITIAL_ORDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setWatchlist([1, 2, 4]);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentUser,
        users,
        products,
        auctions,
        bids,
        orders,
        notifications,
        watchlist,
        currency,
        setCurrency,
        formatPrice,
        setCurrentUser,
        switchUserRole,
        placeBid,
        buyNow,
        createAuction,
        toggleWatchlist,
        isWatchlisted,
        simulateCompetitorBid,
        fastForwardEndAuction,
        adminSuspendUser,
        adminActivateUser,
        adminRemoveListing,
        adminCancelAuction,
        markNotificationAsRead,
        resetDatabase,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
