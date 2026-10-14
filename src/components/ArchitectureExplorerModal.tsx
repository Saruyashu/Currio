import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Database, Server, ShieldCheck, Terminal } from 'lucide-react';

interface ArchitectureExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CodeSnippet {
  id: string;
  title: string;
  category: 'DATABASE' | 'SERVICE' | 'DAO' | 'CONTROLLER' | 'CONFIG';
  filename: string;
  language: string;
  code: string;
  description: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: 'auction-service',
    title: 'Anti-Race-Condition Bidding Engine',
    category: 'SERVICE',
    filename: 'com/curio/service/AuctionService.java',
    language: 'java',
    description: 'Implements pessimistic row locking (SELECT ... FOR UPDATE) and atomic database transactions to eliminate concurrent bid collisions.',
    code: `public synchronized BidResult placeBid(Long auctionId, Long bidderId, BigDecimal bidAmount) {
    Connection conn = null;
    try {
        conn = DBConnection.getConnection();
        conn.setAutoCommit(false); // 1. Begin Database Transaction

        // 2. CRITICAL: Acquire exclusive pessimistic row lock
        Auction auction = auctionDAO.findByIdForUpdate(conn, auctionId);
        if (auction == null || !"ACTIVE".equalsIgnoreCase(auction.getStatus())) {
            conn.rollback();
            return new BidResult(false, "Auction is not active", null);
        }

        // 3. Authoritative server-side timestamp validation
        Instant now = Instant.now();
        if (now.isAfter(auction.getEndTime().toInstant())) {
            conn.rollback();
            return new BidResult(false, "Auction has already closed", null);
        }

        // 4. Strict prevention of self-bidding
        if (bidderId.equals(auction.getSellerId())) {
            conn.rollback();
            return new BidResult(false, "Sellers cannot bid on their own items", null);
        }

        // 5. Minimum increment verification
        BigDecimal minRequired = auction.getTotalBids() == 0 
            ? auction.getStartingPrice() 
            : auction.getCurrentPrice().add(auction.getBidIncrement());

        if (bidAmount.compareTo(minRequired) < 0) {
            conn.rollback();
            return new BidResult(false, "Bid is below minimum required increment", null);
        }

        // 6. Insert immutable audit bid entry
        Bid bid = new Bid(null, auctionId, bidderId, bidAmount, Timestamp.from(now));
        bidDAO.insertBid(conn, bid);

        // 7. Update current auction leader and price
        auctionDAO.updateCurrentBid(conn, auctionId, bidAmount, bidderId);

        conn.commit(); // 8. Commit Transaction atomically
        return new BidResult(true, "Bid recorded successfully", bid);
    } catch (SQLException e) {
        if (conn != null) conn.rollback();
        return new BidResult(false, "Transaction aborted: " + e.getMessage(), null);
    }
}`,
  },
  {
    id: 'schema-sql',
    title: 'MySQL Normalized Relational Schema',
    category: 'DATABASE',
    filename: 'database/schema.sql',
    language: 'sql',
    description: 'Third-normal-form MySQL schema with foreign key constraints, decimal precision for currency, and indexes on auction status and end_time.',
    code: `CREATE DATABASE IF NOT EXISTS curio_marketplace 
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE curio_marketplace;

CREATE TABLE auctions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL UNIQUE,
    seller_id BIGINT NOT NULL,
    starting_price DECIMAL(12, 2) NOT NULL,
    reserve_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    current_price DECIMAL(12, 2) NOT NULL,
    bid_increment DECIMAL(10, 2) NOT NULL DEFAULT 50.00,
    buy_now_price DECIMAL(12, 2) DEFAULT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    current_winner_id BIGINT DEFAULT NULL,
    total_bids INT DEFAULT 0,
    status ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'ENDED', 'SOLD', 'UNSOLD', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_winner_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_auction_status (status),
    INDEX idx_auction_end_time (end_time),
    INDEX idx_auction_active_expiry (status, end_time)
) ENGINE=InnoDB;

CREATE TABLE bids (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auction_id BIGINT NOT NULL,
    bidder_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_bids_auction (auction_id, created_at DESC)
) ENGINE=InnoDB;`,
  },
  {
    id: 'auction-dao',
    title: 'AuctionDAO (PreparedStatements & SELECT FOR UPDATE)',
    category: 'DAO',
    filename: 'com/curio/dao/AuctionDAO.java',
    language: 'java',
    description: 'Low-level JDBC access utilizing HikariCP connection pooling, parameterized queries, and row-level locking.',
    code: `public class AuctionDAO {
    // Pessimistic write lock query:
    public Auction findByIdForUpdate(Connection conn, Long id) throws SQLException {
        String sql = "SELECT * FROM auctions WHERE id = ? FOR UPDATE";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        }
        return null;
    }

    public void updateCurrentBid(Connection conn, Long auctionId, BigDecimal newPrice, Long winnerId) throws SQLException {
        String sql = "UPDATE auctions SET current_price = ?, current_winner_id = ?, total_bids = total_bids + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setBigDecimal(1, newPrice);
            stmt.setLong(2, winnerId);
            stmt.setLong(3, auctionId);
            stmt.executeUpdate();
        }
    }
}`,
  },
  {
    id: 'pom-xml',
    title: 'Maven Dependency Configuration (pom.xml)',
    category: 'CONFIG',
    filename: 'curio-marketplace/pom.xml',
    language: 'xml',
    description: 'Maven configuration for Java 17, Servlet 4.0, HikariCP, MySQL Connector/J, BCrypt, and JUnit 5.',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.curio</groupId>
    <artifactId>curio-marketplace</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>
        <dependency>
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>5.1.0</version>
        </dependency>
        <dependency>
            <groupId>at.favre.lib</groupId>
            <artifactId>bcrypt</artifactId>
            <version>0.10.2</version>
        </dependency>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>
    </dependencies>
</project>`,
  },
  {
    id: 'scheduled-daemon',
    title: 'Automated Scheduled Auction Expiry Engine',
    category: 'SERVICE',
    filename: 'com/curio/service/AuctionService.java',
    language: 'java',
    description: 'Scheduled daemon process that queries expired active auctions, checks reserve prices, marks them SOLD or UNSOLD, and creates orders.',
    code: `public synchronized void processExpiredAuctions() {
    Connection conn = null;
    try {
        conn = DBConnection.getConnection();
        conn.setAutoCommit(false);

        List<Auction> expiredList = auctionDAO.findExpiredActiveAuctions(conn);
        for (Auction a : expiredList) {
            Auction locked = auctionDAO.findByIdForUpdate(conn, a.getId());
            if (locked == null || !"ACTIVE".equalsIgnoreCase(locked.getStatus())) continue;

            boolean reserveMet = locked.getReservePrice() == null || 
                                 locked.getCurrentPrice().compareTo(locked.getReservePrice()) >= 0;

            if (locked.getTotalBids() > 0 && reserveMet) {
                auctionDAO.updateStatusAndWinner(conn, locked.getId(), "SOLD", locked.getCurrentWinnerId());
                productDAO.updateStatus(locked.getProductId(), "SOLD");

                // Generate Order & Platform Fee deduction
                Order order = new Order();
                order.setOrderNumber("CURIO-WON-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                order.setBuyerId(locked.getCurrentWinnerId());
                order.setSellerId(locked.getSellerId());
                order.setAmount(locked.getCurrentPrice());
                order.setPlatformFee(locked.getCurrentPrice().multiply(new BigDecimal("0.05")));
                orderDAO.createOrder(conn, order);
            } else {
                auctionDAO.updateStatusAndWinner(conn, locked.getId(), "UNSOLD", null);
            }
        }
        conn.commit();
    } catch (SQLException e) {
        if (conn != null) conn.rollback();
    }
}`,
  },
];

export const ArchitectureExplorerModal: React.FC<ArchitectureExplorerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedSnippetId, setSelectedSnippetId] = useState(SNIPPETS[0].id);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentSnippet = SNIPPETS.find((s) => s.id === selectedSnippetId) || SNIPPETS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-[#10131a] border border-[#232938] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#141822] border-b border-[#232938] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-white">
                CURIO Java / Tomcat / MySQL Architecture Explorer
              </h3>
              <p className="text-xs text-neutral-400">
                Inspect the complete production Maven repository files, DAO layer, and transaction engines.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Layout: Sidebar + Code Window */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[75vh]">
          {/* Left Navigation */}
          <div className="md:col-span-4 bg-[#0d1016] border-r border-[#202534] p-4 space-y-2 overflow-y-auto">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-2 px-2">
              Architecture Modules
            </span>

            {SNIPPETS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSnippetId(item.id)}
                className={`w-full text-left p-3 rounded-lg text-xs transition-all cursor-pointer ${
                  selectedSnippetId === item.id
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                    : 'bg-[#131620] hover:bg-[#1a1f2c] border border-transparent text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold truncate">{item.title}</span>
                  <span className="text-[9px] px-1 py-0.2 bg-neutral-800 text-neutral-400 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 font-mono truncate">{item.filename}</p>
              </button>
            ))}

            <div className="pt-4 border-t border-[#1e2330] p-2 space-y-2 text-[11px] text-neutral-400">
              <p className="font-semibold text-neutral-200">Repository Structure:</p>
              <ul className="space-y-1 font-mono text-[10px] text-neutral-500">
                <li>/database/schema.sql</li>
                <li>/database/seed.sql</li>
                <li>/curio-marketplace/pom.xml</li>
                <li>/src/main/java/com/curio/...</li>
                <li>/src/main/resources/application.properties</li>
              </ul>
            </div>
          </div>

          {/* Right Code Viewer */}
          <div className="md:col-span-8 bg-[#11141c] flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="px-6 py-3 bg-[#151924] border-b border-[#222836] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-amber-300 font-semibold">
                  {currentSnippet.filename}
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">{currentSnippet.description}</p>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b212f] hover:bg-[#252c3e] border border-[#2b3447] rounded text-xs text-neutral-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Pre/Code Block */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#090b0e]">
              <pre className="font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto whitespace-pre">
                <code>{currentSnippet.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
