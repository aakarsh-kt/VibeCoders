import { useEffect, useState } from "react";

type StaticRoute = "/" | "/login" | "/signup" | "/create-space" | "/app" | "/space";

// Dynamic route format: /space/<spaceId>
export type SpaceRoute = `/space/${string}`;

export type Route = StaticRoute | SpaceRoute;

type NavigateOptions = {
    replace?: boolean;
};

export function navigate(path: Route, opts: NavigateOptions = {}) {
    if (opts.replace) {
        window.history.replaceState({}, "", path);
    } else {
        window.history.pushState({}, "", path);
    }
    window.dispatchEvent(new PopStateEvent("popstate"));
}

export function spacePath(spaceId: string): SpaceRoute {
    return `/space/${spaceId}`;
}

export function getSpaceIdFromPath(pathname: string = window.location.pathname): string | null {
    if (pathname === "/space") return null;
    if (!pathname.startsWith("/space/")) return null;
    const rest = pathname.slice("/space/".length);
    return rest.length ? decodeURIComponent(rest) : null;
}

export function useRoute(): Route {
    const getPath = (): Route => {
        const p = window.location.pathname;
        if (p === "/login") return "/login";
        if (p === "/signup") return "/signup";
        if (p === "/create-space") return "/create-space";
        if (p === "/app") return "/app";
        if (p === "/space") return "/space";
        if (p.startsWith("/space/")) return p as SpaceRoute;
        return "/";
    };

    const [route, setRoute] = useState<Route>(getPath);

    useEffect(() => {
        const onPop = () => setRoute(getPath());
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    return route;
}
