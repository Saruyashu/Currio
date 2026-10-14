package com.curio.controller;

import com.curio.dao.AuctionDAO;
import com.curio.dao.OrderDAO;
import com.curio.dao.ProductDAO;
import com.curio.dao.UserDAO;
import com.curio.model.User;
import com.curio.util.DBConnection;
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
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

@WebServlet(urlPatterns = {"/admin", "/api/admin/metrics", "/api/admin/users", "/api/admin/auctions/cancel"})
public class AdminServlet extends HttpServlet {
    private final UserDAO userDAO = new UserDAO();
    private final OrderDAO orderDAO = new OrderDAO();
    private final ProductDAO productDAO = new ProductDAO();
    private final AuctionDAO auctionDAO = new AuctionDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("currentUser") : null;

        resp.setContentType("application/json");

        if (user == null || !"ADMIN".equalsIgnoreCase(user.getRole())) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write("{\"success\":false,\"message\":\"Admin privileges required\"}");
            return;
        }

        try {
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("totalUsers", userDAO.countTotalUsers());
            metrics.put("totalSalesVolume", orderDAO.getTotalSalesVolume());
            metrics.put("platformRevenue", orderDAO.getTotalPlatformRevenue());

            // Active auctions count
            try (Connection conn = DBConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement("SELECT COUNT(*) FROM auctions WHERE status = 'ACTIVE'");
                 ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    metrics.put("activeAuctions", rs.getInt(1));
                }
            }

            resp.getWriter().write(gson.toJson(metrics));
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

        if (user == null || !"ADMIN".equalsIgnoreCase(user.getRole())) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            responseMap.put("success", false);
            responseMap.put("message", "Admin privileges required.");
            resp.getWriter().write(gson.toJson(responseMap));
            return;
        }

        String action = req.getParameter("action");
        try {
            if ("suspend_user".equalsIgnoreCase(action)) {
                Long targetUserId = Long.parseLong(req.getParameter("userId"));
                userDAO.updateStatus(targetUserId, "SUSPENDED");
                responseMap.put("success", true);
                responseMap.put("message", "User " + targetUserId + " suspended.");
            } else if ("activate_user".equalsIgnoreCase(action)) {
                Long targetUserId = Long.parseLong(req.getParameter("userId"));
                userDAO.updateStatus(targetUserId, "ACTIVE");
                responseMap.put("success", true);
                responseMap.put("message", "User " + targetUserId + " activated.");
            } else if ("remove_listing".equalsIgnoreCase(action)) {
                Long productId = Long.parseLong(req.getParameter("productId"));
                productDAO.updateStatus(productId, "REMOVED");
                responseMap.put("success", true);
                responseMap.put("message", "Listing removed by administrator.");
            } else {
                responseMap.put("success", false);
                responseMap.put("message", "Unknown admin action.");
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            responseMap.put("success", false);
            responseMap.put("message", "Admin action error: " + e.getMessage());
        }

        resp.getWriter().write(gson.toJson(responseMap));
    }
}
