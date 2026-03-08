import { Zap, MessageSquare, CheckCheck, UserCheck, Smartphone, Search, Cpu, Workflow } from "lucide-react";

export default function FeaturesPage() {
    const features = [
        {
            icon: <Zap className="text-amber-500" />,
            title: "Real-time Messaging",
            description: "Powered by enterprise-grade WebSocket infrastructure, messages are delivered in sub-milliseconds. No polling, no delay, just instant connection."
        },
        {
            icon: <Workflow className="text-blue-500" />,
            title: "Typing Indicators",
            description: "Experience the fluid feel of active conversation with real-time feedback as others compose their messages."
        },
        {
            icon: <CheckCheck className="text-emerald-500" />,
            title: "Rich Status Receipts",
            description: "Know exactly when your message is sent, delivered, and read. Beautiful blue ticks keep you in the loop effortlessly."
        },
        {
            icon: <UserCheck className="text-indigo-500" />,
            title: "Live Presence",
            description: "Dynamic online and offline status tracking using efficient heartbeat signals. See who is available instantly."
        },
        {
            icon: <Smartphone className="text-slate-500" />,
            title: "Progressive Web-App",
            description: "Designed with a mobile-first philosophy. Enjoy a premium, app-like experience on any device, anywhere."
        },
        {
            icon: <Search className="text-[var(--primary)]" />,
            title: "Global Discovery",
            description: "Our secure discovery mechanism allows you to find friends globally using exact username matching, ensuring privacy while enabling connection."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12 sm:py-24 max-w-5xl">
            {/* Header section */}
            <div className="flex flex-col items-center text-center mb-16">
                <div className="h-16 w-16 rounded-3xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-6 border border-[var(--primary)]/20">
                    <Cpu size={32} />
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-balance break-words">The technology behind the connection.</h1>
                <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl text-balance">
                    RealChatsApp is built on a high-performance, serverless architecture designed for modern scale and security.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                {features.map((feature, idx) => (
                    <div key={idx} className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--card-border)] shadow-sm hover:shadow-md transition-all group">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>

            <section className="bg-slate-900 rounded-[40px] p-12 text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-black mb-6">Designed for Developers.</h2>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="h-2 w-2 rounded-full bg-[var(--primary)]"></div>
                                Built with Next.js 15+ App Router
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                Real-time events by InsForge
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="h-2 w-2 rounded-full bg-sky-400"></div>
                                Fully typed with TypeScript
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                                PostgREST database architecture
                            </li>
                        </ul>
                    </div>
                    <div className="md:w-1/2 bg-slate-800/50 p-6 rounded-2xl border border-white/5 font-mono text-xs text-sky-400">
                        <pre className="overflow-auto max-w-full">
                            {`const chat = useChat(userId);

// Listen to incoming messages
chat.onMessage((msg) => {
  displayNotification(msg);
});

// Send with read status
await chat.send("Hello World");`}
                        </pre>
                    </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[var(--primary)]/20 blur-[120px] rounded-full"></div>
            </section>

            <div className="mt-20 text-center text-[var(--muted)] text-xs border-t border-[var(--card-border)] pt-8">
                © {new Date().getFullYear()} RealChatsApp. Developed by Surag Dev Studio.
            </div>
        </div>
    );
}

