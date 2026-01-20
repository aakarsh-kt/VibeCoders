import { password } from "bun"
import {z} from "zod"

export const signupSchema = z.object({
    username:z.string().min(3),
    password:z.string().min(8)
})
export const signinSchema = z.object({
    username:z.string().min(3),
    password:z.string().min(8)
})
export const createSpaceSchema=z.object({
    language : z.string(),
})

export const addUserSchema=z.object({
    userId:z.string(),
    spaceId:z.string(),
    role: z.enum(["OWNER", "EDITOR", "VIEWER"]),
})

export const deleteSpaceSchema=z.object({
    spaceId:z.string()
})

export const changeRoleSchema=z.object({
    spaceId:z.string(),
    userId:z.string(),
    role: z.enum(["OWNER", "EDITOR", "VIEWER"]),
})
export const updateMetadataSchema=z.object({
    username:z.string()
})

export const addFriendsSchema=z.object({
    userId:z.string()
})
export const deleteFriendsSchema=z.object({
    userId:z.string()
})