const jwt = require('jsonwebtoken');

function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded.role || decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        req.admin = decoded; // Attach admin data
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

module.exports = authenticateAdmin;
