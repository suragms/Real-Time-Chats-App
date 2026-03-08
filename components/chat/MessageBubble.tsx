import { Check, CheckCheck, FileIcon, ImageOff } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { ChatMessage } from "@/types";

function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const [error, setError] = useState(false);
    if (error) {
        return (
            <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-black/5 px-3 py-4 text-sm ${className ?? ""}`}
            >
                <ImageOff size={20} className="opacity-70" />
                <span className="truncate">{alt || "Image"}</span>
            </a>
        );
    }
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            referrerPolicy="no-referrer"
            onError={() => setError(true)}
        />
    );
}

type MessageBubbleProps = {
    message: ChatMessage;
    isOwn: boolean;
    showAvatar: boolean;
};

export function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
    const meta = message.meta || {};
    const time = meta.timestamp ? format(new Date(meta.timestamp), "h:mm a") : "";
    const status = meta.status;
    const attachment = message.attachment;

    return (
        <div className={`flex w-full ${isOwn ? "justify-end" : "justify-start"} mb-1`}>
            {!isOwn && showAvatar && (
                <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-[var(--primary)] text-xs font-bold uppercase text-white shadow-sm self-end">
                    {message.senderName.charAt(0)}
                </div>
            )}
            {!isOwn && !showAvatar && <div className="mr-10" />}

            <div
                className={`group relative max-w-[85%] md:max-w-[70%] px-4 py-2 text-[15px] leading-snug shadow-[var(--shadow-sm)] ${isOwn
                    ? "rounded-2xl rounded-tr-sm bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "rounded-2xl rounded-tl-sm border border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)]"
                    }`}
            >
                {!isOwn && <p className="text-[11px] font-bold text-[var(--muted)]/80 mb-0.5">{message.senderName}</p>}

                {attachment?.type === "image" ? (
                    attachment.url ? (
                        <div className="space-y-1">
                            <ImageWithFallback
                                src={attachment.url}
                                alt={attachment.name}
                                className="max-h-64 max-w-full rounded-lg object-contain"
                            />
                            {message.text ? <p className="whitespace-pre-wrap break-words">{message.text}</p> : null}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 rounded-lg bg-black/10 dark:bg-white/10 px-3 py-4 min-h-[80px]">
                                <span className="text-sm opacity-80">Sending image…</span>
                            </div>
                            {message.text ? <p className="whitespace-pre-wrap break-words text-sm opacity-90">{message.text}</p> : null}
                        </div>
                    )
                ) : attachment?.url ? (
                    <div className="space-y-1">
                        <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-current/20 bg-black/5 px-3 py-2 text-sm hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
                        >
                            <FileIcon size={18} />
                            <span className="truncate max-w-[180px]">{attachment.name}</span>
                        </a>
                        {message.text ? <p className="whitespace-pre-wrap break-words">{message.text}</p> : null}
                    </div>
                ) : attachment?.name && !attachment?.url ? (
                    <div className="flex items-center gap-2 rounded-lg bg-black/10 dark:bg-white/10 px-3 py-2 text-sm opacity-80">
                        <FileIcon size={18} />
                        <span className="truncate max-w-[180px]">{attachment.name}</span>
                        <span>…</span>
                    </div>
                ) : (
                    message.text ? <p className="whitespace-pre-wrap break-words">{message.text}</p> : null
                )}

                <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isOwn ? "text-white/70" : "text-[var(--muted)]/70"}`}>
                    <span>{time}</span>
                    {isOwn && status === "sent" && <Check size={12} />}
                    {isOwn && status === "delivered" && <CheckCheck size={12} className="opacity-70" />}
                    {isOwn && status === "read" && <CheckCheck size={12} className="text-[#34B7F1]" />}
                </div>
            </div>
        </div>
    );
}
