import { useEffect, useRef, ReactNode, useState } from 'react';
import emailjs from '@emailjs/browser';

// ============================================
// EmailJS Configuration
// ============================================
// These values should be stored in environment variables:
// VITE_EMAILJS_SERVICE_ID - Your EmailJS service ID
// VITE_EMAILJS_TEMPLATE_ID - Your EmailJS template ID  
// VITE_EMAILJS_PUBLIC_KEY - Your EmailJS public key

const VITE_EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const VITE_EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const VITE_EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// ============================================
// XP Modal Base Component
// ============================================
interface XPModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    width?: string;
}

export const XPModal = ({
    isOpen,
    onClose,
    title,
    children,
    width = '340px',
}: XPModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Handle click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-[fadeIn_150ms_ease-out]"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                style={{ width }}
                className="xp-modal-window animate-[slideUp_200ms_ease-out]"
            >
                {/* XP Title Bar */}
                <div className="xp-title-bar flex items-center justify-between px-2 py-1 rounded-t-[4px]">
                    <div className="flex items-center gap-2">
                        <img
                            src="/xp-menu-icon.png"
                            alt=""
                            className="w-4 h-4"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <span className="text-white text-[11px] font-bold drop-shadow-[0_1px_0_rgba(0,0,0,0.3)]">
                            {title}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="xp-close text-white w-[21px] h-[21px] flex items-center justify-center text-xs font-bold"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Content */}
                <div className="xp-modal-content bg-[hsl(60,33%,96%)] dark:bg-[hsl(220,15%,18%)] p-4 rounded-b-[4px] border border-t-0 border-[rgb(180,180,180)] dark:border-[hsl(220,15%,30%)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ============================================
// Help Modal - Contact Form with EmailJS
// ============================================
interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SendStatus = 'idle' | 'sending' | 'success' | 'error';

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [senderName, setSenderName] = useState('');
    const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const resetForm = () => {
        setEmail('');
        setMessage('');
        setSenderName('');
        setSendStatus('idle');
        setErrorMessage('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate EmailJS configuration
        if (!VITE_EMAILJS_SERVICE_ID || !VITE_EMAILJS_TEMPLATE_ID || !VITE_EMAILJS_PUBLIC_KEY) {
            setErrorMessage('EmailJS is not configured. Please add your credentials to .env file.');
            setSendStatus('error');
            return;
        }

        setSendStatus('sending');
        setErrorMessage('');

        try {
            // Send email using EmailJS
            await emailjs.send(
                VITE_EMAILJS_SERVICE_ID,
                VITE_EMAILJS_TEMPLATE_ID,
                {
                    title: 'New Contact from Portfolio',
                    name: senderName || 'Anonymous',
                    time: new Date().toLocaleString(),
                    message: message,
                    email: email,
                },
                VITE_EMAILJS_PUBLIC_KEY
            );

            setSendStatus('success');

            // Auto-close after success
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (error) {
            console.error('EmailJS Error:', error);
            setErrorMessage('Failed to send message. Please try again.');
            setSendStatus('error');
        }
    };

    return (
        <XPModal isOpen={isOpen} onClose={handleClose} title="Help & Contact">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Success Message */}
                {sendStatus === 'success' && (
                    <div className="bg-[hsl(120,60%,90%)] dark:bg-[hsl(120,40%,20%)] border border-[hsl(120,60%,40%)] rounded p-2 text-center">
                        <span className="text-[11px] text-[hsl(120,60%,25%)] dark:text-[hsl(120,60%,70%)]">
                            ✅ Message sent successfully! I'll get back to you soon.
                        </span>
                    </div>
                )}

                {/* Error Message */}
                {sendStatus === 'error' && errorMessage && (
                    <div className="bg-[hsl(0,70%,95%)] dark:bg-[hsl(0,50%,20%)] border border-[hsl(0,70%,50%)] rounded p-2">
                        <span className="text-[11px] text-[hsl(0,70%,40%)] dark:text-[hsl(0,70%,70%)]">
                            ❌ {errorMessage}
                        </span>
                    </div>
                )}

                {sendStatus !== 'success' && (
                    <>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-black dark:text-[hsl(210,20%,95%)]">
                                Your Name (optional)
                            </label>
                            <input
                                type="text"
                                name="from_name"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                placeholder="John Doe"
                                className="xp-input"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-black dark:text-[hsl(210,20%,95%)]">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="from_email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your@email.com"
                                className="xp-input"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-black dark:text-[hsl(210,20%,95%)]">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                placeholder="How can I help you?"
                                rows={4}
                                className="xp-input resize-none"
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="xp-button px-4 py-1"
                                disabled={sendStatus === 'sending'}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={sendStatus === 'sending'}
                                className="xp-button px-4 py-1 bg-gradient-to-b from-[hsl(206,80%,60%)] to-[hsl(206,80%,50%)] text-white border-[hsl(206,100%,25%)] disabled:opacity-50"
                            >
                                {sendStatus === 'sending' ? '⏳ Sending...' : '📨 Send Help'}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </XPModal>
    );
};

// ============================================
// Tools Modal - Tech Stack List
// ============================================
interface ToolsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const techStack = [
    { name: 'React', icon: '⚛️', description: 'UI Library' },
    { name: 'TypeScript', icon: '🔷', description: 'Type-safe JavaScript' },
    { name: 'Vite', icon: '⚡', description: 'Build Tool' },
    { name: 'TailwindCSS', icon: '🎨', description: 'Utility-first CSS' },
    { name: 'Appwrite', icon: '☁️', description: 'Backend as a Service' },
    { name: 'Shadcn UI', icon: '🧩', description: 'Component Library' },
    { name: 'Custom XP/WP UI System', icon: '🪟', description: 'Nostalgic Design' },
];

export const ToolsModal = ({ isOpen, onClose }: ToolsModalProps) => {
    return (
        <XPModal isOpen={isOpen} onClose={onClose} title="Tools & Technologies" width="360px">
            <div className="flex flex-col gap-1">
                <p className="text-[11px] text-[hsl(0,0%,30%)] dark:text-[hsl(215,15%,60%)] mb-2">
                    Built with modern technologies:
                </p>
                <div className="xp-list-container">
                    {techStack.map((tech, index) => (
                        <div
                            key={tech.name}
                            className="xp-list-item"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <span className="text-base mr-2">{tech.icon}</span>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-black dark:text-[hsl(210,20%,95%)]">
                                    {tech.name}
                                </span>
                                <span className="text-[10px] text-[hsl(0,0%,40%)] dark:text-[hsl(215,15%,55%)]">
                                    {tech.description}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </XPModal>
    );
};

// ============================================
// Favorites Modal - Hobbies List
// ============================================
interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const hobbies = [
    { name: 'Playing Guitar', icon: '🎵', color: 'hsl(280, 70%, 50%)' },
];

export const FavoritesModal = ({ isOpen, onClose }: FavoritesModalProps) => {
    return (
        <XPModal isOpen={isOpen} onClose={onClose} title="Favorites & Hobbies" width="320px">
            <div className="flex flex-col gap-1">
                <p className="text-[11px] text-[hsl(0,0%,30%)] dark:text-[hsl(215,15%,60%)] mb-2">
                    Things I'm passionate about:
                </p>
                <div className="xp-list-container">
                    {hobbies.map((hobby, index) => (
                        <div
                            key={hobby.name}
                            className="xp-list-item group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div
                                className="w-6 h-6 rounded-sm flex items-center justify-center mr-2 text-white text-sm"
                                style={{ backgroundColor: hobby.color }}
                            >
                                {hobby.icon}
                            </div>
                            <span className="text-[11px] font-medium text-black dark:text-[hsl(210,20%,95%)] group-hover:text-[hsl(206,100%,40%)] dark:group-hover:text-[hsl(206,100%,60%)] transition-colors">
                                {hobby.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </XPModal>
    );
};
