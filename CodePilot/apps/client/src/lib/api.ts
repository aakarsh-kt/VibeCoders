type Json = Record<string, unknown>;

// Backend API base URL (Express)
const API_BASE = "http://localhost:3000";

function getAuthHeaders(token: string | null): Record<string, string> {
    // Backend middleware currently expects the raw token in `authorization` (not `Bearer <token>`).
    // Keep it consistent here.
    return token ? { authorization: token } : {};
}

export async function postJsonAuth<TResponse>(path: string, body: Json, token: string | null): Promise<TResponse> {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(token),
        },
        body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: unknown = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const message =
            typeof (data as any)?.message === "string"
                ? (data as any).message
                : `Request failed: ${res.status}`;
        throw new Error(message);
    }

    return data as TResponse;
}

export async function postJson<TResponse>(path: string, body: Json): Promise<TResponse> {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: unknown = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const message =
            typeof (data as any)?.message === "string"
                ? (data as any).message
                : `Request failed: ${res.status}`;
        throw new Error(message);
    }

    return data as TResponse;
}
