"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  Settings,
  PlusCircle,
  BrainCircuit,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Diagnostic IA', icon: Stethoscope, path: '/predict' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar border-r border-border h-screen sticky top-0 flex flex-col pt-8 pb-8">
      <div className="px-6 mb-10 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-primary/10 p-2 rounded-xl">
            <BrainCircuit className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black font-outfit text-foreground tracking-tight">Rénal AI</h1>
            <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Aide au Diagnostic</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative text-muted hover:bg-gray-50 hover:text-foreground mb-4",
          )}
        >
          <Home size={20} className="text-muted group-hover:text-primary transition-colors" />
          <span className="text-sm font-medium">Accueil Public</span>
        </Link>

        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/5 text-primary font-bold"
                  : "text-muted hover:bg-gray-50 hover:text-foreground"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-primary" : "text-muted group-hover:text-primary transition-colors")} />
              <span className="text-sm font-medium">{item.name}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-6">
        <Link
          href="/predict"
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <PlusCircle size={18} />
          <span>Nouveau Diagnostic</span>
        </Link>
      </div>
    </aside>
  );
}
