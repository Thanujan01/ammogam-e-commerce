import { Menu, Bell, User } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

interface HeaderProps {
    onMenuClick: () => void;
}

export function SellerHeader({ onMenuClick }: HeaderProps) {
    const auth = useContext(AuthContext);

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 hidden sm:block">
                    Seller Account Approved
                </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{auth?.user?.name}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{auth?.user?.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <User className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    );
}
