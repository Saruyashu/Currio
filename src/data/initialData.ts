export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'GUEST' | 'USER' | 'ADMIN';
  rating: number;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface Product {
  id: number;
  sellerId: number;
  categoryId: number;
  title: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  condition: 'MINT' | 'NEAR_MINT' | 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR';
  location: string;
  tags: string[];
  imageUrl: string;
  galleryUrls: string[];
  status: 'ACTIVE' | 'SOLD' | 'REMOVED';
}

export interface Bid {
  id: number;
  auctionId: number;
  bidderId: number;
  bidderUsername: string;
  amount: number;
  timestamp: string;
}

export interface Auction {
  id: number;
  productId: number;
  sellerId: number;
  startingPrice: number;
  reservePrice: number;
  currentPrice: number;
  bidIncrement: number;
  buyNowPrice?: number;
  startTime: string;
  endTime: string;
  currentWinnerId?: number;
  totalBids: number;
  status: 'ACTIVE' | 'SOLD' | 'UNSOLD' | 'CANCELLED';
}

export interface Order {
  id: number;
  orderNumber: string;
  buyerId: number;
  sellerId: number;
  productId: number;
  auctionId?: number;
  amount: number;
  platformFee: number;
  sellerAmount: number;
  shippingFee: number;
  paymentMethod: string;
  paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED';
  orderStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  shippingAddress: string;
  trackingNumber: string;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  userId: number;
  type: 'OUTBID' | 'HIGHEST_BIDDER' | 'AUCTION_WON' | 'ORDER_CREATED' | 'LISTING_APPROVED';
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
}

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: 'admin_curio',
    email: 'admin@curio.art',
    firstName: 'Alistair',
    lastName: 'Vance',
    role: 'ADMIN',
    rating: 5.0,
    status: 'ACTIVE',
  },
  {
    id: 2,
    username: 'sarvesh_collector',
    email: 'sarvesh@curio.art',
    firstName: 'Sarvesh',
    lastName: 'Sawant',
    role: 'USER',
    rating: 4.95,
    status: 'ACTIVE',
  },
  {
    id: 3,
    username: 'geneva_horology',
    email: 'geneva@swisswatches.com',
    firstName: 'Henri',
    lastName: 'Dumond',
    role: 'USER',
    rating: 4.98,
    status: 'ACTIVE',
  },
  {
    id: 4,
    username: 'card_connoisseur',
    email: 'marcus@cardvault.io',
    firstName: 'Marcus',
    lastName: 'Sterling',
    role: 'USER',
    rating: 4.90,
    status: 'ACTIVE',
  },
  {
    id: 5,
    username: 'athens_antiquities',
    email: 'eleni@athenscoins.gr',
    firstName: 'Eleni',
    lastName: 'Papadopoulos',
    role: 'USER',
    rating: 4.97,
    status: 'ACTIVE',
  },
  {
    id: 6,
    username: 'brian_bidder',
    email: 'brian@investor.com',
    firstName: 'Brian',
    lastName: "O'Connor",
    role: 'USER',
    rating: 4.85,
    status: 'ACTIVE',
  },
];

export const CATEGORIES = [
  { id: 1, name: 'Fine Horology & Watches', slug: 'watches', count: 24 },
  { id: 2, name: 'Trading Cards & TCG', slug: 'trading-cards', count: 18 },
  { id: 3, name: 'Ancient Coins & Numismatics', slug: 'coins', count: 32 },
  { id: 4, name: 'Vintage Optics & Cameras', slug: 'cameras', count: 14 },
  { id: 5, name: 'Sports Memorabilia', slug: 'sports-memorabilia', count: 19 },
  { id: 6, name: 'Historical Manuscripts & Art', slug: 'historical-art', count: 11 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    sellerId: 3,
    categoryId: 1,
    title: '1968 Rolex Submariner Ref. 5513 "Meters First"',
    description: 'Exceptional condition vintage Rolex Submariner Reference 5513 featuring the celebrated "Meters First" matte dial. Pristine domed acrylic crystal, perfectly aged pumpkin tritium plots, original folded-link Oyster 9315 bracelet. Movement serviced by Geneva specialist in 2024. Complete with archive extract.',
    brand: 'Rolex',
    model: 'Submariner 5513',
    year: 1968,
    condition: 'EXCELLENT',
    location: 'Geneva, Switzerland',
    tags: ['rolex', 'submariner', 'meters-first', 'vintage', 'horology'],
    imageUrl: '/images/curio_item_rolex_1791467020069.jpg',
    galleryUrls: [
      '/images/curio_item_rolex_1791467020069.jpg',
      '/images/curio_hero_banner_1791467008185.jpg',
    ],
    status: 'ACTIVE',
  },
  {
    id: 7,
    sellerId: 3,
    categoryId: 4,
    title: 'Antique Brass Telescope',
    description: '19th century marine refractor telescope crafted in solid burnished brass, mounted on an adjustable solid mahogany tripod stand with brass chain spreader. Pristine coated achromatic objective lens.',
    brand: 'Dolland London',
    model: 'Marine Astronomical 3-Inch',
    year: 1885,
    condition: 'EXCELLENT',
    location: 'London, UK',
    tags: ['telescope', 'brass', 'antique', 'astronomy', 'vintage'],
    imageUrl: '/images/curio_brass_telescope_1791470097374.jpg',
    galleryUrls: ['/images/curio_brass_telescope_1791470097374.jpg'],
    status: 'ACTIVE',
  },
  {
    id: 8,
    sellerId: 4,
    categoryId: 6,
    title: 'Vintage Film Script',
    description: 'Original production typed screenplay manuscript "Dangerous Shadows" on aged deckled cream bond paper with period brass brad ring bindings. Annotated production notes and scene revisions.',
    brand: 'Studio Archive',
    model: 'Production Draft Revised',
    year: 1952,
    condition: 'VERY_GOOD',
    location: 'Los Angeles, USA',
    tags: ['film', 'script', 'cinema', 'hollywood', 'manuscript'],
    imageUrl: '/images/curio_vintage_script_1791470109374.jpg',
    galleryUrls: ['/images/curio_vintage_script_1791470109374.jpg'],
    status: 'ACTIVE',
  },
  {
    id: 9,
    sellerId: 4,
    categoryId: 6,
    title: 'Signed Concert Poster',
    description: 'Rare 1978 original exhibition and concert lithograph poster by artist K. Chen on unbleached raw linen fabric with artist graphite signature. Abstract brushwork calligraphy.',
    brand: 'Galerie Du Monde',
    model: 'Exposition Abstracts 1978',
    year: 1978,
    condition: 'MINT',
    location: 'Paris, France',
    tags: ['poster', 'art', 'signed', 'concert', 'lithograph'],
    imageUrl: '/images/curio_signed_poster_1791470122498.jpg',
    galleryUrls: ['/images/curio_signed_poster_1791470122498.jpg'],
    status: 'ACTIVE',
  },
  {
    id: 10,
    sellerId: 5,
    categoryId: 3,
    title: 'Commemorative Silver Dollar',
    description: 'High relief frosted proof commemorative silver dollar depicting allegorical bust of Liberty with torch and olive branch. Flawless mirror deep-cameo field struck by the US Mint.',
    brand: 'US Mint',
    model: 'One Dollar Proof Silver',
    year: 2024,
    condition: 'MINT',
    location: 'Philadelphia, USA',
    tags: ['coin', 'silver', 'dollar', 'liberty', 'proof', 'numismatics'],
    imageUrl: '/images/curio_silver_dollar_1791470137433.jpg',
    galleryUrls: ['/images/curio_silver_dollar_1791470137433.jpg'],
    status: 'ACTIVE',
  },
  {
    id: 2,
    sellerId: 4,
    categoryId: 2,
    title: '1999 Pokémon Base Set 1st Edition Charizard Holo #4/102 PSA Gem Mint 10',
    description: 'The holy grail of modern pop culture collectibles. 1999 Wizards of the Coast Base Set 1st Edition Shadowless Charizard holographic card graded a flawless PSA Gem Mint 10. Crystal clear centering, spotless holographic foil field, razor-sharp 55-pt corners.',
    brand: 'Wizards of the Coast',
    model: 'Base Set 1st Edition #4',
    year: 1999,
    condition: 'MINT',
    location: 'New York, USA',
    tags: ['pokemon', 'charizard', 'psa10', '1st-edition', 'tcg', 'grail'],
    imageUrl: '/images/curio_item_charizard_1791467039645.jpg',
    galleryUrls: [
      '/images/curio_item_charizard_1791467039645.jpg',
      '/images/curio_hero_banner_1791467008185.jpg',
    ],
    status: 'ACTIVE',
  },
  {
    id: 3,
    sellerId: 5,
    categoryId: 3,
    title: 'Athens Attica Silver Owl Tetradrachm (c. 454–404 BC)',
    description: 'Classical Greek archaic silver Tetradrachm minted during the golden age of Pericles in Athens. Obverse exhibits helmeted head of Athena with crest; reverse features the iconic sacred Owl of Athena standing right with olive sprig, crescent moon, and crisp "AΘE" ethnic inscription. High-relief strike on full flan.',
    brand: 'Classical Athens',
    model: 'Silver Tetradrachm',
    year: -440,
    condition: 'VERY_GOOD',
    location: 'Athens, Greece',
    tags: ['ancient', 'coin', 'owl', 'athens', 'greece', 'silver'],
    imageUrl: '/images/curio_item_coin_1791467051484.jpg',
    galleryUrls: [
      '/images/curio_item_coin_1791467051484.jpg',
      '/images/curio_hero_banner_1791467008185.jpg',
    ],
    status: 'ACTIVE',
  },
  {
    id: 4,
    sellerId: 3,
    categoryId: 4,
    title: '1957 Leica M3 Double-Stroke Rangefinder with 50mm Summicron f/2',
    description: 'Early double-stroke serial 881xxx Leica M3 rangefinder camera paired with rigid chrome collapsible Summicron 50mm f/2 lens. Vulcanite skin 100% intact with zero chipping. Rangefinder prism clean, contrasty, and calibrated. Includes original leather strap and Leitz metal cap.',
    brand: 'Leica',
    model: 'M3 Double Stroke',
    year: 1957,
    condition: 'EXCELLENT',
    location: 'Munich, Germany',
    tags: ['leica', 'm3', 'summicron', 'rangefinder', 'analog', 'vintage'],
    imageUrl: '/images/curio_item_camera_1791467068473.jpg',
    galleryUrls: [
      '/images/curio_item_camera_1791467068473.jpg',
      '/images/curio_hero_banner_1791467008185.jpg',
    ],
    status: 'ACTIVE',
  },
  {
    id: 5,
    sellerId: 4,
    categoryId: 5,
    title: '1986 Fleer Michael Jordan #57 Rookie Card BGS 9.5 Gem Mint',
    description: 'Iconic basketball rookie card of Michael Jordan from the 1986-87 Fleer premier set. Graded BGS 9.5 Gem Mint with subgrades: Centering 9.5, Edges 9.5, Corners 9.0, Surface 10. True centerpiece for basketball historians.',
    brand: 'Fleer',
    model: 'Premier #57',
    year: 1986,
    condition: 'MINT',
    location: 'Chicago, USA',
    tags: ['jordan', 'nba', 'fleer', 'rookie', 'bgs', 'basketball'],
    imageUrl: '/images/curio_item_charizard_1791467039645.jpg',
    galleryUrls: [
      '/images/curio_item_charizard_1791467039645.jpg',
    ],
    status: 'ACTIVE',
  },
  {
    id: 6,
    sellerId: 5,
    categoryId: 3,
    title: '1794 Flowing Hair Silver Dollar - NGC Fine Details',
    description: 'First dollar coin issued by the United States Federal Government. Flowing Hair design engraved by Robert Scot. Distinctive Liberty head with cascading locks, eagle with wreath on reverse. Extremely rare surviving national treasure.',
    brand: 'US Mint',
    model: 'Flowing Hair Dollar',
    year: 1794,
    condition: 'GOOD',
    location: 'Philadelphia, USA',
    tags: ['us-mint', '1794', 'dollar', 'flowing-hair', 'silver', 'rare'],
    imageUrl: '/images/curio_item_coin_1791467051484.jpg',
    galleryUrls: [
      '/images/curio_item_coin_1791467051484.jpg',
    ],
    status: 'ACTIVE',
  },
];

// Calculate future end times based on now
const nowMs = Date.now();
export const INITIAL_AUCTIONS: Auction[] = [
  {
    id: 1,
    productId: 1,
    sellerId: 3,
    startingPrice: 8500,
    reservePrice: 12000,
    currentPrice: 14250,
    bidIncrement: 250,
    buyNowPrice: 18500,
    startTime: new Date(nowMs - 86400000 * 2).toISOString(),
    endTime: new Date(nowMs + 1000 * 60 * 60 * 2.8).toISOString(), // ~2.8 hours left
    currentWinnerId: 2,
    totalBids: 9,
    status: 'ACTIVE',
  },
  {
    id: 7,
    productId: 7,
    sellerId: 3,
    startingPrice: 500,
    reservePrice: 600,
    currentPrice: 640,
    bidIncrement: 20,
    buyNowPrice: 850,
    startTime: new Date(nowMs - 86400000 * 2).toISOString(),
    endTime: new Date(nowMs + 1000 * 60 * 60 * 5.2).toISOString(),
    currentWinnerId: 2,
    totalBids: 7,
    status: 'ACTIVE',
  },
  {
    id: 8,
    productId: 8,
    sellerId: 4,
    startingPrice: 600,
    reservePrice: 700,
    currentPrice: 720,
    bidIncrement: 25,
    buyNowPrice: 950,
    startTime: new Date(nowMs - 86400000 * 3).toISOString(),
    endTime: new Date(nowMs + 1000 * 60 * 60 * 18.5).toISOString(),
    currentWinnerId: 6,
    totalBids: 5,
    status: 'ACTIVE',
  },
  {
    id: 9,
    productId: 9,
    sellerId: 4,
    startingPrice: 450,
    reservePrice: 550,
    currentPrice: 575,
    bidIncrement: 25,
    buyNowPrice: 750,
    startTime: new Date(nowMs - 86400000 * 1).toISOString(),
    endTime: new Date(nowMs + 1000 * 60 * 60 * 9.5).toISOString(),
    currentWinnerId: 2,
    totalBids: 4,
    status: 'ACTIVE',
  },
  {
    id: 10,
    productId: 10,
    sellerId: 5,
    startingPrice: 90,
    reservePrice: 100,
    currentPrice: 115,
    bidIncrement: 5,
    buyNowPrice: 160,
    startTime: new Date(nowMs - 86400000 * 4).toISOString(),
    endTime: new Date(nowMs + 1000 * 60 * 60 * 24).toISOString(),
    currentWinnerId: 6,
    totalBids: 8,
    status: 'ACTIVE',
  },
  {
    id: 2,
    productId: 2,
    sellerId: 4,
    startingPrice: 15000,
    reservePrice: 25000,
    currentPrice: 28500,
    bidIncrement: 500,
    buyNowPrice: 36000,
    startTime: new Date(nowMs - 86400000 * 4).toISOString(),
    endTime: new Date(nowMs + 1000 * 60 * 60 * 14.5).toISOString(), // ~14.5 hours left
    currentWinnerId: 6,
    totalBids: 14,
    status: 'ACTIVE',
  },
  {
    id: 3,
    productId: 3,
    sellerId: 5,
    startingPrice: 1200,
    reservePrice: 2000,
    currentPrice: 2400,
    bidIncrement: 100,
    buyNowPrice: 3200,
    startTime: new Date(nowMs - 86400000 * 1).toISOString(),
    endTime: new Date(nowMs + 1000 * 60 * 60 * 26).toISOString(), // ~26 hours left
    currentWinnerId: 2,
    totalBids: 6,
    status: 'ACTIVE',
  },
  {
    id: 4,
    productId: 4,
    sellerId: 3,
    startingPrice: 1800,
    reservePrice: 2200,
    currentPrice: 2650,
    bidIncrement: 50,
    buyNowPrice: 3100,
    startTime: new Date(nowMs - 86400000 * 3).toISOString(),
    endTime: new Date(nowMs + 1000 * 60 * 60 * 48).toISOString(), // ~48 hours left
    currentWinnerId: 6,
    totalBids: 8,
    status: 'ACTIVE',
  },
  {
    id: 5,
    productId: 5,
    sellerId: 4,
    startingPrice: 20000,
    reservePrice: 35000,
    currentPrice: 20000,
    bidIncrement: 1000,
    buyNowPrice: 48000,
    startTime: new Date(nowMs - 86400000 * 0.5).toISOString(),
    endTime: new Date(nowMs + 1000 * 60 * 60 * 72).toISOString(), // ~3 days left
    currentWinnerId: undefined,
    totalBids: 0,
    status: 'ACTIVE',
  },
  {
    id: 6,
    productId: 6,
    sellerId: 5,
    startingPrice: 45000,
    reservePrice: 60000,
    currentPrice: 52000,
    bidIncrement: 2000,
    buyNowPrice: undefined,
    startTime: new Date(nowMs - 86400000 * 5).toISOString(),
    endTime: new Date(nowMs + 1000 * 60 * 60 * 96).toISOString(),
    currentWinnerId: 2,
    totalBids: 4,
    status: 'ACTIVE',
  },
];

export const INITIAL_BIDS: Bid[] = [
  // Auction 1
  { id: 1, auctionId: 1, bidderId: 6, bidderUsername: 'brian_bidder', amount: 8500, timestamp: '2 days ago' },
  { id: 2, auctionId: 1, bidderId: 2, bidderUsername: 'sarvesh_collector', amount: 9500, timestamp: '1 day ago' },
  { id: 3, auctionId: 1, bidderId: 6, bidderUsername: 'brian_bidder', amount: 11000, timestamp: '18 hours ago' },
  { id: 4, auctionId: 1, bidderId: 2, bidderUsername: 'sarvesh_collector', amount: 12500, timestamp: '10 hours ago' },
  { id: 5, auctionId: 1, bidderId: 6, bidderUsername: 'brian_bidder', amount: 13500, timestamp: '4 hours ago' },
  { id: 6, auctionId: 1, bidderId: 2, bidderUsername: 'sarvesh_collector', amount: 14250, timestamp: '45 mins ago' },

  // Auction 2
  { id: 7, auctionId: 2, bidderId: 2, bidderUsername: 'sarvesh_collector', amount: 15000, timestamp: '3 days ago' },
  { id: 8, auctionId: 2, bidderId: 6, bidderUsername: 'brian_bidder', amount: 20000, timestamp: '2 days ago' },
  { id: 9, auctionId: 2, bidderId: 2, bidderUsername: 'sarvesh_collector', amount: 25000, timestamp: '1 day ago' },
  { id: 10, auctionId: 2, bidderId: 6, bidderUsername: 'brian_bidder', amount: 28500, timestamp: '2 hours ago' },

  // Auction 3
  { id: 11, auctionId: 3, bidderId: 6, bidderUsername: 'brian_bidder', amount: 1200, timestamp: '20 hours ago' },
  { id: 12, auctionId: 3, bidderId: 2, bidderUsername: 'sarvesh_collector', amount: 1800, timestamp: '12 hours ago' },
  { id: 13, auctionId: 3, bidderId: 6, bidderUsername: 'brian_bidder', amount: 2100, timestamp: '6 hours ago' },
  { id: 14, auctionId: 3, bidderId: 2, bidderUsername: 'sarvesh_collector', amount: 2400, timestamp: '3 hours ago' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    orderNumber: 'CURIO-ORD-2026-9021',
    buyerId: 2,
    sellerId: 3,
    productId: 4,
    auctionId: 4,
    amount: 2650,
    platformFee: 132.5,
    sellerAmount: 2517.5,
    shippingFee: 45,
    paymentMethod: 'ESCROW_VAULT',
    paymentStatus: 'SUCCESS',
    orderStatus: 'DELIVERED',
    shippingAddress: '742 Evergreen Terrace, Springfield, IL 62704',
    trackingNumber: 'FEDEX-EX-99281726',
    createdAt: '2026-10-02T14:32:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    userId: 2,
    type: 'OUTBID',
    title: 'Outbid on 1999 Charizard PSA 10',
    message: 'Collector b***r placed a higher bid of $28,500. Place a counter-bid to lead.',
    timeAgo: '2h ago',
    isRead: false,
  },
  {
    id: 2,
    userId: 2,
    type: 'HIGHEST_BIDDER',
    title: 'Leading 1968 Rolex Submariner',
    message: 'Your bid of $14,250 is currently the highest. Auction ends in 2h 48m.',
    timeAgo: '45m ago',
    isRead: false,
  },
  {
    id: 3,
    userId: 2,
    type: 'ORDER_CREATED',
    title: 'Vault Delivery Confirmed: 1957 Leica M3',
    message: 'Insured high-security delivery arrived and was verified.',
    timeAgo: '5d ago',
    isRead: true,
  },
];
