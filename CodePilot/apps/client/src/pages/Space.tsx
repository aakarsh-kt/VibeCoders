import { Sidebar } from "../components/sidebar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {url}
function Space() {
    // NOTE: this app uses a custom router (not react-router).
    const spaceId = window.location.pathname.split("/")[2];
    const [ws, setWs] = useState<WebSocket>();

    const [code, setCode] = useState<string>(
        "// Start typing…\n\nfunction hello() {\n  return 'Hello';\n}\n"
    );

    const editorScrollRef = useRef<HTMLTextAreaElement | null>(null);
    const gutterScrollRef = useRef<HTMLDivElement | null>(null);

    const onEditorScroll = useCallback(() => {
        const editor = editorScrollRef.current;
        const gutter = gutterScrollRef.current;
        if (!editor || !gutter) return;
        gutter.scrollTop = editor.scrollTop;
    }, []);

    const lineCountToShow = useMemo(() => {
        // Split into lines (keep empty trailing line if present).
        const lines = code.split("\n");

        // Find last line index that has non-whitespace.
        let lastNonEmpty = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i] ?? "";
            if (line.trim().length > 0) lastNonEmpty = i + 1;
        }

        // Always show at least 1.
        return Math.max(1, lastNonEmpty);
    }, [code]);

    const lineNumbers = useMemo(() => {
        return Array.from({ length: lineCountToShow }, (_, i) => i + 1);
    }, [lineCountToShow]);
    const handleJoin = useCallback(() => {
        const tempWs = new WebSocket("ws://localhost:3001");
        // void tempWs;
        setWs(tempWs);
        tempWs.onopen = () => {
            tempWs.send(
                JSON.stringify({
                    type: "join",
                    spaceId: spaceId
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
                    <div className="min-h-0 flex-1 overflow-hidden p-3">
                        <div className="h-full min-h-0 overflow-hidden rounded-lg border bg-background/40">
                            <div className="flex h-full min-h-0 overflow-hidden">
                                {/* Gutter */}
                                <div
                                    ref={gutterScrollRef}
                                    className="pretty-scrollbar force-scrollbar w-14 shrink-0 overflow-hidden border-r bg-background/60"
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-2 py-2 font-mono text-xs leading-6 text-muted-foreground">
                                            {lineNumbers.map((n) => (
                                                <div key={n} className="h-6 select-none text-right">
                                                    {n}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Editor */}
                                <textarea
                                    ref={editorScrollRef}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    onScroll={onEditorScroll}
                                    spellCheck={false}
                                    className="h-full w-full resize-none overflow-auto bg-transparent px-3 py-2 font-mono text-sm leading-6 text-foreground outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className="h-full overflow-hidden px-4 py-3">something</div> */}
                </div>
            </div>
        </div>
    );
}

export default Space;
