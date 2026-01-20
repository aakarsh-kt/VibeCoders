import {Router} from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import{signinSchema, signupSchema} from "../types/index.ts"
import client from "db/client";
import jwt from "jsonwebtoken";
const JWT_SECRET=process.env.JWT_SECRET!;
export const router=Router();
router.get("/",(req,res)=>{
    console.log("Hello");
    return res.json({
        message:"Hey there"
    })
})
router.post("/signup",async (req,res)=>{
    
    const {success,data}=signupSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message:"Invalid inputs"
        })
        return
    }
    try{
        
        const user=await client.user.create({
          data:{
            username:data.username,
            passwordHash:data.password
          }
        })
        if(!user){
            res.status(403).json({
                message:"Failed Sign Up"
            })
            return res;
        }
        return res.status(200).json({
            id:user.id
        })
        
    }
    catch(e){
        res.status(411).json({
            message:e
        })
        return res;
    }
})
router.post("/signin",async (req,res)=>{
    const {success,data}=signinSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message:"Invalid inputs"
        })
        return
    }
    try{
        
        const user=await client.user.findUnique({
            where:{
                username:data.username,
                passwordHash:data.password
            }
        })
         if (user && user.id != null) {
        const token = jwt.sign({
            id: user.id
        }, JWT_SECRET)
        return res.json({
            id: user.id,
            token
            })
         }
        if(!user){
            res.status(403).json({
                message:"Failed Sign In"
            })
            return res;
        }
       
        
    }
    catch(e){
        res.status(411).json({
            message:e
        })
        return res;
    }
})
router.use("/user",userRouter);
router.use("/space",spaceRouter);