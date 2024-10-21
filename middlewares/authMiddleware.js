// authMiddleware.js
import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJpbG1pYnVuamFrdUBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1Mjk5OTUsImV4cCI6MTcyOTYxNjM5NX0.xXVZqpYq-S5__siyHZWXCXgnYXYJSnS8baL1watGl0M


  if (!token)
    return res.status(401).json({ error: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

export default authenticateToken;
