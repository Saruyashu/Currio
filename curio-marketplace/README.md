# CURIO — Premier Collectible Auction Marketplace

CURIO is an enterprise-grade auction-based collectible marketplace designed for rare horology, certified trading cards, ancient numismatics, vintage optics, sports memorabilia, and historical artifacts.

---

## 1. System Requirements & Architecture

- **Language / Runtime**: Java 17 LTS
- **Web Container / Servlet Engine**: Apache Tomcat 9.0+ / 10.1+ (Servlet 4.0 / 5.0)
- **Dependency & Build Management**: Apache Maven 3.8+
- **Relational Database**: MySQL 8.0+
- **Frontend**: HTML5, Modern CSS3 with Responsive Layouts, Vanilla JavaScript (ES6+), Real-time countdowns & REST Polling

### Architectural Layering
```
Web Browser / Frontend UI (HTML5 + CSS3 + Vanilla JS)
                    ↓
Tomcat Servlet Container (AuthenticationFilter, AdminFilter)
                    ↓
Controllers / Servlets (AuctionServlet, BidServlet, OrderServlet, etc.)
                    ↓
Service Layer (AuctionService, UserService, OrderService)
                    ↓
DAO Layer (PreparedStatements, Pessimistic Row Locking SELECT ... FOR UPDATE)
                    ↓
HikariCP High-Performance Connection Pool
                    ↓
MySQL 8.0 Database (curio_marketplace)
```

---

## 2. Database Setup & Initialization

1. Start your local MySQL server:
   ```bash
   mysql -u root -p
   ```

2. Execute the schema script:
   ```sql
   SOURCE database/schema.sql;
   ```

3. Seed the sample users, categories, products, active auctions, and bids:
   ```sql
   SOURCE database/seed.sql;
   ```

---

## 3. Environment Variables & Configuration

The application reads configuration from `src/main/resources/application.properties` with environment variable overrides:

| Variable | Default Value | Description |
|---|---|---|
| `DB_HOST` | `localhost` | MySQL database host |
| `DB_PORT` | `3306` | MySQL database port |
| `DB_NAME` | `curio_marketplace` | Database schema name |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | `password` | Database password |

---

## 4. Building and Running with Maven and Tomcat

### Build WAR Package:
```bash
mvn clean package
```
This produces `target/curio.war`.

### Deploy to Apache Tomcat:
1. Copy `target/curio.war` to your Tomcat `$CATALINA_HOME/webapps/` directory.
2. Start Tomcat:
   ```bash
   # On macOS/Linux:
   $CATALINA_HOME/bin/startup.sh

   # On Windows:
   %CATALINA_HOME%\bin\startup.bat
   ```
3. Open your browser at:
   `http://localhost:8080/curio/`

---

## 5. Default Development Accounts

All pre-seeded demo accounts have the default password: **`password123`**

| Role | Username | Email | Permissions / Notes |
|---|---|---|---|
| **Admin** | `admin_curio` | `admin@curio.art` | Full admin privileges, dispute moderation, listing removal |
| **Collector (Buyer/Seller)** | `sarvesh_collector` | `sarvesh@curio.art` | Active bidder & seller with portfolio items |
| **Vintage Watch Dealer** | `geneva_horology` | `geneva@swisswatches.com` | High-reputation Swiss collector |
| **Card Dealer** | `card_connoisseur` | `marcus@cardvault.io` | Graded TCG specialist |

---

## 6. Critical Features & Concurrency Guarantees

### Anti-Race-Condition Pessimistic Row Locking
Concurrent bids on the same auction execute within a single transactional boundary (`Connection.setAutoCommit(false)`). The auction row is locked using `SELECT ... FOR UPDATE` before bid increment validation. If two users submit simultaneous bids, the second transaction waits for the first to commit, re-evaluates the new price, and rolls back cleanly with a descriptive message if the bid is below the new minimum.

### Scheduled Auction Finalizer
`AuctionService` runs a scheduled background daemon (`ScheduledExecutorService`) every 30 seconds that queries:
```sql
SELECT * FROM auctions WHERE status = 'ACTIVE' AND end_time <= CURRENT_TIMESTAMP
```
For each concluded auction, it verifies whether the reserve price was met, sets the status to `SOLD` or `UNSOLD`, and automatically generates the corresponding order for the winning bidder with full platform fee deductions.
