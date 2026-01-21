export type Space = {
    id: string;
    name?: string;
    language: string;
    members?: unknown[];
};

export type ListSpacesResponse = {
    spaces: Space[];
};

export type CreateSpaceResponse = {
    id: string;
    name?: string;
    language: string;
    members?: unknown[];
};
