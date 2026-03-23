import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaHamburger,
  FaClipboardList,
  FaUsers,
  FaUtensils,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { linkBase, linkActive, linkInactive } from "../constant/color";
import { NavLink } from "react-router";
import { FiMoon, FiSun } from "react-icons/fi";

const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
    const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleLogout = () => {
    Cookies.remove("newToken")
    navigate("/login", { replace: true });
  }

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-20"
        } text-[color:var(--text)] border-r border-soft flex flex-col transition-all duration-300 min-h-screen shadow-md bg-surface`}
    >

      <div className="flex items-center gap-4 p-5 py-5 border-b border-soft">
        <div className="flex items-center gap-2 flex-1">
          {isOpen && <FaHamburger className="text-accent" size={24} />}
          {isOpen && <span className="font-bold text-lg text-accent">StreetBites</span>}
        </div>
        {isOpen && (
          <button onClick={toggleTheme} className="rounded-full border border-soft p-2 hover:bg-surface-2 transition">
            {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="text-accent mr-5">
          <FaBars />
        </button>
      </div>

      <nav className="flex flex-col gap-2 p-4 mt-4 font-medium flex-1">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <FaClipboardList />
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/admin/create-category"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }        >
          <BiSolidCategoryAlt />
          {isOpen && <span>Category</span>}
        </NavLink>

        <NavLink
          to="/admin/menu"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }           >
          <FaUtensils />
          {isOpen && <span>Menu</span>}
        </NavLink>

        <NavLink
          to="/admin/customer"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }           >
          <FaUsers />
          {isOpen && <span>Customers</span>}
        </NavLink>

        <NavLink
          to="/admin/order"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }           >
          <FaClipboardList />
          {isOpen && <span>Orders</span>}
        </NavLink>

        <NavLink
          to="/admin/setting"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }           >
          <FaCog />
          {isOpen && <span>Settings</span>}
        </NavLink>
      </nav>


      <div className="p-4 border-t border-soft" onClick={() => handleLogout()}>
        <NavLink
          to="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-2 hover:text-[color:var(--text)] transition"
        >
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
