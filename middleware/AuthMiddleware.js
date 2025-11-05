import jwt from "jsonwebtoken"
import "dotenv/config"

export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    if(!token) return res.status(401),json({error: "No token provided"});

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return res.status(403).json({error: "Invalid Token"});

        req.user = decoded;
        next();
    })

}