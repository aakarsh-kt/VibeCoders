import type { Request,Response,NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
const JWT_SECRET=process.env.JWT_SECRET!;
export const userMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    if (req.method === "DELETE") 
    {
        return next();}
    const header=req.headers["authorization"] as string;
    
    try{
        const response=jwt.verify(header,JWT_SECRET) as JwtPayload;
        req.userId=response.id;
        next();
    }
     catch(e){
        res.status(403).json({
            message:"You are not logged in"
        })
    }
}