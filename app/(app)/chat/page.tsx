"use client";

import { useAuth } from "@/lib/auth-context";
import { useChat, getDmChannelName, MAIN_CHAT_CHANNEL } from "@/hooks/useChat";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { Conversation, PresenceUser } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, Fragment } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Menu, X } from "lucide-react";

const getDateLabel = (timestamp?: string) => {
  if (!timestamp) return "Today";
  const date = new Date(timestamp);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
};

export default function ChatPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [conversation, setConversation] = useState<Conversation>({ type: "main" });
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar hidden by default per requirements
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [user, loading, router]);

  const userName = user?.profile?.name ?? user?.email ?? "Anonymous";
  const chatChannel =
    conversation.type === "main"
      ? MAIN_CHAT_CHANNEL
      : getDmChannelName(user?.id ?? "", conversation.otherUser.userId);

  const {
    messages,
    onlineUsers,
    knownUsers,
    typingUsers,
    connectionState,
    chatChannelReady,
    sendMessage,
    sendTypingEvent,
    addKnownUser,
    sendError,
  } = useChat(user?.id ?? "", userName, chatChannel);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectMain = useCallback(() => {
    setConversation({ type: "main" });
    setSidebarOpen(false);
  }, []);

  const handleSelectUser = useCallback((other: PresenceUser) => {
    setConversation({ type: "dm", otherUser: other });
    setSidebarOpen(false);
  }, []);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50/60 to-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--card-border)] border-t-[var(--primary)] text-[var(--primary)]" />
          <p className="text-sm font-medium text-[var(--muted)]">Initializing Workspace…</p>
        </div>
      </div>
    );
  }

  const conversationTitle =
    conversation.type === "main" ? "Main Room" : conversation.otherUser.name;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[var(--background)] relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - becomes the main view on mobile if sidebarOpen is true */}
      <div
        className={`absolute md:relative z-50 h-full w-full md:w-auto transform transition-transform duration-300 shadow-xl md:shadow-none ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <ChatSidebar
          activeType={conversation.type}
          activeUserId={conversation.type === "dm" ? conversation.otherUser.userId : undefined}
          onlineUsers={onlineUsers}
          knownUsers={knownUsers}
          onSelectMain={handleSelectMain}
          onSelectUser={handleSelectUser}
          onAddKnownUser={addKnownUser}
          currentUserId={user.id}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area - hide on mobile if sidebar is open */}
      <main className={`flex flex-1 flex-col h-full w-full relative ${sidebarOpen ? "hidden md:flex" : "flex"}`}>
        {/* Mobile Sidebar Toggle (only shows if sidebar is NOT already open) */}
        {!sidebarOpen && (
          <div className="absolute top-4 left-4 z-20 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-full bg-[var(--card)] border border-[var(--card-border)] shadow-sm text-[var(--muted)] hover:text-[var(--primary)]"
            >
              <Menu size={20} />
            </button>
          </div>
        )}

        <ChatHeader
          title={conversationTitle}
          isMainRoom={conversation.type === "main"}
          onlineCount={onlineUsers.length}
          connectionState={connectionState}
          onSignOut={() => signOut().then(() => router.replace("/auth"))}
          onBack={() => setSidebarOpen(true)} // Toggle sidebar back open on mobile
          typingUsers={typingUsers}
          otherUser={conversation.type === "dm" ? conversation.otherUser : undefined}
          onlineUsers={onlineUsers}
        />

        {/* Message Error Dialog */}
        {sendError && (
          <div className="bg-red-50 p-2 text-center text-xs font-semibold text-red-600 shadow-sm z-10 w-full animate-pulse border-b border-red-200">
            {sendError}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-7 custom-scrollbar bg-[url('/chat-bg.svg')] bg-[length:400px_400px]">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-white shadow-xl flex justify-center items-center mb-8 animate-bounce-subtle">
                <Image src="/logo.png" alt="RealChatsApp" fill className="object-cover" sizes="96px" />
              </div>
              <p className="text-2xl font-black text-[var(--foreground)] mb-3">
                Say Hello!
              </p>
              <p className="max-w-xs text-sm text-[var(--muted)]">
                {conversation.type === "main"
                  ? "Welcome to the Main room. Connect with others securely via WebSockets."
                  : `Start the conversation securely with ${conversationTitle}. Messages appear instantly.`}
              </p>
            </div>
          ) : (
            <div className="flex flex-col w-full mx-auto max-w-4xl pt-8 space-y-2">
              {messages.map((msg, idx) => {
                const isOwn = msg.meta?.senderId === user.id;

                // Group messages by contiguous sender and time (for avatar)
                const showAvatar =
                  !isOwn &&
                  (idx === 0 || messages[idx - 1]?.meta?.senderId !== msg.meta?.senderId);

                const currentDateLabel = msg.meta?.timestamp ? getDateLabel(msg.meta.timestamp) : "Today";
                const prevDateLabel = idx > 0 && messages[idx - 1]?.meta?.timestamp ? getDateLabel(messages[idx - 1].meta!.timestamp!) : null;

                const showDateDivider = idx === 0 || currentDateLabel !== prevDateLabel;

                return (
                  <Fragment key={msg.meta?.messageId || idx}>
                    {showDateDivider && (
                      <div className="text-center w-full self-center py-2 my-4 opacity-80">
                        <span className="bg-[var(--card)] px-3 py-1 text-xs rounded-full border border-[var(--card-border)] font-semibold shadow-sm text-[var(--muted)]">
                          {currentDateLabel}
                        </span>
                      </div>
                    )}
                    <MessageBubble
                      message={msg}
                      isOwn={isOwn}
                      showAvatar={showAvatar}
                    />
                  </Fragment>
                );
              })}
              <div ref={messagesEndRef} className="h-4 w-full" />
            </div>
          )}
        </div>

        <MessageInput
          onSend={(text, file) => sendMessage(text, file)}
          onTyping={sendTypingEvent}
          disabled={connectionState !== "connected" || !chatChannelReady}
          placeholder={
            !chatChannelReady
              ? "Connecting to chat..."
              : "Type a message..."
          }
        />
      </main>
    </div>
  );
}
