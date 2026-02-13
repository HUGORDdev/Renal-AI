"use client";

import React from 'react';
import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Accueil', path: '/' },
        { name: 'Notre IA', path: '/predict' },
        { name: 'Cartographie', path: '/map' },
    ];

    return (
        <nav className="border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-xl z-50 w-full shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="bg-blue-100 p-2 rounded-xl">
                        <BrainCircuit className="w-6 h-6" style={{ color: '#2563eb' }} />
                    </div>
                    <h1 className="text-xl font-black font-outfit tracking-tight" style={{ color: '#0f172a' }}>
                        Rénal AI
                    </h1>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-bold">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={cn(
                                "transition-colors hover:text-blue-600",
                                pathname === link.path ? "text-blue-600" : "text-slate-600"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <Link
                    href="/predict"
                    className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                >
                    Accès Pro
                </Link>
            </div>
        </nav>
    );
}
