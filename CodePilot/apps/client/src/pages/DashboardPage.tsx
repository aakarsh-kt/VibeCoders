import { useEffect, useMemo, useState } from "react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { getToken } from "../lib/auth";
import { navigate } from "../lib/router";

function maskToken(token: string) {
    if (token.length <= 24) return token;
    return `${token.slice(0, 12)}…${token.slice(-8)}`;
}

export function DashboardPage() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Read once on mount.
        setToken(getToken());

        // Keep in sync across tabs.
        const handler = () => setToken(getToken());
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    const isLoggedIn = useMemo(() => Boolean(token), [token]);

    if (!isLoggedIn) {
        return (
            <div className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-12">
                <Card className="w-full bg-card/30 backdrop-blur">
                    <CardHeader>
                        <CardTitle>Dashboard</CardTitle>
                        <CardDescription>You’re not logged in.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Button onClick={() => navigate("/login")}>Log in</Button>
                        <Button variant="secondary" onClick={() => navigate("/signup")}>
                            Create account
                        </Button>
                        <Button variant="ghost" onClick={() => navigate("/")}>Back home</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
                <p className="text-sm text-muted-foreground">You’re logged in. Next step: list/create spaces.</p>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                <Button onClick={() => navigate("/create-space")}>Create CodeSpace</Button>
                <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                        <CardTitle>Auth status</CardTitle>
                        <CardDescription>JWT present in localStorage.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">Token</div>
                        <div className="mt-1 rounded-md border bg-background/40 px-3 py-2 font-mono text-xs text-foreground">
                            {token ? maskToken(token) : "(missing)"}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                        <CardTitle>Spaces</CardTitle>
                        <CardDescription>Coming next: create/list your CodeSpaces.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="rounded-md border bg-background/40 p-3 text-sm">
                            <div className="font-medium">Create a space</div>
                            <div className="text-muted-foreground">Use the “Create CodeSpace” button above</div>
                        </div>
                        <div className="rounded-md border bg-background/40 p-3 text-sm">
                            <div className="font-medium">Your spaces</div>
                            <div className="text-muted-foreground">Load from backend and show members/roles</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
