import { useMemo, useState } from "react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { postJsonAuth } from "../lib/api";
import { getToken } from "../lib/auth";
import { navigate } from "../lib/router";

type CreateSpaceResponse = {
    id: string;
    language: string;
    members?: unknown[];
};

export function CreateSpacePage() {
    const token = getToken();
    const [language, setLanguage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => language.trim().length >= 2 && Boolean(token), [language, token]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("You’re not logged in.");
            return;
        }

        if (!canSubmit) return;

        setLoading(true);
        try {
            const space = await postJsonAuth<CreateSpaceResponse>("/space", { language }, token);
            // After creating, go back to dashboard (we'll list spaces there next).
            navigate("/dashboard", { replace: true });
            // optional: could navigate to a space detail page later using space.id
            void space;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create space");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
            <Card className="w-full bg-card/30 backdrop-blur">
                <CardHeader>
                    <CardTitle>Create a CodeSpace</CardTitle>
                    <CardDescription>Pick a language (e.g., typescript, python, cpp).</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Input
                                id="language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                placeholder="typescript"
                                autoComplete="off"
                            />
                        </div>

                        {!token ? (
                            <div className="text-sm text-muted-foreground">
                                You need to <Button variant="link" type="button" onClick={() => navigate("/login")}>log in</Button> first.
                            </div>
                        ) : null}

                        {error ? <div className="text-sm text-destructive">{error}</div> : null}

                        <div className="flex items-center justify-between gap-3">
                            <Button type="submit" disabled={!canSubmit || loading}>
                                {loading ? "Creating…" : "Create"}
                            </Button>

                            <Button type="button" variant="ghost" onClick={() => navigate("/dashboard")}>Cancel</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
