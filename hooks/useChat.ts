"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { insforge } from "@/services/insforge";
import { ChatMessage, PresenceUser } from "@/types";

const PRESENCE_CHANNEL = "presence:main";
const MESSAGE_EVENT = "new_message";
const PRESENCE_ONLINE = "user_online";
const PRESENCE_OFFLINE = "user_offline";
const MESSAGE_STATUS_UPDATE = "message_status_update";

const CHAT_ATTACHMENTS_BUCKET =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CHAT_ATTACHMENTS_BUCKET) || "chat-attachments";
const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const MAIN_CHAT_CHANNEL = "chat:main";

type AttachmentMeta = { url: string; name: string; type: "image" | "file" };

function getAttachmentType(file: File): "image" | "file" {
    if (file.type.startsWith("image/")) return "image";
    const imageExtensions = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;
    if (imageExtensions.test(file.name)) return "image";
    return "file";
}

function safeFileName(name: string): string {
    const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
    const base = name.slice(0, name.length - ext.length).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    return (base || "file") + ext;
}

function getUrlFromUploadResponse(data: unknown, bucket: { getPublicUrl: (p: string) => string }, fallbackPath: string): string {
    const o = data as Record<string, unknown>;
    if (typeof o?.url === "string" && o.url) return o.url;
    const key = (typeof o?.key === "string" ? o.key : null) || (typeof o?.path === "string" ? o.path : null);
    if (key) return bucket.getPublicUrl(key);
    return bucket.getPublicUrl(fallbackPath);
}

const INSFORGE_TOKEN_KEY = "insforge-auth-token";

async function uploadAttachment(file: File): Promise<AttachmentMeta> {
    const path = `${Date.now()}-${safeFileName(file.name)}`;
    const bucket = insforge.storage.from(CHAT_ATTACHMENTS_BUCKET);

    const { data, error } = await bucket.upload(path, file);
    if (error) throw error;

    const url = data ? getUrlFromUploadResponse(data, bucket, path) : bucket.getPublicUrl(path);
    return { url, name: file.name, type: getAttachmentType(file) };
}

export function getDmChannelName(userIdA: string, userIdB: string): string {
    const [a, b] = [userIdA, userIdB].sort();
    return `chat:dm:${a}:${b}`;
}

export function useChat(userId: string, userName: string, chatChannel: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
    const [knownUsers, setKnownUsers] = useState<PresenceUser[]>(() => {
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem(`known_users_${userId}`);
                return stored ? JSON.parse(stored) : [];
            } catch { return []; }
        }
        return [];
    });
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [connectionState, setConnectionState] = useState<"disconnected" | "connecting" | "connected">("disconnected");
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [sendError, setSendError] = useState<string | null>(null);
    const [chatChannelReady, setChatChannelReady] = useState(false);

    const setMessagesRef = useRef(setMessages);
    setMessagesRef.current = setMessages;
    const chatChannelRef = useRef(chatChannel);
    chatChannelRef.current = chatChannel;

    const addKnownUser = useCallback((uid: string, name: string) => {
        setKnownUsers((prev) => {
            if (prev.some((u) => u.userId === uid)) return prev;
            const updated = [...prev, { userId: uid, name }];
            if (typeof window !== "undefined") {
                localStorage.setItem(`known_users_${userId}`, JSON.stringify(updated));
            }
            return updated;
        });
    }, [userId]);

    const handleUserOnline = useCallback((payload: any) => {
        let p = payload;
        if (Array.isArray(p) && p.length >= 2) p = { ...p[1], meta: p[0] };
        else if (Array.isArray(p) && p.length === 1) p = p[0];

        const data = p?.payload || p?.data || p;
        const uid = p?.userId || data?.userId || p?.meta?.userId;
        const name = p?.name || data?.name || "Anonymous";

        if (!uid || typeof uid !== "string") return;
        setOnlineUsers((prev) => {
            if (prev.some((u) => u.userId === uid)) return prev;
            return [...prev, { userId: uid, name }];
        });
        addKnownUser(uid, name);
    }, [addKnownUser]);

    const handleUserOffline = useCallback((payload: any) => {
        let p = payload;
        if (Array.isArray(p) && p.length >= 2) p = { ...p[1], meta: p[0] };
        else if (Array.isArray(p) && p.length === 1) p = p[0];

        const data = p?.payload || p?.data || p;
        const uid = p?.userId || data?.userId || p?.meta?.userId;
        if (!uid || typeof uid !== "string") return;
        setOnlineUsers((prev) => prev.filter((u) => u.userId !== uid));
    }, []);

    const handleTyping = useCallback((payload: any) => {
        const data = payload.data || payload.payload || payload;
        const uid = payload.userId || data?.userId;
        const isTyping = data?.isTyping;
        if (!uid || typeof uid !== "string") return;

        setTypingUsers((prev) => {
            if (isTyping && !prev.includes(uid)) return [...prev, uid];
            if (!isTyping && prev.includes(uid)) return prev.filter((id) => id !== uid);
            return prev;
        });
    }, []);

    const handleMessageStatusUpdate = useCallback((payload: any) => {
        const data = payload.data || payload.payload || payload;
        const messageId = data?.messageId;
        const status = data?.status; // 'delivered' | 'read'
        if (!messageId || !status) return;

        setMessagesRef.current((prev) =>
            prev.map((msg) =>
                msg.meta?.messageId === messageId ? { ...msg, meta: { ...msg.meta, status } } : msg
            )
        );
    }, []);

    const doConnect = useCallback(async () => {
        if (!userId) return;

        setConnectionError(null);
        setConnectionState("connecting");
        try {
            // Ensure profile exists for foreign key constraint on messages
            const { error: profileErr } = await insforge.database.from("profiles").upsert({
                id: userId,
                name: userName
            });
            if (profileErr) {
                console.error("Profile upsert error:", profileErr.message);
                if (profileErr.message.toLowerCase().includes("jwt expired")) {
                    setConnectionState("disconnected");
                    setConnectionError("Session expired. Please log in again.");
                    // Trigger logout to reset state
                    window.location.href = "/auth";
                    return;
                }
            }

            // Sync: Find all conversations this user has participated in
            const { data: recentMsgs, error: syncError } = await insforge.database
                .from("messages")
                .select("channel, sender_id, sender_name")
                .ilike("channel", `%${userId}%`)
                .order("created_at", { ascending: false })
                .limit(200);

            if (!syncError && recentMsgs) {
                const partners = new Map<string, string>();
                recentMsgs.forEach(m => {
                    if (m.channel.startsWith("chat:dm:")) {
                        // Extract the other person's ID from the DM channel name 
                        // Pattern: chat:dm:uuid1:uuid2
                        const parts = m.channel.split(":");
                        const otherId = parts[2] === userId ? parts[3] : parts[2];
                        if (otherId && otherId !== userId) {
                            // If they are the sender, we have their name. 
                            // If we are the sender, we might need to fetch their name from profiles if not known.
                            // For simplicity, we use sender_name if they sent it, or just track the ID.
                            if (m.sender_id === otherId) {
                                partners.set(otherId, m.sender_name);
                            } else if (!partners.has(otherId)) {
                                partners.set(otherId, "User"); // Placeholder if we sent the last msg
                            }
                        }
                    }
                });

                // Fetch names for any placeholders
                for (const [id, name] of partners.entries()) {
                    if (name === "User") {
                        const { data: p } = await insforge.database.from("profiles").select("name").eq("id", id).single();
                        if (p?.name) partners.set(id, p.name);
                    }
                    addKnownUser(id, partners.get(id) || "User");
                }
            }

            await insforge.realtime.connect();

            const presenceRes = await insforge.realtime.subscribe(PRESENCE_CHANNEL);
            if (!presenceRes.ok) {
                console.error("Failed to subscribe to presence:", presenceRes.error?.message);
            } else {
                await insforge.realtime.publish(PRESENCE_CHANNEL, PRESENCE_ONLINE, {
                    userId,
                    name: userName,
                });
                setOnlineUsers((prev) => {
                    if (prev.some((u) => u.userId === userId)) return prev;
                    return [...prev, { userId, name: userName }];
                });
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Realtime connection failed";
            setConnectionState("disconnected");
            setConnectionError(msg);
        }
    }, [userId, userName]);

    const doConnectRef = useRef(doConnect);
    useEffect(() => {
        doConnectRef.current = doConnect;
    }, [doConnect]);

    const presenceHeartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleIncomingMessage = useCallback((payload: any) => {
        let p = payload;
        if (Array.isArray(p) && p.length >= 2) {
            p = { meta: p[0], ...p[1], payload: p[1] };
        } else if (Array.isArray(p) && p.length === 1) {
            p = p[0];
        }
        if (!p || typeof p !== "object" || Array.isArray(p)) return;

        const inner = (p.payload ?? p.data ?? p) as Record<string, any>;
        const text = (p.text ?? inner?.text) as string | undefined;
        const senderName = (p.senderName ?? inner?.senderName ?? "Anonymous") as string;
        const meta = inner?.meta || p.meta || {};
        const attachment = (p.attachment ?? inner?.attachment) as ChatMessage["attachment"] | undefined;

        const channelNow = chatChannelRef.current;
        if (meta.channel !== undefined && meta.channel !== channelNow) return;

        const hasText = text !== undefined && typeof text === "string" && String(text).trim() !== "";
        const hasAttachment = attachment?.url && attachment?.name;
        if (!hasText && !hasAttachment) return;

        const messageId = meta.messageId as string | undefined;

        setMessagesRef.current((prev) => {
            const isDuplicate = prev.some((m) => m.meta?.messageId === messageId);
            if (messageId && isDuplicate) return prev;

            return [
                ...prev,
                {
                    meta: {
                        messageId,
                        senderId: meta.senderId as string | undefined,
                        timestamp: meta.timestamp as string | undefined || new Date().toISOString(),
                        status: "delivered",
                    },
                    text: typeof text === "string" ? text.trim() : "",
                    senderName: String(senderName || "Anonymous"),
                    ...(hasAttachment && attachment ? { attachment } : {}),
                },
            ];
        });

        // Publish read receipt if it's from someone else
        if (meta.senderId && meta.senderId !== userId && messageId) {
            if (insforge.realtime.isConnected) {
                insforge.realtime.publish(chatChannelRef.current, MESSAGE_STATUS_UPDATE, { messageId, status: "read" }).catch(() => { });
            }
            insforge.database.from("messages").update({ status: "read" }).eq("id", messageId).then((res) => { if (res.error) console.error(res.error) });
        }
    }, [userId]);

    useEffect(() => {
        const onConnect = () => {
            setConnectionState("connected");
            setConnectionError(null);
            if (presenceHeartbeatRef.current) clearInterval(presenceHeartbeatRef.current);
            presenceHeartbeatRef.current = setInterval(() => {
                if (insforge.realtime.isConnected) {
                    insforge.realtime.publish(PRESENCE_CHANNEL, PRESENCE_ONLINE, { userId, name: userName }).catch(() => { });
                }
            }, 5000);
        };

        const onDisconnect = () => setConnectionState("disconnected");
        const onConnectError = (err: any) => {
            setConnectionState("disconnected");
            setConnectionError(err?.message || "Connection failed");
        };

        insforge.realtime.on("connect", onConnect);
        insforge.realtime.on("disconnect", onDisconnect);
        insforge.realtime.on("connect_error", onConnectError);
        insforge.realtime.on(PRESENCE_ONLINE, handleUserOnline);
        insforge.realtime.on(PRESENCE_OFFLINE, handleUserOffline);
        insforge.realtime.on("user_typing", handleTyping);
        insforge.realtime.on(MESSAGE_STATUS_UPDATE, handleMessageStatusUpdate);
        insforge.realtime.on(MESSAGE_EVENT, handleIncomingMessage);

        doConnectRef.current().catch(() => { });

        return () => {
            if (presenceHeartbeatRef.current) clearInterval(presenceHeartbeatRef.current);
            insforge.realtime.off("connect", onConnect);
            insforge.realtime.off("disconnect", onDisconnect);
            insforge.realtime.off("connect_error", onConnectError);
            insforge.realtime.off(PRESENCE_ONLINE, handleUserOnline);
            insforge.realtime.off(PRESENCE_OFFLINE, handleUserOffline);
            insforge.realtime.off("user_typing", handleTyping);
            insforge.realtime.off(MESSAGE_STATUS_UPDATE, handleMessageStatusUpdate);
            insforge.realtime.off(MESSAGE_EVENT, handleIncomingMessage);
            insforge.realtime.publish(PRESENCE_CHANNEL, PRESENCE_OFFLINE, { userId }).catch(() => { });
            insforge.realtime.unsubscribe(PRESENCE_CHANNEL);
            insforge.realtime.disconnect();
        };
    }, [userId, userName, handleUserOnline, handleUserOffline, handleTyping, handleMessageStatusUpdate, handleIncomingMessage]);

    useEffect(() => {
        if (connectionState !== "connected") {
            setChatChannelReady(false);
            return;
        }

        const channel = chatChannel;
        setChatChannelReady(false);

        let mounted = true;

        const fetchMessages = async () => {
            if (!mounted) return;
            try {
                const { data, error } = await insforge.database
                    .from("messages")
                    .select("*")
                    .eq("channel", channel)
                    .order("created_at", { ascending: true })
                    .limit(100);

                if (error) {
                    console.error("Failed to fetch message history:", error.message);
                    return;
                }
                if (mounted && data) {
                    const historicalMessages: ChatMessage[] = data.map((d: any) => {
                        // Mark offline-received messages correctly against the database!
                        if (d.sender_id !== userId && d.status !== "read" && channel.includes("dm")) {
                            insforge.database.from("messages").update({ status: "read" }).eq("id", d.id).then((res) => { if (res.error) console.error(res.error) });
                            if (insforge.realtime.isConnected) {
                                insforge.realtime.publish(channel, MESSAGE_STATUS_UPDATE, { messageId: d.id, status: "read" }).catch(() => { });
                            }
                            d.status = "read";
                        }

                        const attachment =
                            d.attachment_url && d.attachment_name
                                ? {
                                    url: d.attachment_url,
                                    name: d.attachment_name,
                                    type: (d.attachment_type === "image" || d.attachment_type === "file" ? d.attachment_type : "file") as "image" | "file",
                                }
                                : undefined;
                        return {
                            meta: {
                                messageId: d.id,
                                senderId: d.sender_id,
                                timestamp: d.created_at,
                                status: d.status,
                            },
                            text: d.text ?? "",
                            senderName: d.sender_name,
                            ...(attachment && { attachment }),
                        };
                    });
                    setMessages(historicalMessages);
                }
            } catch (err) { }
        };

        fetchMessages().then(() => {
            if (!mounted) return;
            insforge.realtime.subscribe(channel).then((res) => {
                if (!mounted) return;
                if (!res.ok) {
                    console.error("Failed to subscribe to chat:", res.error?.message);
                    return;
                }
                setChatChannelReady(true);
            });
        });

        return () => {
            mounted = false;
            setChatChannelReady(false);
            insforge.realtime.unsubscribe(channel);
            setMessages([]);
        };
    }, [connectionState, chatChannel]);

    const sendMessage = useCallback(
        async (text: string, file?: File) => {
            setSendError(null);
            const trimmedText = text.trim();
            const hasAttachment = !!file;

            if (!trimmedText && !hasAttachment) return;

            if (file) {
                if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
                    setSendError("File too large (max 10 MB)");
                    return;
                }
                // Allow all images (any image/* MIME or common image extension); restrict only non-image types
                const isImageMime = file.type?.startsWith("image/");
                const isImageExt = /\.(png|jpe?g|gif|webp|bmp|svg|ico|tiff?|heic|avif)$/i.test(file.name);
                const isImage = isImageMime || isImageExt;
                const isAllowedDoc = /\.(pdf|doc|docx)$/i.test(file.name) || /^application\/pdf/i.test(file.type ?? "");
                if (!isImage && !isAllowedDoc) {
                    setSendError("Allowed: images, PDF, Word documents");
                    return;
                }
            }

            const optimisticId = `opt-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const attachmentPlaceholder: ChatMessage["attachment"] = file
                ? { url: "", name: file.name, type: getAttachmentType(file) }
                : undefined;

            const newMsg: ChatMessage = {
                meta: { senderId: userId, messageId: optimisticId, timestamp: new Date().toISOString(), status: "sent" },
                text: trimmedText || "",
                senderName: userName,
                ...(attachmentPlaceholder && { attachment: attachmentPlaceholder }),
            };

            setMessages((prev) => [...prev, newMsg]);

            try {
                if (!insforge.realtime.isConnected) throw new Error("Not connected");

                let attachment: AttachmentMeta | undefined;
                if (file) {
                    attachment = await uploadAttachment(file);
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.meta?.messageId === optimisticId ? { ...m, attachment } : m
                        )
                    );
                }

                const row: Record<string, unknown> = {
                    channel: chatChannel,
                    sender_id: userId,
                    sender_name: userName,
                    text: trimmedText || "",
                    status: "sent",
                };
                if (attachment) {
                    row.attachment_url = attachment.url;
                    row.attachment_name = attachment.name;
                    row.attachment_type = attachment.type;
                }

                const { data: dbRes, error: dbErr } = await insforge.database
                    .from("messages")
                    .insert([row])
                    .select();

                if (dbErr) {
                    console.error("Failed to insert message:", dbErr.message);
                    throw dbErr;
                }

                const realMessageId = dbRes?.[0]?.id ?? optimisticId;

                setMessages((prev) =>
                    prev.map((m) =>
                        m.meta?.messageId === optimisticId
                            ? { ...m, meta: { ...m.meta, messageId: realMessageId }, ...(attachment && { attachment }) }
                            : m
                    )
                );

                await insforge.realtime.publish(chatChannel, MESSAGE_EVENT, {
                    meta: { messageId: realMessageId, timestamp: new Date().toISOString(), senderId: userId },
                    text: trimmedText || "",
                    senderName: userName,
                    ...(attachment && { attachment }),
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                if (process.env.NODE_ENV === "development") console.error("[Chat attachment] Send failed:", err);
                const isImage = !!file;
                let userMsg: string;
                if (isImage && (msg.includes("Upload") || msg.includes("storage") || msg.includes("bucket") || msg.includes("STORAGE"))) {
                    userMsg = `Upload failed. Check: 1) Bucket "${CHAT_ATTACHMENTS_BUCKET}" exists in Insforge → Storage. 2) You are signed in. 3) Console (F12) for details.`;
                } else if (isImage && (msg.includes("insert") || msg.includes("column") || msg.includes("messages"))) {
                    userMsg = "Could not save image. Ensure messages table has attachment_url, attachment_name, attachment_type columns.";
                } else {
                    userMsg = isImage ? `Image failed: ${msg}` : msg;
                }
                setSendError(userMsg);
                setMessages((prev) =>
                    prev.map((m) =>
                        m.meta?.messageId === optimisticId
                            ? { ...m, text: (m.text || "") + (m.text ? "\n" : "") + "[Failed: " + userMsg + "]" }
                            : m
                    )
                );
            }
        },
        [userName, chatChannel, userId]
    );

    const sendTypingEvent = useCallback((isTyping: boolean) => {
        if (insforge.realtime.isConnected) {
            insforge.realtime.publish(chatChannel, "user_typing", { userId, isTyping }).catch(() => { });
        }
    }, [chatChannel, userId]);

    const retryConnection = useCallback(() => {
        insforge.realtime.disconnect();
        doConnectRef.current();
    }, []);

    return {
        messages,
        onlineUsers,
        knownUsers,
        typingUsers,
        connectionState,
        connectionError,
        chatChannelReady,
        retryConnection,
        sendMessage,
        sendTypingEvent,
        addKnownUser,
        sendError,
    };
}
