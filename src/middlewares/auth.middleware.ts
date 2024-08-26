import { NextFunction, Request, Response } from "express";
import db from '../database/prisma.connection';

async function authMiddleware(req: Request, res: Response, next: NextFunction){
    
    const authHeader = req.headers.authorization;

    if(authHeader){
        const user = await db.users.findFirst({
            where: {
                token: authHeader
            }
        });

        if(user){
            return next();
        }
    }
    return res.status(400).json({ success: false, msg: "User not logged."});
}

export default authMiddleware;