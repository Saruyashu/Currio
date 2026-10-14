package com.curio.controller;

import com.curio.dao.AuctionDAO;
import com.curio.dao.ProductDAO;
import com.curio.model.Auction;
import com.curio.model.Product;
import com.curio.model.User;
import com.curio.service.AuctionService;
import com.curio.util.DBConnection;
import com.curio.util.ValidationUtil;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(urlPatterns = {"/auctions", "/auction", "/api/auctions", "/api/auctions/*"})
public class AuctionServlet extends HttpServlet {
    private final AuctionService auctionService = new AuctionService();
    private final AuctionDAO auctionDAO = new AuctionDAO();
    private final ProductDAO productDAO = new ProductDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        String idParam = req.getParameter("id");

        resp.setContentType("application/json");

        try {
            if (pathInfo != null && pathInfo.length() > 1) {
                // e.g. /api/auctions/1
                Long id = Long.parseLong(pathInfo.substring(1));
                Auction a = auctionService.getAuctionById(id);
                if (a != null) {
                    resp.getWriter().write(gson.toJson(a));
                } else {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    resp.getWriter().write("{\"success\":false,\"message\":\"Auction not found\"}");
                }
                return;
            } else if (idParam != null) {
                Long id = Long.parseLong(idParam);
                Auction a = auctionService.getAuctionById(id);
                if (a != null) {
                    resp.getWriter().write(gson.toJson(a));
                } else {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    resp.getWriter().write("{\"success\":false,\"message\":\"Auction not found\"}");
                }
                return;
            }

            // Search query parameters
            String search = req.getParameter("search");
            String catStr = req.getParameter("category");
            Integer categoryId = (catStr != null && !catStr.isEmpty()) ? Integer.parseInt(catStr) : null;
            String condition = req.getParameter("condition");
            String minStr = req.getParameter("minPrice");
            BigDecimal minPrice = (minStr != null && !minStr.isEmpty()) ? new BigDecimal(minStr) : null;
            String maxStr = req.getParameter("maxPrice");
            BigDecimal maxPrice = (maxStr != null && !maxStr.isEmpty()) ? new BigDecimal(maxStr) : null;
            String sort = req.getParameter("sort");
            int page = req.getParameter("page") != null ? Math.max(1, Integer.parseInt(req.getParameter("page"))) : 1;
            int limit = req.getParameter("limit") != null ? Integer.parseInt(req.getParameter("limit")) : 20;

            List<Auction> list = auctionService.searchAuctions(search, categoryId, condition, minPrice, maxPrice, sort, page, limit);
            resp.getWriter().write(gson.toJson(list));

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"success\":false,\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("currentUser") : null;

        resp.setContentType("application/json");
        Map<String, Object> responseMap = new HashMap<>();

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            responseMap.put("success", false);
            responseMap.put("message", "Authentication required to publish auctions.");
            resp.getWriter().write(gson.toJson(responseMap));
            return;
        }

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            // 1. Create Product
            Product product = new Product();
            product.setSellerId(user.getId());
            product.setCategoryId(Integer.parseInt(req.getParameter("categoryId")));
            product.setTitle(ValidationUtil.sanitize(req.getParameter("title")));
            product.setDescription(ValidationUtil.sanitize(req.getParameter("description")));
            product.setBrand(ValidationUtil.sanitize(req.getParameter("brand")));
            product.setModel(ValidationUtil.sanitize(req.getParameter("model")));
            String yrStr = req.getParameter("year");
            if (yrStr != null && !yrStr.isEmpty()) product.setYear(Integer.parseInt(yrStr));
            product.setItemCondition(req.getParameter("itemCondition"));
            product.setLocation(ValidationUtil.sanitize(req.getParameter("location")));
            product.setTags(ValidationUtil.sanitize(req.getParameter("tags")));
            product.setStatus("ACTIVE");

            Long productId = productDAO.create(conn, product);

            // Product Images
            String imageUrl = req.getParameter("imageUrl");
            if (imageUrl == null || imageUrl.isEmpty()) {
                imageUrl = "/src/assets/images/curio_hero_banner_1791467008185.jpg";
            }
            productDAO.addImage(conn, productId, imageUrl, true, 1);

            // 2. Create Auction
            Auction auction = new Auction();
            auction.setProductId(productId);
            auction.setSellerId(user.getId());
            auction.setStartingPrice(new BigDecimal(req.getParameter("startingPrice")));
            String resStr = req.getParameter("reservePrice");
            auction.setReservePrice((resStr != null && !resStr.isEmpty()) ? new BigDecimal(resStr) : BigDecimal.ZERO);
            String incStr = req.getParameter("bidIncrement");
            auction.setBidIncrement((incStr != null && !incStr.isEmpty()) ? new BigDecimal(incStr) : new BigDecimal("50.00"));
            String buyNowStr = req.getParameter("buyNowPrice");
            if (buyNowStr != null && !buyNowStr.isEmpty()) {
                auction.setBuyNowPrice(new BigDecimal(buyNowStr));
            }

            int durationDays = req.getParameter("durationDays") != null ? Integer.parseInt(req.getParameter("durationDays")) : 7;
            Instant start = Instant.now();
            Instant end = start.plus(durationDays, ChronoUnit.DAYS);
            auction.setStartTime(Timestamp.from(start));
            auction.setEndTime(Timestamp.from(end));
            auction.setStatus("ACTIVE");

            Long auctionId = auctionDAO.create(conn, auction);

            conn.commit();

            responseMap.put("success", true);
            responseMap.put("message", "Auction successfully created!");
            responseMap.put("auctionId", auctionId);
            resp.setStatus(HttpServletResponse.SC_CREATED);

        } catch (Exception e) {
            if (conn != null) {
                try { conn.rollback(); } catch (Exception ignored) {}
            }
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            responseMap.put("success", false);
            responseMap.put("message", "Failed to create auction: " + e.getMessage());
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (Exception ignored) {}
            }
        }

        resp.getWriter().write(gson.toJson(responseMap));
    }
}
