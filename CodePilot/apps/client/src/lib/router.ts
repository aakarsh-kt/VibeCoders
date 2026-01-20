import { useEffect, useState } from "react";

type Route = "/" | "/login" | "/signup" | "/dashboard" | "/create-space";

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

export function useRoute(): Route {
    const getPath = (): Route => {
        const p = window.location.pathname;
        if (p === "/login") return "/login";
        if (p === "/signup") return "/signup";
        if (p === "/dashboard") return "/dashboard";
        if (p === "/create-space") return "/create-space";
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
