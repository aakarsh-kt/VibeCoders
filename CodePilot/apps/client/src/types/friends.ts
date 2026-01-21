export type Friendship = {
    requesterId: string;
    addresseeId: string;
    addressee?: {
        id: string;
        username: string;
    };
};

export type ListFriendsResponse = {
    friends: Friendship[];
};
