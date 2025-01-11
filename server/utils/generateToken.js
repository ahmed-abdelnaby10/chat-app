import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config()

export default (payload)=>{
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '24h'})
    return token;
}