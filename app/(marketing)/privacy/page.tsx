import { Shield, Lock, EyeOff, Server, MessageSquare, Database } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 sm:py-24 max-w-4xl">
            {/* Header section */}
            <div className="flex flex-col items-center text-center mb-16">
                <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                    <Shield size={32} />
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-balance break-words">Privacy Policy</h1>
                <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl text-balance">
                    At RealChatsApp, your privacy is not an afterthought—it's the foundation of everything we build.
                </p>
            </div>

            <div className="space-y-12">
                <section className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-sky-50 rounded-2xl text-[var(--primary)]">
                            <Lock size={24} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold">Data Protection Commitment</h2>
                    </div>
                    <p className="text-[var(--muted)] leading-relaxed mb-4">
                        We utilize enterprise-grade encryption and security protocols to ensure your data stays yours. Our backend infrastructure is built on **InsForge**, which provides robust isolation for all user data.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <li className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Database className="text-[var(--primary)] shrink-0 mt-1" size={18} />
                            <div>
                                <h4 className="font-bold text-sm">Row-Level Security (RLS)</h4>
                                <p className="text-xs text-[var(--muted)]">Our database enforces strict boundaries. No user can ever access data belonging to another user.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Server className="text-indigo-500 shrink-0 mt-1" size={18} />
                            <div>
                                <h4 className="font-bold text-sm">Encrypted WebSockets</h4>
                                <p className="text-xs text-[var(--muted)]">All real-time communications are transmitted over secure WSS (WebSocket Secure) channels.</p>
                            </div>
                        </li>
                    </ul>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <MessageSquare className="text-[var(--primary)]" size={20} />
                            Message Data
                        </h3>
                        <p className="text-[var(--muted)] text-sm leading-relaxed">
                            Messages are stored in our secure database to provide you with seamless history across devices. We do not use your message content for advertising or profile building. Your conversations are yours alone.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <EyeOff className="text-emerald-500" size={20} />
                            Anonymity & Discovery
                        </h3>
                        <p className="text-[var(--muted)] text-sm leading-relaxed">
                            We have implemented strict discovery rules. Users cannot scan the database for partial matches. To find someone, you must know their exact username, preventing potential misuse of our directory.
                        </p>
                    </section>
                </div>

                <hr className="border-[var(--card-border)]" />

                <section className="prose prose-slate max-w-none">
                    <h3 className="text-xl font-bold mb-4">Information We Collect</h3>
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-6">
                        To provide the RealChatsApp service, we collect minimal necessary information:
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-sm text-[var(--muted)]">
                        <li><strong>Account Information:</strong> Email address and display name used to create your profile.</li>
                        <li><strong>Authentication Data:</strong> Securely hashed credentials managed via our core auth provider.</li>
                        <li><strong>Presence Data:</strong> Real-time online/offline status shared only with those you are connected with.</li>
                        <li><strong>Messages:</strong> Encrypted message content and metadata (timestamps, delivery status).</li>
                    </ul>
                </section>

                <section className="bg-slate-900 text-white p-8 rounded-3xl">
                    <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                        <div className="max-w-md">
                            <h3 className="text-xl font-bold mb-2">Our Privacy Promise</h3>
                            <p className="text-slate-400 text-sm">We will never sell your personal information to third parties. Your data is handled with the highest level of care and technical security.</p>
                        </div>
                        <div className="text-emerald-400 font-mono text-xs p-4 bg-emerald-400/10 rounded-2xl border border-emerald-400/20">
                            v2.1.0 // TRUST_VERIFIED
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-16 text-center text-[var(--muted)] text-xs border-t border-[var(--card-border)] pt-8">
                © {new Date().getFullYear()} RealChatsApp. Developed by Surag Dev Studio.
            </div>
        </div>
    );
}

