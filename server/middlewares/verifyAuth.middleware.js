import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET_KEY

export const authVerification = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization']
    
    
    if (!authHeader) {
        return res.status(401).json({ message: "Token is requierd" })
    }
    
    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Token is requierd" })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });

        // Type guard to ensure decoded is JwtPayload
        if (typeof decoded === 'object' && decoded !== null) {
            req.user = decoded;
            next();
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    })
}