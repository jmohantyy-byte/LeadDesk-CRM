import jwt from "jsonwebtoken";

// Verify Logged In User
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user info
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

// Admin Only
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only Admin can access this route.",
    });
  }

  next();
};

// Member Only
export const memberOnly = (req, res, next) => {
  if (req.user.role !== "member") {
    return res.status(403).json({
      success: false,
      message: "Only Members can access this route.",
    });
  }

  next();
};