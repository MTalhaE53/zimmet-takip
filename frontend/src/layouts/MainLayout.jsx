import { Outlet, Link, useLocation } from "react-router-dom";
import { Package, Plus, ClipboardList, QrCode } from "lucide-react";

const MainLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h1 className="text-xl font-bold mb-8 text-center">Zimmet Paneli</h1>
        <nav className="space-y-2">
          <NavLink to="/" icon={<ClipboardList size={18} />} label="Ürün Listesi" active={pathname === "/"} />
          <NavLink to="/urun-ekle" icon={<Plus size={18} />} label="Yeni Ürün" active={pathname === "/urun-ekle"} />
          <NavLink to="/zimmetle" icon={<Package size={18} />} label="Zimmetle" active={pathname.includes("zimmetle")} />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <header className="bg-white shadow p-4">
          <h2 className="text-xl font-semibold text-gray-800">Zimmet Takip Uygulaması</h2>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition ${
      active ? "bg-gray-800" : ""
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default MainLayout;
