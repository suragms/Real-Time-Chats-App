"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--card-border)] bg-[var(--card)]/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
                    <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                        <Image
                            src="/logo.png"
                            alt="RealChatsApp Logo"
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    </div>
                    <span className="text-base sm:text-lg font-bold tracking-tight text-[var(--foreground)] truncate max-w-[120px] sm:max-w-none">RealChatsApp</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/features" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Features</Link>
                    <Link href="/about" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">About</Link>
                    <Link href="/privacy" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Privacy</Link>
                    <Link href="/terms" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Terms</Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/auth" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                        Log in
                    </Link>
                    <Link
                        href="/auth"
                        className="inline-flex items-center justify-center rounded-[var(--radius)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-colors hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden items-center gap-3">
                    <Link
                        href="/auth"
                        className="inline-flex items-center justify-center rounded-[var(--radius)] bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] shadow-sm transition-colors hover:bg-[var(--primary-hover)]"
                    >
                        Get Started
                    </Link>
                    <button
                        onClick={toggleMenu}
                        className="text-[var(--muted)] hover:text-[var(--foreground)] p-1 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-[var(--card-border)] bg-[var(--card)] px-4 py-8 shadow-2xl animate-in slide-in-from-top-2 overflow-y-auto max-h-[calc(100vh-64px)]">
                    <nav className="flex flex-col gap-8 pb-10">
                        {/* Product Section */}
                        <div>
                            <p className="text-[10px] font-black tracking-widest text-[var(--muted)] uppercase mb-4 px-1">Product</p>
                            <div className="flex flex-col gap-3">
                                <Link onClick={toggleMenu} href="/features" className="block text-base font-bold text-[var(--foreground)] px-1 hover:text-[var(--primary)]">Features</Link>
                                <Link onClick={toggleMenu} href="/pricing" className="block text-base font-bold text-[var(--foreground)] px-1 hover:text-[var(--primary)]">Pricing</Link>
                                <Link onClick={toggleMenu} href="/download" className="block text-base font-bold text-[var(--foreground)] px-1 hover:text-[var(--primary)]">Download</Link>
                                <Link onClick={toggleMenu} href="/about" className="block text-base font-bold text-[var(--foreground)] px-1 hover:text-[var(--primary)]">About Us</Link>
                            </div>
                        </div>

                        {/* Legal Section */}
                        <div>
                            <p className="text-[10px] font-black tracking-widest text-[var(--muted)] uppercase mb-4 px-1">Legal & Support</p>
                            <div className="flex flex-col gap-3">
                                <Link onClick={toggleMenu} href="/privacy" className="block text-base font-medium text-[var(--muted)] px-1">Privacy Policy</Link>
                                <Link onClick={toggleMenu} href="/terms" className="block text-base font-medium text-[var(--muted)] px-1 border-t border-[var(--card-border)] pt-3 mt-1">Terms of Service</Link>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link onClick={toggleMenu} href="/auth" className="flex items-center justify-center w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-bold shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-transform">
                                Log in to RealChatsApp
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
