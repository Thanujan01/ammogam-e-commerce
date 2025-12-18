import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {LayoutDashboard,Package,FolderTree,ShoppingCart,Users,BarChart3,User,Camera,X,LogOut,Bell,} from "lucide-react";
import { cn } from "../../libs/utils";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Profile", href: "/admin/profile", icon: User },
];

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-white/70 backdrop-blur-xl border-r border-gray-200 shadow-xl transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">

          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white/60 ">
            <div className="flex items-center gap-3">
              {/* <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold  text-primary1">
                  Ammogam
                </h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div> */}
              <img src="/src/assets/logo.png" alt="Ammogam Logo" className="w-[70%] h-auto items-center flex mx-auto" />
            </div>

            {/* Close Button (Mobile) */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "relative flex items-center gap-4 px-4 py-3 rounded-xl text-md font-bold transition-all duration-200",
                    isActive
                      ? "bg-primary1 text-white shadow-sm border border-indigo-200"
                      : "text-primary1 hover:bg-secondary hover:text-secondary1"
                  )}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-primary1 rounded-r-xl" />
                  )}

                  <item.icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-white"
                        : "text-primary1"
                    )}
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-white/60 space-y-2">

            {/* Settings */}
            {/* <NavLink
              to="/settings"
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <Settings className="w-5 h-5" />
              Settings
            </NavLink> */}

            {/* Logout */}
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
