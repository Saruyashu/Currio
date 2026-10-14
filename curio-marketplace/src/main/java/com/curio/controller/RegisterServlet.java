package com.curio.controller;

import com.curio.model.User;
import com.curio.service.UserService;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet(urlPatterns = {"/register", "/api/auth/register"})
public class RegisterServlet extends HttpServlet {
    private final UserService userService = new UserService();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        Map<String, Object> result = new HashMap<>();

        String username = req.getParameter("username");
        String email = req.getParameter("email");
        String password = req.getParameter("password");
        String firstName = req.getParameter("firstName");
        String lastName = req.getParameter("lastName");
        String phone = req.getParameter("phone");

        try {
            User user = userService.register(username, email, password, firstName, lastName, phone);
            HttpSession session = req.getSession(true);
            session.setAttribute("currentUser", user);

            result.put("success", true);
            result.put("message", "Registration successful. Welcome to CURIO.");
            result.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole()
            ));
            resp.setStatus(HttpServletResponse.SC_CREATED);
        } catch (IllegalArgumentException e) {
            result.put("success", false);
            result.put("message", e.getMessage());
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Server error during registration: " + e.getMessage());
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

        resp.getWriter().write(gson.toJson(result));
    }
}
