import type { User } from "./User";


export class RoomManager{

        public rooms: Map<string, User[]> = new Map();
    private constructor(){}
    private static instance: RoomManager;



    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }


    public addUser(spaceId:string,user:User){
         const room = this.rooms.get(spaceId) ?? [];

        const exists = room.some(u => u.userId === user.userId);
        if (exists) return false;

        this.rooms.set(spaceId, [...room, user]);
        
        console.log(`User ${user.userId} joined space ${spaceId}`);
        return true;
    }
    public getUsers(spaceId:string){
        const members=this.rooms.get(spaceId);
        //return only userId not whole object
        if (!members) return [];
        return members.map(u => u.userId);
    }
    public async removeUser(spaceId:string,user:User){
      const room=this.rooms.get(spaceId) ?? [];
      const exists = room.some(u => u.userId === user.userId);
        if (!exists) return;
        //write to remove that user from space
        const users=room.filter(u=>u.userId!==user.userId);
        this.rooms.set(spaceId, [...users]);
    }
    public broadcastMessage(spaceId:string,data:any){
        //write code to broadcast that user has left
        const room=this.rooms.get(spaceId) ?? [];
        
        room.forEach(user => {
            user.sendMessage(JSON.stringify(data));
        });
    }
    public broadcastMessageToRest(spaceId:string,data:any,userID:string){
        const room=this.rooms.get(spaceId) ?? [];
        
        room.forEach(user => {
            if(user.userId!=userID)
            user.sendMessage(JSON.stringify(data));
        });
    }
}