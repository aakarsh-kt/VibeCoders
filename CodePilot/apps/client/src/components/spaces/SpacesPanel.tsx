import { useEffect, useMemo, useState } from "react";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { deleteJsonAuth, getJsonAuth, postJsonAuth } from "../../lib/api";
import type { CreateSpaceResponse, ListSpacesResponse, Space } from "../../types/spaces";

import { languages } from "common/types";
import { navigate, spacePath } from "../../lib/router";

type SpacesPanelProps = {
    token: string;
};

export function SpacesPanel({ token }: SpacesPanelProps) {
    const [name, setName] = useState("");
    const [language, setLanguage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [spaces, setSpaces] = useState<Space[]>([]);
    const [spacesLoading, setSpacesLoading] = useState(false);
    const [spacesError, setSpacesError] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        return name.trim().length >= 1 && language.trim().length >= 2;
    }, [name, language]);

    const refreshSpaces = async () => {
        setSpacesLoading(true);
        setSpacesError(null);
        try {
            const res = await getJsonAuth<ListSpacesResponse>("/space", token);
            setSpaces(Array.isArray(res.spaces) ? res.spaces : []);
        } catch (e) {
            setSpacesError(e instanceof Error ? e.message : "Failed to load spaces");
        } finally {
            setSpacesLoading(false);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!canSubmit) return;

        setLoading(true);
        try {
            await postJsonAuth<CreateSpaceResponse>("/space", { name: name.trim(), language }, token);
            setName("");
            setLanguage("");
            await refreshSpaces();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create space");
        } finally {
            setLoading(false);
        }
    };

    const deleteSpace = async (spaceId: string) => {
        setSpacesError(null);
        try {
            await deleteJsonAuth<{ space?: Space }>(`/space/${spaceId}`, token);
            await refreshSpaces();
        } catch (e) {
            setSpacesError(e instanceof Error ? e.message : "Failed to delete space");
        }
    };
    function handleOpenSpace(id: string) {
        navigate(spacePath(id));
    }
    useEffect(() => {
        void refreshSpaces();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card className="bg-card/30 backdrop-blur">
            <CardHeader>
                <CardTitle>Create a CodeSpace</CardTitle>
                <CardDescription>Give it a name and pick a language.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My project"
                            autoComplete="off"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="border rounded-md p-2"
                        >
                            {languages.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error ? <div className="text-sm text-destructive">{error}</div> : null}

                    <Button type="submit" disabled={!canSubmit || loading}>
                        {loading ? "Creating…" : "Create"}
                    </Button>
                </form>

                <div className="border-t pt-4">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-medium">Your spaces</div>
                        <Button variant="ghost" onClick={() => void refreshSpaces()} disabled={spacesLoading}>
                            Refresh
                        </Button>
                    </div>
                    {spacesError ? <div className="text-sm text-destructive">{spacesError}</div> : null}
                    {spacesLoading ? (
                        <div className="text-sm text-muted-foreground">Loading…</div>
                    ) : spaces.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No spaces yet.</div>
                    ) : (
                        <div className="space-y-2">
                            {spaces.map((s) => (
                                <div key={s.id} className="flex items-center justify-between rounded-md border bg-background/40 px-3 py-2">
                                    <div>
                                        <div className="text-sm font-medium">{s.name ?? s.language}</div>
                                        <div className="text-xs text-muted-foreground">{s.language} • id: {s.id}</div>
                                    </div>

                                    <Button variant="destructive" onClick={() => handleOpenSpace(s.id)}>
                                        Enter
                                    </Button>
                                    <Button variant="destructive" onClick={() => void deleteSpace(s.id)}>
                                        Delete
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
