import type { ReactNode } from "react";
import { NavBar } from "./Navbar";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-[#050608] text-slate-100 flex flex-col">
            <NavBar />
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
                {children}
            </main>
        </div>
    );
}