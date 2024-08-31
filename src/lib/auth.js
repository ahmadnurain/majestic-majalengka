// lib/auth.js
import jwt from "jsonwebtoken";
import cookie from "cookie";

// Middleware untuk memverifikasi token yang disimpan di cookie
export const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const parsedCookies = cookie.parse(cookies || "");
  const token = parsedCookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "your-very-strong-secret-key-1234567890");
    req.user = {
      id: decoded.id,
      role: decoded.role,
      name: decoded.name, // Pastikan nama pengguna juga disimpan dalam token
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware untuk memverifikasi apakah user adalah admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access only" });
  }
  next();
};
