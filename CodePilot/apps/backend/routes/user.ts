import { Router } from "express";
import { userMiddleware } from "../middleware/userMiddleware";
import client from "db/client";
import { addFriendsSchema, changeRoleSchema, deleteFriendsSchema, updateMetadataSchema } from "../types/index.ts";
export const userRouter = Router();

userRouter.get("/metadata",userMiddleware, async(req , res)=>{
    const userId=req.userId;
    if(!userId){
        res.status(403).json({
            message:"Unauthorized"
        })
    }
    try{
        const user=await client.user.findFirst({
            where:{
                id:userId
            }
        })
        if(!user){
            res.status(403).json({
                message:"No user found"
            })
        }
        return res.status(200).json({
            username:user?.username
        })
    }
    catch(e){
        return res.status(403).json({
            message:e
        })
    }
})
userRouter.post("/metadata",userMiddleware, async(req , res)=>{
    const userId=req.userId;
    
    if(!userId){
        res.status(403).json({
            message:"Unauthorized"
        })
    }
    const {success,data}=updateMetadataSchema.safeParse(req.body);
     if (!success) {
        return res.status(403).json({
            message: "Invalid Inputs"
        })
    }
    try{
        const user=await client.user.update({
            where:{
                id:userId
            },
            data:{
                username:data.username
            }
        })
        if(!user){
            return res.status(403).json({
                message:"Username is not unique"
            })
        }
        return res.status(200).json({
            username:data.username 
        })
    }
    catch(e){
        return res.status(403).json({
            message:e
        })
    }
})
userRouter.post("/changeRole", userMiddleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const { success, data } = changeRoleSchema.safeParse(req.body);
    if (!success) {
        return res.status(403).json({
            message: "Invalid Inputs"
        })
    }
    try {
        // Requester must be an OWNER member of the space.
        const requesterMembership = await client.codeSpaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId: data.spaceId
                }
            },
            select: {
                role: true,
            }
        })

        if (!requesterMembership) {
            return res.status(403).json({
                message: "You are not a member of this space"
            })
        }

        if (requesterMembership.role !== "OWNER") {
            return res.status(403).json({
                message: "Only OWNER can change roles"
            })
        }

        // Target must already be a member.
        const targetMembership = await client.codeSpaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId: data.userId,
                    spaceId: data.spaceId
                }
            },
            select: {
                role: true,
            }
        })

        if (!targetMembership) {
            return res.status(404).json({
                message: "Target user is not a member of this space"
            })
        }

        // Prevent leaving space without an OWNER.
        if (targetMembership.role === "OWNER" && data.role !== "OWNER") {
            const ownerCount = await client.codeSpaceMember.count({
                where: {
                    spaceId: data.spaceId,
                    role: "OWNER"
                }
            })
            if (ownerCount <= 1) {
                return res.status(400).json({
                    message: "Space must have at least one OWNER"
                })
            }
        }

        const updated = await client.codeSpaceMember.update({
            where: {
                userId_spaceId: {
                    userId: data.userId,
                    spaceId: data.spaceId
                }
            },
            data: {
                role: data.role
            }
        })

        return res.status(200).json({
            member: updated
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Failed to change role"
        })
    }
})
userRouter.get("/friends",userMiddleware,async (req ,res)=>{
   const userId = req.userId;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try{
           const friends=await client.friendship.findMany({
            where:{
                requesterId:userId
            }
           })
           if(!friends){
            return res.status(403).json({
                message:"NO friends found"
            })
           }
           return res.json({
            friends
           })
    }catch(e){
        res.status(403).json({
            message:e
        })
    }
})
userRouter.post("/friends",userMiddleware,async(req ,res)=>{
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const {success,data}=addFriendsSchema.safeParse(req.body);
     if (!success) {
        return res.status(403).json({
            message: "Invalid Inputs"
        })
    }
    try{
           const friends=await client.friendship.create({
            data: {
                requesterId: userId,
                addresseeId: data.userId,
            },
            });
            if(!friends){
                return res.status(411).json({
                    message:"No friends found"
                })
            }
            return res.json({friends})
    }catch(e){
        res.status(403).json({
            message:e
        })
    }
})
userRouter.post("/deletefriends",userMiddleware,async(req ,res)=>{
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized",
            request:req
        })
    }
    const {success,data}=deleteFriendsSchema.safeParse(req.body);
     if (!success) {
        return res.status(403).json({
            message: "Invalid Inputs"
        })
    }
    try{
           const friends=await client.friendship.delete({
            where: {
                requesterId_addresseeId: {
                    requesterId:userId,
                    addresseeId: data.userId,
                }
            },
            });
            if(!friends){
                return res.status(411).json({
                    message:"No friends found"
                })
            }
            return res.json({message:"Friend deleted"})
    }catch(e){
        res.status(403).json({
            message:e
        })
    }
})