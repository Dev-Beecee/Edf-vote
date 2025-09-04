import { ChevronLeft, ChevronRight, Users, Mail, Settings, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
    onLogout: () => void;
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

export default function Sidebar({ onLogout, collapsed, setCollapsed }: SidebarProps) {
    const menuItems = [
        { label: "Dashboard", href: "/ghost-dashboard", icon: LayoutDashboard },
        { label: "Inscriptions", href: "/ghost-dashboard/inscriptions", icon: Users },
        { label: "Participations", href: "/ghost-dashboard/participations", icon: Mail },
    ];

    return (
        <aside
            className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed top-0 left-0 transition-all duration-300 ease-in-out p-4 flex flex-col justify-between ${collapsed ? "w-20" : "w-64"
                }`}
        >
            <div>
                <div className="flex items-center justify-between mb-8">
                    <Image src="/Rubeez.svg" alt="Logo Rubeez" width={24} height={24} />
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex flex-col gap-4">
                    {menuItems.map(({ label, href, icon: Icon }) => (
                        <Link
                            key={label}
                            href={href}
                            className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <Icon size={20} />
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>

            <button
                onClick={onLogout}
                className="flex items-center gap-3 mt-8 text-red-600 hover:text-red-800"
            >
                <LogOut size={20} />
                {!collapsed && <span>Déconnexion</span>}
            </button>
        </aside>
    );
}
