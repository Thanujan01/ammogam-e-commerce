import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, LogOut, User, X, Bell } from "lucide-react";
import { cn } from "../../libs/utils";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navigation = [
    { name: "Dashboard", href: "/seller", icon: LayoutDashboard },
    { name: "My Products", href: "/seller/products", icon: Package },
    { name: "Orders", href: "/seller/orders", icon: ShoppingCart },
    { name: "Notifications", href: "/seller/notifications", icon: Bell },
    { name: "Profile", href: "/seller/profile", icon: User },
];

export function SellerSidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth?.logout();
        navigate('/login');
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 ease-in-out",
                    "lg:translate-x-0 lg:static lg:z-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <img src="/src/assets/logo.jpeg" alt="Ammogam Logo" className="w-[60%] h-auto mx-auto" />
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-xl text-md font-bold transition-all duration-200",
                                        isActive
                                            ? "bg-primary1 text-white shadow-md border border-orange-500"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                                    {item.name}
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="p-3 border-t border-gray-200 space-y-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-md font-medium text-red-600 hover:bg-red-50 transition"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
