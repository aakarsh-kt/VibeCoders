import { Button } from "../components/ui/button";
import { LoggedOutCard } from "../components/auth/LoggedOutCard";
import { FriendsPanel } from "../components/friends/FriendsPanel";
import { SpacesPanel } from "../components/spaces/SpacesPanel";
import { getToken } from "../lib/auth";
import { navigate } from "../lib/router";

export function CreateSpacePage() {
    const token = getToken();

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Spaces</h2>
                    <p className="text-sm text-muted-foreground">Create, view, and delete your CodeSpaces.</p>
                </div>
                <Button variant="ghost" onClick={() => navigate("/")}>Back to landing</Button>
            </div>

            {!token ? (
                <LoggedOutCard description="Log in to create spaces and manage friends." />
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    <SpacesPanel token={token} />
                    <FriendsPanel token={token} />
                </div>
            )}
        </div>
    );
}
