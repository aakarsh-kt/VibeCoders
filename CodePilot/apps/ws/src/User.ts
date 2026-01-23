import type WebSocket from "ws";

export class User{
    private ws:WebSocket;
    constructor( ws: WebSocket) {
        this.ws=ws;
        this.initHandlers();
    }
    private initHandlers(){
        this.ws.on("message", async(message)=>{
            let data:any;
            try{
                data=JSON.parse(message.toString());
            }catch{
                return;
            }
            if(data.type==="join")
             {   console.log("User Connected");
            return ;}
        })
    }
    public sendMessage(message: string) {
        this.ws.send(message);
    }

    public destroy() {
        this.ws.close();
    }
}