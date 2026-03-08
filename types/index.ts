export type User = {
    id: string;
    email: string;
    profile?: { name?: string | null };
};

export type PresenceUser = {
    userId: string;
    name: string;
};

export type ChatMessageAttachment = {
    url: string;
    name: string;
    type?: "image" | "file";
};

export type ChatMessage = {
    meta?: {
        senderId?: string;
        timestamp?: string;
        messageId?: string;
        status?: "sent" | "delivered" | "read";
    };
    text: string;
    senderName: string;
    attachment?: ChatMessageAttachment;
};

export type Conversation =
    | { type: "main" }
    | { type: "dm"; otherUser: PresenceUser };
