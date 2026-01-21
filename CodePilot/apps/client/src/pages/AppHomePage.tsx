import { useEffect, useState } from "react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { getJsonAuth } from "../lib/api";
import { getToken } from "../lib/auth";
import { navigate } from "../lib/router";

type SpacePreview = {
    id: string;
    name?: string;
    language: string;
};

type Friendship = {
    requesterId: string;
    addresseeId: string;
    addressee?: {
        id: string;
        username: string;
    };
};

type ListSpacesResponse = {
    spaces: SpacePreview[];
};

type ListFriendsResponse = {
    friends: Friendship[];
};

export function AppHomePage() {
    const token = getToken();
    const [spaces, setSpaces] = useState<SpacePreview[]>([]);
    const [friends, setFriends] = useState<Friendship[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        void (async () => {
            try {
                const [spacesRes, friendsRes] = await Promise.all([
                    getJsonAuth<ListSpacesResponse>("/space", token),
                    getJsonAuth<ListFriendsResponse>("/user/friends", token),
                ]);

                if (cancelled) return;
                setSpaces((spacesRes.spaces ?? []).slice(0, 5));
                setFriends((friendsRes.friends ?? []).slice(0, 5));
            } catch (e) {
                if (cancelled) return;
                setError(e instanceof Error ? e.message : "Failed to load dashboard");
            } finally {
                if (cancelled) return;
                setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [token]);

    if (!token) {
        return (
            <div className="mx-auto w-full max-w-6xl px-4 py-10">
                <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                        <CardTitle>You’re not logged in</CardTitle>
                        <CardDescription>Log in to access your workspace.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Button onClick={() => navigate("/login")}>Log in</Button>
                        <Button variant="secondary" onClick={() => navigate("/signup")}>Sign up</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">App</h2>
                    <p className="text-sm text-muted-foreground">Quick overview and shortcuts.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => navigate("/")}>Landing</Button>
                    <Button onClick={() => navigate("/create-space")}>Manage spaces</Button>
                </div>
            </div>

            {error ? <div className="mb-4 text-sm text-destructive">{error}</div> : null}

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-base">Your spaces</CardTitle>
                        <CardDescription>{loading ? "Loading…" : `${spaces.length} shown`}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {spaces.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No spaces yet.</div>
                        ) : (
                            spaces.map((s) => (
                                <div key={s.id} className="flex items-center justify-between rounded-md border bg-background/40 px-3 py-2">
                                    <div>
                                        <div className="text-sm font-medium">{s.name ?? "Untitled"} • {s.language}</div>
                                        <div className="text-xs text-muted-foreground">{s.id}</div>
                                    </div>
                                    <Button size="sm" variant="secondary" onClick={() => navigate("/create-space")}>Open</Button>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-base">Friends</CardTitle>
                        <CardDescription>{loading ? "Loading…" : `${friends.length} shown`}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {friends.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No friends yet.</div>
                        ) : (
                            friends.map((f) => (
                                <div key={`${f.requesterId}:${f.addresseeId}`} className="rounded-md border bg-background/40 px-3 py-2">
                                    <div className="text-sm font-medium">
                                        {f.addressee?.username ?? f.addresseeId}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-base">Quick actions</CardTitle>
                        <CardDescription>Common next steps</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button onClick={() => navigate("/create-space")}>Create / delete spaces</Button>
                        <Button variant="secondary" onClick={() => navigate("/create-space")}>Manage friends</Button>
                        <Button variant="outline" onClick={() => navigate("/")}>View landing</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
