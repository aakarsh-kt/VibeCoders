import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { clearToken, getToken } from "../lib/auth";
import { navigate } from "../lib/router";

type NavbarProps = {
    /** Optional callbacks (useful when you wire real routing/pages). */
    onHome?: () => void;
    onLogin?: () => void;
    onSignup?: () => void;
    onLogout?: () => void;
};

function getAuthToken(): string | null {
    return getToken();
}

export function Navbar(props: NavbarProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Initial check.
        setIsLoggedIn(Boolean(getAuthToken()));

        // Keep state in sync if another tab logs in/out.
        const handler = () => setIsLoggedIn(Boolean(getAuthToken()));
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    const goHome = () => {
        if (props.onHome) return props.onHome();
        // No router yet: just do a normal navigation.
        navigate("/");
    };

    const login = () => {
        if (props.onLogin) return props.onLogin();
        navigate("/login");
    };

    const signup = () => {
        if (props.onSignup) return props.onSignup();
        navigate("/signup");
    };

    const logout = () => {
        clearToken();
        setIsLoggedIn(false);

        props.onLogout?.();
        navigate("/", { replace: true });
    };

    const dashboard = () => {
        navigate("/dashboard");
    };

    const createSpace = () => {
        navigate("/create-space");
    };

    return (
        <header className="w-full border-b bg-background">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold tracking-tight">CodePilot</div>
                </div>

                <nav className="flex items-center gap-2">
                    <Button variant="ghost" onClick={goHome}>
                        Home
                    </Button>

                    {isLoggedIn ? (
                        <>
                            <Button variant="ghost" onClick={createSpace}>
                                Create Space
                            </Button>
                            <Button variant="secondary" onClick={dashboard}>
                                Dashboard
                            </Button>
                            <Button variant="destructive" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={login}>
                                Login
                            </Button>
                            <Button onClick={signup}>Sign up</Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

