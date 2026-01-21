import type WebSocket from "ws";

export class User{
    private ws:WebSocket;
    constructor( ws: WebSocket) {
        this.ws=ws;
    }

    public sendMessage(message: string) {
        this.ws.send(message);
    }

    public destroy() {
        this.ws.close();
    }
}