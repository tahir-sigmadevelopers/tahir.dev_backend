import jwt from 'jsonwebtoken'
import User from "../models/user.js"

export const isAuthenticated = async (req, res, next) => {
    try {
        // Check for Authorization header first (Bearer token)
        const authHeader = req.headers.authorization;
        let token = null;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            // Extract token from Bearer header
            token = authHeader.split(' ')[1];
            console.log('Token from Authorization header:', token);
        } 
        // Fallback to cookie for backward compatibility
        else if (req.headers.cookie) {
            let cookieFound = req.headers.cookie;
            console.log('Cookie found:', cookieFound);
            
            // Try to extract token from cookie
            if (cookieFound.includes('ghareebstar')) {
                // Handle different cookie formats
                if (cookieFound.includes('ghareebstar=')) {
                    token = cookieFound.split('ghareebstar=')[1]?.split(';')[0];
                } else if (cookieFound.includes('ghareebstar ')) {
                    token = cookieFound.split('ghareebstar ')[1]?.split(';')[0];
                }
                console.log('Token extracted from cookie:', token);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: `Authentication required. Please login.`
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        
        // Find user
        req.user = await User.findById(decoded._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: `User not found. Please login again.`
            });
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please login again.'
        });
    }
}

export const clearCookie = async (req, res, next) => {
    try {
        // No need to check for cookie, just clear user from request
        req.user = undefined;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "dhola") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }
    next();
}