import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Authentication Middleware
 * Verifies the Bearer token in the Authorization header.
 * Attaches the decoded payload (id, role, email) to req.user for use in subsequent routes.
 */
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Attach user info to the request object so controllers can identify the user
    req.user = decoded;
    next();
  } catch (error) {
    console.log("authenticatin error ==>", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Authorization Middleware
 * Restricts access based on user roles.
 * @param {string|string[]} allowedRoles - A single role or an array of roles allowed to access the route.
 */
export const authorize = (allowedRoles) => (req, res, next) => {
  // Converts single string input into an array, which ensures logic works for both single or multiple roles
  const rolesArray = [allowedRoles].flat();

  if (!rolesArray.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied. Requires: ${rolesArray.join(" or ")}`,
    });
  }

  next();
};
