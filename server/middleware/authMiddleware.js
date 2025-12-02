const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
            req.user = await prisma.user.findUnique({
                where:{ id: decoded.id },
                select:{
                    id: true,
                    username: true,
                    email: true,
                    codeforces_handle: true,
                    profilePicture: true,
                    googleId: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            if (!req.user){
                return res.status(401).json({ error: 'Not authorized, user not found' });
            }
            next();
        } catch (error){
            console.error(error);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};
module.exports = { protect };
