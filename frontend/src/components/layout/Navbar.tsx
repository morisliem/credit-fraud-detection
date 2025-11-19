import { Link, useLocation } from "react-router-dom";

export function NavBar() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <header className="w-full border-b border-slate-800 bg-[#050608]/95 backdrop-blur">
            <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

                {/* Left Section */}
                <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-widest text-slate-500">
                        Doc Fraud Platform
                    </span>

                    <div className="flex gap-4 text-sm mt-1">
                        <Link
                            to="/documents"
                            className={
                                `hover:text-blue-300 ${isActive('/documents')
                                    ? 'text-slate-100 font-semibold'
                                    : 'text-slate-400'}`
                            }
                        >
                            Documents
                        </Link>
                    </div>
                </div>

                {/* Right Section — reserved for future (user, env, etc.) */}
                <div className="text-xs text-slate-500">
                    {/* Example placeholder: Local */}
                </div>

            </nav>
        </header>
    );
}