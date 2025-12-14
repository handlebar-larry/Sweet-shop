const jwt = require("jsonwebtoken");

const extractTokenFromRequest = (req) => {
  // primary: cookie (browser)
  if (req.cookies?.uid) return req.cookies.uid;

  // optional: Authorization: Bearer <token>
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return undefined;
};

const UserAuth = (req, res, next) => {
  try {
    const token = extractTokenFromRequest(req);

    if (!token) {
      return res.status(400).json({ message: "Access denied. No token provided." });
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedPayload;

    return next();
  } catch (err) {
    return res.status(500).json({ message: "Invalid or expired token." });
  }
};

const AdminAuth = (req, res, next) => {
  try {
    const token = extractTokenFromRequest(req);

    if (!token) {
      return res.status(400).json({ message: "Access denied. No token provided." });
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedPayload.isAdmin) {
      return res.status(400).json({ message: "Admin not authorised!" });
    }

    req.user = decodedPayload;
    return next();
  } catch (err) {
    return res.status(500).json({ message: "Invalid or expired token." });
  }
};

module.exports = { AdminAuth, UserAuth };
