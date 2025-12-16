import { useState, useRef, useEffect, useContext } from "react";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: HeaderProps) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">

        {/* Left side */}
        <div className="flex items-center gap-4 w-full max-w-4xl">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Search bar */}
          {/* <div className="hidden md:flex relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white
                         text-sm text-gray-700 placeholder-gray-400 transition-all"
            />
          </div> */}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>

          {/* Notification */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {/* Profile Button */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
              {auth?.user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">{auth?.user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-14 bg-white border border-gray-200 shadow-xl rounded-lg w-56 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{auth?.user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 mt-0.5">{auth?.user?.email}</p>
              </div>
              <button 
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-3 transition-colors"
                onClick={() => { setProfileOpen(false); navigate('/admin/profile'); }}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 flex items-center gap-3 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
