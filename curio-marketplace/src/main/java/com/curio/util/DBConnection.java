package com.curio.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DBConnection {
    private static final Logger logger = LoggerFactory.getLogger(DBConnection.class);
    private static HikariDataSource dataSource;
    private static final Properties properties = new Properties();

    static {
        try {
            InputStream input = DBConnection.class.getClassLoader().getResourceAsStream("application.properties");
            if (input != null) {
                properties.load(input);
            }
            initDataSource();
        } catch (Exception e) {
            logger.warn("Could not initialize HikariDataSource with properties, will use dynamic connection fallback: {}", e.getMessage());
        }
    }

    private static void initDataSource() {
        try {
            String dbUrl = System.getenv("DB_URL");
            if (dbUrl == null || dbUrl.isBlank()) {
                dbUrl = properties.getProperty("db.url", "jdbc:mysql://localhost:3306/curio_marketplace?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true");
            }

            String dbUser = System.getenv("DB_USERNAME");
            if (dbUser == null || dbUser.isBlank()) {
                dbUser = properties.getProperty("db.username", "root");
            }

            String dbPass = System.getenv("DB_PASSWORD");
            if (dbPass == null) {
                dbPass = properties.getProperty("db.password", "password");
            }

            HikariConfig config = new HikariConfig();
            config.setDriverClassName(properties.getProperty("db.driver", "com.mysql.cj.jdbc.Driver"));
            config.setJdbcUrl(dbUrl);
            config.setUsername(dbUser);
            config.setPassword(dbPass);

            config.setMaximumPoolSize(Integer.parseInt(properties.getProperty("db.pool.maxSize", "20")));
            config.setMinimumIdle(Integer.parseInt(properties.getProperty("db.pool.minIdle", "5")));
            config.setIdleTimeout(Long.parseLong(properties.getProperty("db.pool.idleTimeout", "300000")));
            config.setConnectionTimeout(Long.parseLong(properties.getProperty("db.pool.connectionTimeout", "20000")));
            config.setMaxLifetime(Long.parseLong(properties.getProperty("db.pool.maxLifetime", "1200000")));

            config.addDataSourceProperty("cachePrepStmts", "true");
            config.addDataSourceProperty("prepStmtCacheSize", "250");
            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

            dataSource = new HikariDataSource(config);
            logger.info("HikariCP connection pool successfully established for CURIO Marketplace.");
        } catch (Exception e) {
            logger.error("HikariCP initialization failed: {}", e.getMessage());
        }
    }

    /**
     * Obtains an active connection from the pool, or creates a standalone connection fallback.
     */
    public static Connection getConnection() throws SQLException {
        if (dataSource != null && !dataSource.isClosed()) {
            return dataSource.getConnection();
        }

        // Direct fallback if pool isn't initialized
        String url = System.getenv("DB_URL");
        if (url == null || url.isBlank()) {
            url = properties.getProperty("db.url", "jdbc:mysql://localhost:3306/curio_marketplace?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true");
        }
        String user = System.getenv("DB_USERNAME");
        if (user == null || user.isBlank()) {
            user = properties.getProperty("db.username", "root");
        }
        String pass = System.getenv("DB_PASSWORD");
        if (pass == null) {
            pass = properties.getProperty("db.password", "password");
        }

        try {
            Class.forName(properties.getProperty("db.driver", "com.mysql.cj.jdbc.Driver"));
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL JDBC Driver not found", e);
        }

        return DriverManager.getConnection(url, user, pass);
    }

    public static void closePool() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
            logger.info("HikariCP pool shut down.");
        }
    }
}
