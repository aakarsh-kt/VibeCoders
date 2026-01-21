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

        // Keep state in sync if another tab logs in/out AND for in-app routing.
        const handler = () => setIsLoggedIn(Boolean(getAuthToken()));
        window.addEventListener("storage", handler);
        window.addEventListener("popstate", handler);
        return () => {
            window.removeEventListener("storage", handler);
            window.removeEventListener("popstate", handler);
        };
    }, []);

    const goHome = () => {
        if (props.onHome) return props.onHome();
        // Home is always the marketing landing page.
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

    const createSpace = () => {
        navigate("/create-space");
    };

    const openApp = () => {
        navigate("/app");
    };

    return (
        <header className="w-full border-b bg-background">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
                    <div className="text-lg font-semibold tracking-tight">CodePilot</div>
                </div>

                <nav className="flex items-center gap-2">
                    <Button variant="ghost" onClick={goHome}>
                        Home
                    </Button>

                    {isLoggedIn ? (
                        <>
                            <Button variant="ghost" onClick={openApp}>
                                App
                            </Button>
                            <Button variant="ghost" onClick={createSpace}>
                                Spaces
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

