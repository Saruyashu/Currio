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

@WebServlet(urlPatterns = {"/login", "/api/auth/login"})
public class LoginServlet extends HttpServlet {
    private final UserService userService = new UserService();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        resp.setContentType("application/json");
        Map<String, Object> result = new HashMap<>();

        try {
            User user = userService.authenticate(username, password);
            if (user != null) {
                // Prevent session fixation
                HttpSession oldSession = req.getSession(false);
                if (oldSession != null) {
                    oldSession.invalidate();
                }
                HttpSession newSession = req.getSession(true);
                newSession.setAttribute("currentUser", user);

                result.put("success", true);
                result.put("message", "Authentication successful.");
                result.put("user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "firstName", user.getFirstName()
                ));
                resp.setStatus(HttpServletResponse.SC_OK);
            } else {
                result.put("success", false);
                result.put("message", "Invalid username or password.");
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Login error: " + e.getMessage());
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

        resp.getWriter().write(gson.toJson(result));
    }
}
