import { Info, Target, Users, Sparkles } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 sm:py-24 max-w-4xl">
            {/* Header section */}
            <div className="flex flex-col items-center text-center mb-16">
                <div className="h-16 w-16 rounded-3xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-6 border border-sky-500/20">
                    <Info size={32} />
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-balance break-words">About RealChatsApp</h1>
                <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-2xl text-balance">
                    We're on a mission to redefine how teams and individuals connect in the modern era.
                </p>
            </div>

            <div className="space-y-12">
                <section className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-sky-50 rounded-2xl text-sky-500">
                            <Target size={24} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold">Our Infrastructure Mission</h2>
                    </div>
                    <p className="text-[var(--muted)] leading-relaxed mb-6">
                        **RealChatsApp** was born from a simple observation: real-time communication should be instantaneous, secure, and beautiful, without requiring complex server management. By leveraging the serverless power of **InsForge**, we've built a platform that scales with you while maintaining a zero-latency experience.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <h4 className="font-bold mb-2 flex items-center gap-2">
                                <Sparkles size={18} className="text-amber-500" />
                                Premium UX
                            </h4>
                            <p className="text-sm text-[var(--muted)]">Every interaction is designed to feel fluid, from typing indicators to smooth message transitions.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <h4 className="font-bold mb-2 flex items-center gap-2">
                                <Users size={18} className="text-[var(--primary)]" />
                                Human-Centric
                            </h4>
                            <p className="text-sm text-[var(--muted)]">We prioritize clarity and ease of use, ensuring that the technology never gets in the way of the conversation.</p>
                        </div>
                    </div>
                </section>

                <section className="prose prose-slate max-w-none text-center pb-12">
                    <h3 className="text-2xl font-bold mb-6 italic text-[var(--foreground)]">"Communication is the heart of every great idea."</h3>
                    <p className="text-[var(--muted)] max-w-2xl mx-auto italic leading-relaxed">
                        We built RealChatsApp not just as a tool, but as a digital space where ideas can flow freely, securely, and instantly. Whether you're coordinating a global team or just saying hello, we're proud to be part of your connection.
                    </p>
                </section>
            </div>

            <div className="mt-16 text-center text-[var(--muted)] text-xs border-t border-[var(--card-border)] pt-8">
                © {new Date().getFullYear()} RealChatsApp. Developed by Surag Dev Studio.
            </div>
        </div>
    );
}

