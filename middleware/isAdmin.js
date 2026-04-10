const isAdmin = (req, res, next) => {
    // req.user was already populated by the isLoggedIn middleware
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
};

export default isAdmin;
