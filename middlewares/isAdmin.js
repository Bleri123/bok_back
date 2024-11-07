export const isAdmin = (req, res, next) => {
    if(req.user.role_id === 1) {
        next();
    }
    else {
        res.status(403).json({error: "Access Denied, Admin Only"});
    }
}