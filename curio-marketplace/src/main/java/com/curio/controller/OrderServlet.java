package com.curio.controller;

import com.curio.dao.OrderDAO;
import com.curio.model.Order;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(urlPatterns = {"/orders", "/api/orders", "/api/buy-now"})
public class OrderServlet extends HttpServlet {
    private final OrderDAO orderDAO = new OrderDAO();
    private final AuctionService auctionService = new AuctionService();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("currentUser") : null;

        resp.setContentType("application/json");

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"success\":false,\"message\":\"Login required\"}");
            return;
        }

        try {
            String type = req.getParameter("type"); // "purchases" or "sales"
            List<Order> list;
            if ("sales".equalsIgnoreCase(type)) {
                list = orderDAO.findBySellerId(user.getId());
            } else {
                list = orderDAO.findByBuyerId(user.getId());
            }
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
        Map<String, Object> result = new HashMap<>();

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            result.put("success", false);
            result.put("message", "Login required to execute Buy Now.");
            resp.getWriter().write(gson.toJson(result));
            return;
        }

        try {
            Long auctionId = Long.parseLong(req.getParameter("auctionId"));
            String address = req.getParameter("shippingAddress");

            Order order = auctionService.buyNow(auctionId, user.getId(), address);
            if (order != null) {
                result.put("success", true);
                result.put("message", "Item purchased successfully via Buy Now!");
                result.put("order", order);
                resp.setStatus(HttpServletResponse.SC_OK);
            } else {
                result.put("success", false);
                result.put("message", "Could not complete Buy Now transaction. The item may be sold or invalid.");
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            result.put("success", false);
            result.put("message", "Purchase error: " + e.getMessage());
        }

        resp.getWriter().write(gson.toJson(result));
    }
}
