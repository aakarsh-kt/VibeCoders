import { Sidebar } from "../components/sidebar";
import { useCallback, useEffect, useState } from "react";
// import {url}
function Space() {
    // NOTE: this app uses a custom router (not react-router).
    console.log(window.location.pathname.split('/')[2])
    const [ws, setWs] = useState<WebSocket>();
    const handleJoin = useCallback(() => {
        const tempWs = new WebSocket("ws://localhost:3001");
        // void tempWs;
        setWs(tempWs);
        tempWs.onopen = () => {
            tempWs.send(
                JSON.stringify({
                    type: "join"
                })
            )
            console.log("Message Sent")
        }
    }, []);
    useEffect(() => {
        handleJoin();
    }, [])
    return (
        <div className="h-[calc(100vh-3.5rem)] w-full overflow-hidden">
            <div className="flex h-full min-h-0 flex-col">

                {/* This area takes the remaining space without creating a page scrollbar */}
                <div className="min-h-0 flex-1 flex overflow-hidden bg-slate-700">
                    <div className="min-h-0 w-1/5 overflow-hidden">
                        <Sidebar />
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden">
                        codeFile
                    </div>
                    {/* <div className="h-full overflow-hidden px-4 py-3">something</div> */}
                </div>
            </div>
        </div>
    );
}

export default Space;
