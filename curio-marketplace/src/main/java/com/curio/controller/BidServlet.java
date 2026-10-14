package com.curio.controller;

import com.curio.dao.BidDAO;
import com.curio.model.Bid;
import com.curio.model.User;
import com.curio.service.AuctionService;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(urlPatterns = {"/bid", "/api/bid", "/api/auctions/bids"})
public class BidServlet extends HttpServlet {
    private final AuctionService auctionService = new AuctionService();
    private final BidDAO bidDAO = new BidDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String auctionIdStr = req.getParameter("auctionId");
        resp.setContentType("application/json");

        if (auctionIdStr == null || auctionIdStr.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"success\":false,\"message\":\"Missing auctionId parameter\"}");
            return;
        }

        try {
            Long auctionId = Long.parseLong(auctionIdStr);
            List<Bid> bids = bidDAO.getBidsByAuctionId(auctionId);
            // Mask bidder usernames for privacy
            for (Bid b : bids) {
                b.getMaskedUsername();
            }
            resp.getWriter().write(gson.toJson(bids));
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
        Map<String, Object> result = new HashMap<>();

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            result.put("success", false);
            result.put("message", "You must be logged in to place a bid.");
            resp.getWriter().write(gson.toJson(result));
            return;
        }

        try {
            Long auctionId = Long.parseLong(req.getParameter("auctionId"));
            BigDecimal amount = new BigDecimal(req.getParameter("amount"));

            AuctionService.BidResult bidResult = auctionService.placeBid(auctionId, user.getId(), amount);

            result.put("success", bidResult.isSuccess());
            result.put("message", bidResult.getMessage());
            if (bidResult.isSuccess()) {
                result.put("bid", bidResult.getBid());
                resp.setStatus(HttpServletResponse.SC_OK);
            } else {
                resp.setStatus(HttpServletResponse.SC_CONFLICT); // 409 conflict or validation failure
            }

        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            result.put("success", false);
            result.put("message", "Invalid numerical bid amount or auction ID.");
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            result.put("success", false);
            result.put("message", "Internal server error: " + e.getMessage());
        }

        resp.getWriter().write(gson.toJson(result));
    }
}
