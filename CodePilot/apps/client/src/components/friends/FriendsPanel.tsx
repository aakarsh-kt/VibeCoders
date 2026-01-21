import { useEffect, useMemo, useState } from "react";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { getJsonAuth, postJsonAuth } from "../../lib/api";
import type { Friendship, ListFriendsResponse } from "../../types/friends";

type FriendsPanelProps = {
    token: string;
};

export function FriendsPanel({ token }: FriendsPanelProps) {
    const [friends, setFriends] = useState<Friendship[]>([]);
    const [friendsLoading, setFriendsLoading] = useState(false);
    const [friendsError, setFriendsError] = useState<string | null>(null);

    const [friendUserId, setFriendUserId] = useState("");
    const [friendUsername, setFriendUsername] = useState("");
    const [friendBusy, setFriendBusy] = useState(false);

    const canAddFriend = useMemo(() => {
        return friendUserId.trim().length > 0 || friendUsername.trim().length >= 3;
    }, [friendUserId, friendUsername]);

    const refreshFriends = async () => {
        setFriendsLoading(true);
        setFriendsError(null);
        try {
            const res = await getJsonAuth<ListFriendsResponse>("/user/friends", token);
            setFriends(Array.isArray(res.friends) ? res.friends : []);
        } catch (e) {
            setFriendsError(e instanceof Error ? e.message : "Failed to load friends");
        } finally {
            setFriendsLoading(false);
        }
    };

    const addFriend = async (e: React.FormEvent) => {
        e.preventDefault();
        setFriendsError(null);

        if (!canAddFriend) return;

        setFriendBusy(true);
        try {
            const payload: { userId?: string; username?: string } = {};
            if (friendUserId.trim()) payload.userId = friendUserId.trim();
            if (friendUsername.trim()) payload.username = friendUsername.trim();
            await postJsonAuth<{ friends: Friendship }>("/user/friends", payload, token);
            setFriendUserId("");
            setFriendUsername("");
            await refreshFriends();
        } catch (e) {
            setFriendsError(e instanceof Error ? e.message : "Failed to add friend");
        } finally {
            setFriendBusy(false);
        }
    };

    const removeFriend = async (userId: string) => {
        setFriendsError(null);
        setFriendBusy(true);
        try {
            await postJsonAuth<{ message: string }>("/user/deletefriends", { userId }, token);
            await refreshFriends();
        } catch (e) {
            setFriendsError(e instanceof Error ? e.message : "Failed to remove friend");
        } finally {
            setFriendBusy(false);
        }
    };

    useEffect(() => {
        void refreshFriends();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card className="bg-card/30 backdrop-blur">
            <CardHeader>
                <CardTitle>Friends</CardTitle>
                <CardDescription>Add and remove friends by user id or username.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={addFriend} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="friendUserId">Friend userId</Label>
                        <Input
                            id="friendUserId"
                            value={friendUserId}
                            onChange={(e) => setFriendUserId(e.target.value)}
                            placeholder="clxyz..."
                            autoComplete="off"
                        />
                    </div>
                    <div className="text-center text-xs text-muted-foreground">or</div>
                    <div className="space-y-2">
                        <Label htmlFor="friendUsername">Friend username</Label>
                        <Input
                            id="friendUsername"
                            value={friendUsername}
                            onChange={(e) => setFriendUsername(e.target.value)}
                            placeholder="akarsh"
                            autoComplete="off"
                        />
                    </div>
                    <Button type="submit" disabled={!canAddFriend || friendBusy}>
                        {friendBusy ? "Saving…" : "Add friend"}
                    </Button>
                </form>

                <div className="border-t pt-4">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-medium">Your friends</div>
                        <Button variant="ghost" onClick={() => void refreshFriends()} disabled={friendsLoading}>
                            Refresh
                        </Button>
                    </div>
                    {friendsError ? <div className="text-sm text-destructive">{friendsError}</div> : null}
                    {friendsLoading ? (
                        <div className="text-sm text-muted-foreground">Loading…</div>
                    ) : friends.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No friends yet.</div>
                    ) : (
                        <div className="space-y-2">
                            {friends.map((f) => (
                                <div key={`${f.requesterId}:${f.addresseeId}`} className="flex items-center justify-between rounded-md border bg-background/40 px-3 py-2">
                                    <div>
                                        <div className="text-sm font-medium">
                                            {f.addressee?.username ?? f.addresseeId}
                                        </div>
                                    </div>
                                    <Button variant="destructive" onClick={() => void removeFriend(f.addresseeId)} disabled={friendBusy}>
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
