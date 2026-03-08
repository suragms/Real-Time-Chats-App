import { LogOut, Wifi, WifiOff, ArrowLeft, MoreVertical } from "lucide-react";
import Image from "next/image";
import { PresenceUser } from "@/types";
type ChatHeaderProps = {
    title: string;
    isMainRoom: boolean;
    onlineCount: number;
    connectionState: "disconnected" | "connecting" | "connected";
    onSignOut: () => void;
    onBack?: () => void;
    typingUsers?: string[];
    otherUser?: PresenceUser;
    onlineUsers?: PresenceUser[];
};

export function ChatHeader({
    title,
    isMainRoom,
    onlineCount,
    connectionState,
    onSignOut,
    onBack,
    typingUsers = [],
    otherUser,
    onlineUsers = [],
}: ChatHeaderProps) {
    const isTyping = !isMainRoom && otherUser && typingUsers.includes(otherUser.userId);
    const isOnline = !isMainRoom && otherUser && onlineUsers.some(u => u.userId === otherUser.userId);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--card-border)] bg-[var(--card)]/90 px-4 sm:px-6 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-2 sm:gap-3">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex h-11 w-11 shrink-0 items-center justify-center -ml-2 rounded-full text-[var(--muted)] hover:bg-[var(--background)] md:hidden transition"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={24} />
                    </button>
                )}
                {isMainRoom ? (
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm overflow-hidden border border-[var(--card-border)]">
                        <Image src="/logo.png" alt="Logo" fill className="object-cover" sizes="40px" />
                    </div>
                ) : (
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-[var(--primary)] text-white font-bold uppercase shadow-sm">
                        {title.charAt(0)}
                    </div>
                )}
                <div className="flex flex-col min-w-0 pr-2">
                    <h1 className="text-base sm:text-lg font-bold tracking-tight text-[var(--foreground)] truncate">{title}</h1>
                    <div className="flex items-center gap-1.5 text-xs">
                        {isTyping ? (
                            <span className="text-[var(--primary)] font-medium animate-pulse">typing...</span>
                        ) : isMainRoom ? (
                            <span className="text-[var(--muted)]">{onlineCount} participants online</span>
                        ) : (
                            <span className="text-[var(--muted)] flex items-center gap-1">
                                <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-[var(--success)] shadow-[0_0_8px_var(--success)]" : "bg-slate-300"}`} />
                                {isOnline ? "Online" : "Offline"}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-[var(--input-bg)] px-3 py-1.5 border border-[var(--card-border)]">
                    {connectionState === "connected" ? (
                        <>
                            <Wifi size={14} className="text-[var(--success)]" />
                            <span className="text-xs font-semibold text-[var(--success)]">Connected</span>
                        </>
                    ) : (
                        <>
                            <WifiOff size={14} className="text-[var(--warning)] animate-pulse" />
                            <span className="text-xs font-semibold text-[var(--warning)]">
                                {connectionState === "connecting" ? "Connecting..." : "Disconnected"}
                            </span>
                        </>
                    )}
                </div>

                <button
                    onClick={onSignOut}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--error-bg)] hover:text-[var(--error)] transition"
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>
                {/* Mobile Extra Menu Icon */}
                <button
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--background)] transition md:hidden -mr-2"
                    aria-label="More options"
                >
                    <MoreVertical size={24} />
                </button>
            </div>
        </header>
    );
}
