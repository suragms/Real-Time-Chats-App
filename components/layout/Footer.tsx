import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-[var(--card-border)] bg-[var(--card)] py-8 sm:py-12">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4 lg:gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm transition-transform group-hover:scale-110">
                                <Image
                                    src="/logo.png"
                                    alt="RealChatsApp Logo"
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">RealChatsApp</span>
                        </Link>
                        <p className="max-w-xs text-sm text-[var(--muted)] leading-relaxed">
                            The real-time messaging platform built for modern teams and communities. Fast, secure, and beautiful.
                        </p>
                        <div className="mt-6 flex items-center gap-4 text-[var(--muted)]">
                            <a href="https://x.com/surag_sunil" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] transition-colors"><Twitter size={20} /></a>
                            <a href="https://www.instagram.com/surag_sunil" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] transition-colors"><Instagram size={20} /></a>
                            <a href="http://linkedin.com/in/suragsunil" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-4 text-xs font-black tracking-widest text-[var(--foreground)] uppercase">Product</h3>
                        <ul className="space-y-3 text-sm text-[var(--muted)]">
                            <li><Link href="/features" className="hover:text-[var(--primary)] transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-[var(--primary)] transition-colors">Pricing</Link></li>
                            <li><Link href="/download" className="hover:text-[var(--primary)] transition-colors">Download Apps</Link></li>
                            <li><Link href="/about" className="hover:text-[var(--primary)] transition-colors">About Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-xs font-black tracking-widest text-[var(--foreground)] uppercase">Legal & Support</h3>
                        <ul className="space-y-3 text-sm text-[var(--muted)]">
                            <li><Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-[var(--primary)] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 sm:mt-12 border-t border-[var(--card-border)] pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row text-sm text-[var(--muted)] text-center sm:text-left">
                    <p>© {new Date().getFullYear()} RealChatsApp Inc. All rights reserved. | Developed by Surag Dev Studio</p>
                    <div className="flex space-x-4">
                        <span>Built with Next.js & InsForge</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
