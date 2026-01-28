import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type OnlineUser = {
    name: string;
    role: "Owner" | "Editor" | "Viewer";
    status?: "active" | "idle";
};

type VersionItem = {
    id: string;
    timestamp: string;
    user: string;
};

export const Sidebar = () => {
    const onlineUsers: OnlineUser[] = [
        { name: "Akarsh", role: "Owner", status: "active" },
        { name: "Sahil", role: "Editor", status: "active" },
        { name: "Dimla", role: "Viewer", status: "idle" },
        { name: "Swami", role: "Viewer", status: "idle" },
    ];

    const versions: VersionItem[] = [
        { id: "v14", timestamp: "2026-01-23 18:42", user: "Akarsh" },
        { id: "v13", timestamp: "2026-01-23 18:35", user: "Sahil" },
        { id: "v12", timestamp: "2026-01-23 18:10", user: "Akarsh" },
        { id: "v11", timestamp: "2026-01-23 17:58", user: "Dimla" },
        { id: "v10", timestamp: "2026-01-23 17:41", user: "Swami" },
        { id: "v09", timestamp: "2026-01-23 17:22", user: "Akarsh" },
        { id: "v08", timestamp: "2026-01-23 17:01", user: "Sahil" },
        { id: "v07", timestamp: "2026-01-23 16:46", user: "Dimla" },
        { id: "v06", timestamp: "2026-01-23 16:30", user: "Akarsh" },
        { id: "v05", timestamp: "2026-01-23 16:09", user: "Swami" },
        { id: "v04", timestamp: "2026-01-23 15:44", user: "Sahil" },
        { id: "v03", timestamp: "2026-01-23 15:23", user: "Akarsh" },
        { id: "v02", timestamp: "2026-01-23 15:07", user: "Dimla" },
        { id: "v01", timestamp: "2026-01-23 14:50", user: "Akarsh" },
    ];

    const onRun = () => {
        // TODO: wire to WS/backend
        console.log("run code");
    };

    const onCompile = () => {
        // TODO: wire to WS/backend
        console.log("compile code");
    };

    const onSave = () => {
        // TODO: wire to snapshot endpoint
        console.log("save code");
    };

    return (
        <aside className="h-full w-full overflow-hidden border-r bg-card/30 backdrop-blur">
            <div className="flex h-full min-h-0 flex-col gap-2 p-2">
                {/* Online users */}
                <Card className="bg-background/40 shrink-0">
                    <CardHeader className="px-3 ">
                        <CardTitle className="text-xs">Online users</CardTitle>
                        <CardDescription className="text-[11px]">Live presence + roles</CardDescription>
                    </CardHeader>
                    <CardContent className="px-3 pt-0">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-[11px] font-medium text-muted-foreground">User</div>
                            <div className="text-[11px] font-medium text-muted-foreground">Role</div>
                        </div>

                        <div className="mt-2 max-h-24 min-h-0 overflow-hidden">
                            <div className="pretty-scrollbar force-scrollbar h-full overflow-y-scroll pr-2">
                                <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                                    {onlineUsers.map((u) => (
                                        <>
                                            <div key={`${u.name}-name`} className="flex items-center gap-2 text-xs">
                                                <span
                                                    className={
                                                        u.status === "active"
                                                            ? "h-2 w-2 rounded-full bg-emerald-500"
                                                            : "h-2 w-2 rounded-full bg-muted-foreground/60"
                                                    }
                                                />
                                                <span className="font-medium">{u.name}</span>
                                            </div>
                                            <div key={`${u.name}-role`} className="text-xs">
                                                <span
                                                    className={
                                                        u.role === "Owner"
                                                            ? "rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary"
                                                            : u.role === "Editor"
                                                                ? "rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-600"
                                                                : "rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
                                                    }
                                                >
                                                    {u.role}
                                                </span>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Controls */}
                <Card className="bg-background/40 shrink-0 m-0 p-2">
                    <CardHeader className="px-3 ">
                        <CardTitle className="text-xs">Controls</CardTitle>
                        <CardDescription className="text-[11px]">Run, compile, and save</CardDescription>
                    </CardHeader>
                    <CardContent className="px-3 pt-0 pb-3">
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" className="h-8" onClick={onRun}>
                                Run
                            </Button>
                            <Button size="sm" className="h-8" variant="secondary" onClick={onCompile}>
                                Compile
                            </Button>
                            <Button size="sm" className="h-8" variant="outline" onClick={onSave}>
                                Save
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Previous versions */}
                <Card className="bg-background/40 flex-1 min-h-0 overflow-hidden">
                    <CardHeader className="px-3 py-1">
                        <CardTitle className="text-sm">Previous versions</CardTitle>
                        <CardDescription className="text-xs">Dummy history (timestamp + last editor)</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-0 px-3 pt-0 ">
                        <div className="h-full min-h-0 overflow-hidden">
                            <div className="pretty-scrollbar force-scrollbar h-full overflow-y-scroll pr-2">
                                <div className="space-y-2 pb-1">
                                    {versions.map((v) => (
                                        <div
                                            key={v.id}
                                            className="flex items-center justify-between rounded-md border bg-background/40 px-3 py-2"
                                        >
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium">{v.id}</div>
                                                <div className="truncate text-xs text-muted-foreground">{v.timestamp}</div>
                                            </div>
                                            <div className="shrink-0 text-xs text-muted-foreground">by {v.user}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </aside>
    );
};