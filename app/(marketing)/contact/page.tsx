import { Mail, MessageCircle, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12 sm:py-24 max-w-4xl">
            <div className="flex flex-col items-center text-center mb-16">
                <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                    <MessageCircle size={32} />
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-balance break-words">Get in touch with us.</h1>
                <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl text-balance">
                    Have questions or feedback? We'd love to hear from you. Our team typically responds within 24 hours.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Contact Form */}
                <div className="bg-[var(--card)] p-8 rounded-[40px] border border-[var(--card-border)] shadow-sm">
                    <form className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--muted)] ml-1 uppercase">Name</label>
                                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[var(--primary)] focus:bg-white focus:outline-none transition text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--muted)] ml-1 uppercase">Email</label>
                                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[var(--primary)] focus:bg-white focus:outline-none transition text-sm" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--muted)] ml-1 uppercase">Subject</label>
                            <select className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[var(--primary)] focus:bg-white focus:outline-none transition text-sm">
                                <option>General Inquiry</option>
                                <option>Technical Support</option>
                                <option>Partnership</option>
                                <option>Billing Issue</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--muted)] ml-1 uppercase">Message</label>
                            <textarea rows={4} placeholder="How can we help?" className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[var(--primary)] focus:bg-white focus:outline-none transition text-sm resize-none" />
                        </div>
                        <button type="submit" className="w-full py-4 rounded-full bg-[var(--primary)] text-white font-bold flex items-center justify-center gap-2 hover:bg-[var(--primary-hover)] transition shadow-lg shadow-[var(--primary)]/20">
                            Send Message <Send size={18} />
                        </button>
                    </form>
                </div>

                {/* Info */}
                <div className="space-y-8 py-4">
                    <div className="flex gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 shrink-0">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold mb-1">Email us</h4>
                            <p className="text-sm text-[var(--muted)] mb-1">Our support team is always ready to help.</p>
                            <a href="mailto:support@realchatsapp.com" className="text-sm font-bold text-[var(--primary)] hover:underline">support@realchatsapp.com</a>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold mb-1">Visit us</h4>
                            <p className="text-sm text-[var(--muted)] mb-1">Stop by our office for a chat.</p>
                            <p className="text-sm font-bold">123 Innovation Street, Tech Hub, SF 94103</p>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold mb-1">Call us</h4>
                            <p className="text-sm text-[var(--muted)] mb-1">Mon-Fri from 9am to 6pm PST.</p>
                            <p className="text-sm font-bold">+1 (555) 000-0000</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
