import { Paperclip, Smile, Send, X, FileIcon } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const ACCEPT_ATTACHMENTS = "image/*,.pdf,.doc,.docx";
const MAX_FILE_SIZE_MB = 10;

function isImageFile(file: File): boolean {
    return file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|svg|ico|tiff?|heic|avif)$/i.test(file.name);
}

type MessageInputProps = {
    onSend: (text: string, file?: File) => void;
    onTyping: (isTyping: boolean) => void;
    disabled: boolean;
    placeholder?: string;
};

export function MessageInput({
    onSend,
    onTyping,
    disabled,
    placeholder = "Type a message...",
}: MessageInputProps) {
    const [text, setText] = useState("");
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        };
    }, [imagePreviewUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        onTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return;
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(null);
        }
        setAttachedFile(file);
        if (isImageFile(file)) {
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearAttachment = () => {
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(null);
        }
        setAttachedFile(null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (disabled) return;
        const trimmed = text.trim();
        if (!trimmed && !attachedFile) return;

        onSend(trimmed || "", attachedFile ?? undefined);
        setText("");
        clearAttachment();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        onTyping(false);
    };

    const canSend = (text.trim().length > 0 || attachedFile !== null) && !disabled;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 bg-[var(--card)] px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-sm)] md:gap-3 md:px-6 md:py-4 border-t border-[var(--card-border)] shrink-0 z-20"
        >
            {attachedFile && (
                <div className="flex flex-col gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] p-2">
                    <div className="flex items-center gap-2">
                        {imagePreviewUrl ? (
                            <div className="relative shrink-0">
                                <img
                                    src={imagePreviewUrl}
                                    alt={attachedFile.name}
                                    className="h-16 w-16 rounded-lg object-cover border border-[var(--card-border)]"
                                />
                                <button
                                    type="button"
                                    onClick={clearAttachment}
                                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--card)] border border-[var(--card-border)] text-[var(--muted)] shadow hover:bg-[var(--destructive)] hover:text-white hover:border-[var(--destructive)]"
                                    aria-label="Remove image"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <FileIcon className="shrink-0 text-[var(--muted)]" size={20} />
                        )}
                        <span className="truncate flex-1 text-sm text-[var(--foreground)]" title={attachedFile.name}>
                            {attachedFile.name}
                        </span>
                        {!imagePreviewUrl && (
                            <button
                                type="button"
                                onClick={clearAttachment}
                                className="shrink-0 rounded p-1 text-[var(--muted)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
                                aria-label="Remove attachment"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    {imagePreviewUrl && (
                        <p className="text-[10px] text-[var(--muted)]">Bucket: chat-attachments</p>
                    )}
                </div>
            )}
            <div className="flex items-center gap-2 md:gap-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_ATTACHMENTS}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--background)] transition flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    disabled={disabled}
                    aria-label="Attach file"
                >
                    <Paperclip size={24} />
                </button>

                <div className="relative flex-1">
                    <input
                        type="text"
                        value={text}
                        onChange={handleChange}
                        disabled={disabled}
                        placeholder={placeholder}
                        className="w-full rounded-full border border-[var(--card-border)] bg-[var(--input-bg)] py-3 pl-4 pr-12 text-[var(--foreground)] outline-none focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)] transition shadow-inner"
                    />
                    <button
                        type="button"
                        className="absolute right-1 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] transition rounded-full"
                        disabled={disabled}
                    >
                        <Smile size={24} />
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={!canSend}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-md transition hover:bg-[var(--primary-hover)] disabled:opacity-50 hover:scale-105 active:scale-95"
                >
                    <Send size={20} className="ml-1" />
                </button>
            </div>
        </form>
    );
}
