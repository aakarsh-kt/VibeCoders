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
            <div className="flex h-full min-h-0 flex-col gap-3 p-3">
                {/* Online users */}
                <Card className="bg-background/40 shrink-0">
                    <CardHeader>
                        <CardTitle className="text-sm">Online users</CardTitle>
                        <CardDescription className="text-xs">Live presence + roles</CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-40 overflow-hidden">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-xs font-medium text-muted-foreground">User</div>
                            <div className="text-xs font-medium text-muted-foreground">Role</div>

                            {onlineUsers.map((u) => (
                                <>
                                    <div key={`${u.name}-name`} className="flex items-center gap-2 text-sm">
                                        <span
                                            className={
                                                u.status === "active"
                                                    ? "h-2 w-2 rounded-full bg-emerald-500"
                                                    : "h-2 w-2 rounded-full bg-muted-foreground/60"
                                            }
                                        />
                                        <span className="font-medium">{u.name}</span>
                                    </div>
                                    <div key={`${u.name}-role`} className="text-sm">
                                        <span
                                            className={
                                                u.role === "Owner"
                                                    ? "rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                                                    : u.role === "Editor"
                                                        ? "rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600"
                                                        : "rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                                            }
                                        >
                                            {u.role}
                                        </span>
                                    </div>
                                </>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Controls */}
                <Card className="bg-background/40 shrink-0">
                    <CardHeader>
                        <CardTitle className="text-sm">Controls</CardTitle>
                        <CardDescription className="text-xs">Run, compile, and save</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full justify-start" onClick={onRun}>
                            Run code
                        </Button>
                        <Button className="w-full justify-start" variant="secondary" onClick={onCompile}>
                            Compile code
                        </Button>
                        <Button className="w-full justify-start" variant="outline" onClick={onSave}>
                            Save code
                        </Button>
                    </CardContent>
                </Card>

                {/* Previous versions */}
                <Card className="bg-background/40 flex-1 min-h-0 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-sm">Previous versions</CardTitle>
                        <CardDescription className="text-xs">Dummy history (timestamp + last editor)</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-0">
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