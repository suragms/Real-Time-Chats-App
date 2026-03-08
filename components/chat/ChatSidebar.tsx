import { PresenceUser } from "@/types";
import { Search, UserPlus, X, Hash, Loader2, MessageCircle, Users, Settings, User } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { insforge } from "@/services/insforge";

type ChatSidebarProps = {
    activeType: "main" | "dm";
    activeUserId?: string;
    onlineUsers: PresenceUser[];
    knownUsers?: PresenceUser[];
    onSelectMain: () => void;
    onSelectUser: (user: PresenceUser) => void;
    onAddKnownUser?: (uid: string, name: string) => void;
    currentUserId: string;
    onClose?: () => void;
};

export function ChatSidebar({
    activeType,
    activeUserId,
    onlineUsers,
    knownUsers = [],
    onSelectMain,
    onSelectUser,
    onAddKnownUser,
    currentUserId,
    onClose,
}: ChatSidebarProps) {
    const [showFindUser, setShowFindUser] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [globalUser, setGlobalUser] = useState<PresenceUser | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const searchLower = searchQuery.trim().toLowerCase();

    // Friends/Known users list (always shown)
    const otherKnownUsers = knownUsers.filter(
        (u) => u.userId && currentUserId && u.userId !== currentUserId
    );

    // Filtered list for "exact match" search
    const localMatches = searchLower
        ? otherKnownUsers.filter((u) =>
            (u.name || "").toLowerCase() === searchLower
        )
        : [];

    useEffect(() => {
        if (!searchLower || localMatches.length > 0) {
            setGlobalUser(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                // Exact search in database profiles
                const { data, error } = await insforge.database
                    .from("profiles")
                    .select("id, name")
                    .eq("name", searchQuery.trim()) // Exact match (case sensitive or use ilike if postgres supports)
                    .single();

                if (data && data.id !== currentUserId) {
                    setGlobalUser({ userId: data.id, name: data.name });
                } else {
                    setGlobalUser(null);
                }
            } catch (err) {
                setGlobalUser(null);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchLower, localMatches.length, searchQuery, currentUserId]);

    const isUserOnline = (userId: string) => onlineUsers.some((u) => u.userId === userId);

    return (
        <aside className="flex h-full w-full flex-col border-r border-[var(--card-border)] bg-[var(--card)] sm:w-80">
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--card-border)] px-4 bg-slate-50/50">
                <div className="flex items-center gap-2">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="flex h-10 w-10 shrink-0 -ml-2 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--card-border)] transition md:hidden"
                            aria-label="Close sidebar"
                        >
                            <X size={20} />
                        </button>
                    )}
                    <div className="relative h-6 w-6 overflow-hidden rounded-md shadow-sm hidden sm:block">
                        <Image src="/logo.png" alt="Logo" fill className="object-cover" sizes="24px" />
                    </div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Chats</h2>
                </div>
                <button
                    onClick={() => setShowFindUser(!showFindUser)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${showFindUser
                        ? "bg-[var(--primary)] text-white shadow-[var(--shadow-sm)]"
                        : "bg-[var(--background)] text-[var(--muted)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
                        }`}
                >
                    {showFindUser ? <X size={20} /> : <UserPlus size={20} />}
                    <span className="text-xs sm:text-sm">{showFindUser ? "Close" : "New Chat"}</span>
                </button>
            </div>

            {/* New chat / Search UI */}
            {showFindUser && (
                <div className="border-b border-[var(--card-border)] bg-sky-50/40 p-4">
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by username..."
                            className="w-full rounded-2xl border border-[var(--card-border)] bg-white py-2 pl-9 pr-4 text-sm shadow-inner focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                        />
                    </div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        Search result
                    </div>
                    <ul className="custom-scrollbar mt-2 max-h-48 space-y-1 overflow-y-auto">
                        {isSearching ? (
                            <li className="flex items-center justify-center p-4">
                                <Loader2 className="animate-spin text-[var(--primary)]" size={20} />
                            </li>
                        ) : localMatches.length === 0 && !globalUser ? (
                            <li className="p-2 text-center text-sm text-[var(--muted)]">
                                {searchQuery ? "Enter exact username to find someone." : "Search by full username."}
                            </li>
                        ) : (
                            <>
                                {localMatches.map((u) => (
                                    <li key={u.userId}>
                                        <button
                                            onClick={() => {
                                                onSelectUser(u);
                                                setShowFindUser(false);
                                                setSearchQuery("");
                                                onAddKnownUser?.(u.userId, u.name);
                                            }}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[var(--background)]"
                                        >
                                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-[var(--primary)] font-bold uppercase text-white shadow-sm">
                                                {u.name.charAt(0)}
                                                {isUserOnline(u.userId) && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[var(--success)]" />}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate text-sm font-semibold text-[var(--foreground)]">{u.name}</p>
                                                <p className="text-xs text-[var(--muted)]">{isUserOnline(u.userId) ? "Online now" : "Offline"}</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                                {globalUser && !localMatches.some(m => m.userId === globalUser.userId) && (
                                    <li key={globalUser.userId}>
                                        <button
                                            onClick={() => {
                                                onSelectUser(globalUser);
                                                setShowFindUser(false);
                                                setSearchQuery("");
                                                onAddKnownUser?.(globalUser.userId, globalUser.name);
                                            }}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[var(--background)]"
                                        >
                                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 font-bold uppercase text-slate-500 shadow-sm border border-slate-300">
                                                {globalUser.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate text-sm font-semibold text-[var(--foreground)]">{globalUser.name}</p>
                                                <p className="text-xs text-[var(--primary)] font-medium">Found globally - Send a message!</p>
                                            </div>
                                        </button>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                </div>
            )}

            {/* Chat List */}
            <div className="custom-scrollbar flex-1 overflow-y-auto p-2">
                <button
                    onClick={onSelectMain}
                    className={`mb-2 flex w-full items-center gap-3 rounded-2xl px-3 py-4 text-left transition ${activeType === "main" ? "bg-sky-50/80 shadow-sm" : "hover:bg-[var(--background)] active:bg-[var(--card-border)]"
                        }`}
                >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--muted)]/20 text-[var(--muted)]">
                        <Hash size={24} />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <p className="truncate text-[15px] font-bold text-[var(--foreground)]">Main Room</p>
                            <span className="text-[10px] text-[var(--muted)]">Just now</span>
                        </div>
                        <p className="truncate text-sm text-[var(--muted)]">General discussion space</p>
                    </div>
                </button>

                {/* Dynamic DMs based on selected user */}
                {otherKnownUsers.map((u) => {
                    const isActive = activeType === "dm" && activeUserId === u.userId;
                    const isOnline = isUserOnline(u.userId);
                    return (
                        <button
                            key={u.userId}
                            onClick={() => onSelectUser(u)}
                            className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-3 py-4 text-left transition ${isActive ? "bg-sky-50/80 shadow-sm" : "hover:bg-[var(--background)] active:bg-[var(--card-border)]"
                                }`}
                        >
                            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--card-border)] bg-gradient-to-tr from-sky-400 to-[var(--primary)] font-bold uppercase text-white shadow-sm">
                                {u.name.charAt(0)}
                                {isOnline ? (
                                    <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--card)] bg-[var(--success)]" />
                                ) : (
                                    <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--card)] bg-slate-300" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <p className="truncate text-[15px] font-bold text-[var(--foreground)]">{u.name}</p>
                                    <span className="text-[10px] text-[var(--muted)]">{isOnline ? "Online" : "1h"}</span>
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                    <p className="truncate text-sm text-[var(--muted)]">Tap to view conversation...</p>
                                    {!isActive && isOnline && (
                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                                            1
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
