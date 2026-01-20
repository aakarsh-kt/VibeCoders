import { useMemo, useState } from "react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { postJson } from "../lib/api";
import { navigate } from "../lib/router";

type SignUpResponse = {
    id: string;
};

export function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => username.trim().length >= 3 && password.length >= 8, [username, password]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!canSubmit) return;

        setLoading(true);
        try {
            await postJson<SignUpResponse>("/signup", { username, password });
            // After signup, send them to login page.
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
            <Card className="w-full bg-card/30 backdrop-blur">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>Start using CodePilot in under a minute.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="akarsh"
                                autoComplete="username"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                            />
                        </div>

                        {error ? <div className="text-sm text-destructive">{error}</div> : null}

                        <div className="flex items-center justify-between gap-3">
                            <Button type="submit" disabled={!canSubmit || loading}>
                                {loading ? "Creating…" : "Sign up"}
                            </Button>

                            <Button type="button" variant="ghost" onClick={() => navigate("/login")}>
                                I already have an account
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
