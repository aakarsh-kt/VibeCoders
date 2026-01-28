import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
function getRandomString(length: number) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
const JWT_SECRET = process.env.JWT_SECRET!;
export class User {
    private ws: WebSocket;
    public id: string;
    public userId?: string;
    public roomManager: RoomManager;
    constructor(ws: WebSocket) {
        this.ws = ws;
        this.id = getRandomString(10);
        this.roomManager = RoomManager.getInstance();
        this.initHandlers();
    }
    private initHandlers() {
        this.ws.on("message", async (message) => {
            let data: any;
            try {
                data = JSON.parse(message.toString());
            } catch {
                return;
            }
            if (data.type === "join") {
                await this.handleJoin(data);
                return;
            }
            else if (data.type === "leave") {
              await this.handleLeave(data);
            }
            else if(data.type==="fetchMembers"){
               await this.fetchMembers(data);
            }
            // else if(data.type)
        })
    }
    public async handleLeave(data:any){
        const spaceId = data.payload.spaceId;
        const token = data.payload.token;
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const userID = decoded.id;

        if (!userID) {
            this.ws.close();
            return;
        }
        await this.roomManager.removeUser(spaceId,this)
        this.sendMessage(JSON.stringify({
            "type":"space-left"
        }))
        const message = {
            type: 'user-left',
            userId: userID
        };
        this.roomManager.broadcastMessage(spaceId,message)
    }
    public async fetchMembers(data:any){
        const spaceId = data.payload.spaceId;
        const token = data.payload.token;
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const userID = decoded.id;

        if (!userID) {
            this.ws.close();
            return;
        }
        const members= this.roomManager.getUsers(spaceId);
   
        this.sendMessage(JSON.stringify({
            "type":"members",
            "members":members
        }))
    }
    public  handleJoin(data: any) {
        const spaceId = data.payload.spaceId;
        const token = data.payload.token;
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const userID = decoded.id;
        this.userId=decoded.id;
        if (!userID) {
            this.ws.close();
            return;
        }
       
        this.roomManager.addUser(spaceId, this);
        this.sendMessage(JSON.stringify({
            "type": "space-joined"
        }))
        const message=({
            "type":"user-joined",
            "payload":{
                "userId":userID
            }
        })
        this.roomManager.broadcastMessageToRest(spaceId,message,userID)
    }
    public sendMessage(message: any) {
        this.ws.send(message);
    }

    public destroy() {
        this.ws.close();
    }
}