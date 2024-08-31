"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaTachometerAlt, FaUsers, FaNewspaper, FaMapMarkedAlt, FaHotel, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt className="h-6 w-6" />, href: "/admin/dashboard" },
    { name: "User", icon: <FaUsers className="h-6 w-6" />, href: "/admin/user" },
    { name: "News", icon: <FaNewspaper className="h-6 w-6" />, href: "/admin/news" },
    { name: "Places", icon: <FaMapMarkedAlt className="h-6 w-6" />, href: "/admin/places" },
    { name: "Accommodations", icon: <FaHotel className="h-6 w-6" />, href: "/admin/accommodations" },
  ];

  const handleLogout = async () => {
    try {
      // Panggil API logout untuk menghapus token dari cookies
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Redirect ke halaman login setelah berhasil logout
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white w-64 space-y-6 px-2 py-7">
      <h2 className="text-3xl font-semibold text-center">Majestic Majalengka</h2>
      <nav className="gap-4 flex flex-col">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className={`flex items-center p-2 rounded-lg cursor-pointer space-x-6 hover:bg-gray-800 transition duration-500 ${pathname === item.href ? "bg-gray-800" : ""}`}>
              {item.icon}
              <span>{item.name}</span>
            </div>
          </Link>
        ))}

        {/* Tombol Logout */}
        <div onClick={handleLogout} className="flex items-center p-2 rounded-lg cursor-pointer space-x-6 hover:bg-red-600 transition duration-500">
          <FaSignOutAlt className="h-6 w-6" />
          <span>Logout</span>
        </div>
      </nav>
    </div>
  );
}
