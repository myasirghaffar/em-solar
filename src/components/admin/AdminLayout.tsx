import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Newspaper,
  Settings,
  Menu,
  X,
  Store,
  LogOut,
  UserCircle2,
  FolderOpen,
  UserPlus,
  UserCog,
  FileText,
  Tags,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useScrollLock } from "../../hooks/useScrollLock";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useScrollLock(sidebarOpen);

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/leads", icon: FolderOpen, label: "Leads" },
    { path: "/admin/quotes", icon: FileText, label: "Quotes" },
    { path: "/admin/sales-team", icon: UserPlus, label: "Sales team" },
    { path: "/admin/users", icon: UserCog, label: "Users" },
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/product-categories", icon: Tags, label: "Product categories" },
    { path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/admin/customers", icon: Users, label: "Customers" },
    { path: "/admin/consultations", icon: MessageSquare, label: "Consultations" },
    { path: "/admin/blogs", icon: Newspaper, label: "Blog & news" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-900 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/admin" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-[10px] bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold">Admin Dashboard</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-slate-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/admin"
                ? location.pathname === "/admin"
                : location.pathname === item.path ||
                  location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-[#FF7A00] text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-900 transition-colors"
          >
            <Store className="w-5 h-5" />
            <span>View Store</span>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate("/login", { replace: true });
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-900 transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-0 min-w-0 w-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-3 sm:px-6 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-slate-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 hidden sm:block">
            EnergyMart Admin
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:inline">{user?.email}</span>
            <Link
              to="/admin/profile"
              className="w-10 h-10 bg-[#FF7A00] rounded-full flex items-center justify-center text-white font-bold hover:bg-[#e86e00] transition-colors"
              title="Profile"
            >
              <span className="sr-only">Profile</span>
              <UserCircle2 className="w-6 h-6" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto min-h-0 min-w-0 p-3 sm:p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}