import { Router } from "express";
import client from "db/client"
import { addUserSchema, createSpaceSchema } from "../types/index";
import { userMiddleware } from "../middleware/userMiddleware";
export const spaceRouter = Router();
spaceRouter.post("/", userMiddleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const { success, data } = createSpaceSchema.safeParse(req.body);
    if (!success) {
    
        return res.status(403).json({
            message: "Invalid Data"
        })
    }
    try {
        console.log(data);
        const space = await client.codeSpace.create({
            data: {
                name: data.name ?? data.language,
                language: data.language,

                members: {
                    create: {
                        userId: userId,
                        role: "OWNER"
                    },
                },
            },
            include: {
                members: true
            }
        })
        res.json(space);
    }
    catch (e) {
        return res.status(403).json({
            message: "There was some error in creating the space"
        })
    }
})
spaceRouter.get("/", userMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        // const user = await client.user.find
        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(400).json({
                message: "No User found"
            })
        }
        else {
            const spaces = await client.codeSpace.findMany({
                where: {
                    members: {
                        some: {
                            userId: userId
                        }

                    },
                },
                include: {
                    members: true
                }
            })
            return res.status(200).json({
                spaces
            })
        }
    }
    catch (e) {
        res.status(400).json({
            message: "Invalid Id"
        })
        return res;
    }
})
spaceRouter.get("/delete/:spaceId", userMiddleware, async (req, res) => {
    const userId = req.userId;

    let spaceId = req.params.spaceId as string;
    spaceId=spaceId.substring(1,spaceId.length)
   
    try {
        const space = await client.codeSpace.delete({
            where: {
                id: spaceId
            }
        })
        if (!space) {
            return res.status(411).json({
                message: "No space found"
            })
        }
        return res.json({
            space
        })
    } catch (e) {
        res.status(409).json({
            message: "Unable to delete space"
        })
    }
})
spaceRouter.post("/addUser", userMiddleware, async (req, res) => {
    const userId = req.userId;
    const { success, data } = addUserSchema.safeParse(req.body);
    if (!success) {
        res.status(403).json({
            message: "Invalid credentials"
        })
        return
    }
    try {
        const addUserToSpace = await client.codeSpace.update({
            where: {
                id: data.spaceId
            },
            data: {
                members: {
                    create: {
                        userId: data.userId,
                        role: data.role

                    }
                }
            }
        }
        )
        if (!addUserToSpace)
            return res.status(411).json({
                message: "Something went wrong"
            })

        return res.status(200).json({
            id: addUserToSpace.id
        })
    }
    catch (e) {
        return res.status(403).json({
            message: e
        })
    }
})