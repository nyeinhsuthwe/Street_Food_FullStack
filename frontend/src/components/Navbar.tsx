import React, { useEffect, useState } from "react";
import { FaHamburger, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import { colors } from "../constant/color";
import { LuCircleUser } from "react-icons/lu";
import { RiHistoryFill } from "react-icons/ri";
import { useCartStore } from "../store/Cart";
import Cookies from "js-cookie";
import { FiMoon, FiSun } from "react-icons/fi";



const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const cart = useCartStore((state) => state.items);
  const total = cart.reduce((sum, item) => sum + item.quantity, 0)
  const isCart = location.pathname === "/user/cart";
  const isHistory = location.pathname === "/user/history";

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
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-4 flex items-center justify-between">


        <div className="flex items-center gap-2 font-bold text-2xl text-accent">
          <FaHamburger size={28} style={{ color: colors.accent }} />
          <span className="tracking-tight">StreetBites</span>
        </div>


        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 font-medium">
            <li>
              <NavLink
                to="/user"
                end
                className={({ isActive }) =>
                  `relative font-semibold transition-all duration-300
                ${isActive ? "text-accent after:w-full" : "text-[color:var(--text)] opacity-80 hover:opacity-100 hover:text-accent hover:after:w-full"}
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[color:var(--accent)] after:w-0 after:transition-all`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/menu"
                className={({ isActive }) =>
                  `relative font-semibold transition-all duration-300
                ${isActive ? "text-accent after:w-full" : "text-[color:var(--text)] opacity-80 hover:opacity-100 hover:text-accent hover:after:w-full"}
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[color:var(--accent)] after:w-0 after:transition-all`
                }
              >
                Menu
              </NavLink>
            </li>
          </ul>

          <NavLink to="/user/cart">
            <button
              className={`relative p-2 transition-all duration-300 rounded-xl ${isCart
                ? "bg-accent-3 text-[color:var(--text)]"
                : "text-[color:var(--text)] hover:bg-accent-3 hover:scale-105"
                }`}
            >
              <FaShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {total}
              </span>
            </button>
          </NavLink>

          <NavLink to="/user/history">
            <button
              className={`relative p-2 transition-all duration-300 rounded-xl ${isHistory
                ? "bg-accent-2 text-white"
                : "text-[color:var(--text)] hover:bg-accent-2 hover:text-white hover:scale-105"
                }`}
            >
              <RiHistoryFill size={24} />
            </button>
          </NavLink>
        </div>

        <div className="hidden md:flex gap-3 items-center">
          <button className="text-[color:var(--text)] relative rounded-full p-2 hover:bg-surface-2 transition">
            <LuCircleUser size={32} />
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-full border border-soft p-2 hover:bg-surface-2 transition"
            aria-label="Toggle dark mode"
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <button
            onClick={() => handleLogout()}
            className="btn-secondary">
            Logout
          </button>
        </div>


        <div className="md:hidden flex items-center gap-4">
          <NavLink to="/user/cart">
            <button className="relative rounded-xl p-2 hover:bg-accent-3 transition">
              <FaShoppingCart size={22} className="text-[color:var(--text)]" />
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {total}
              </span>
            </button>
          </NavLink>

          <button onClick={toggleTheme} className="rounded-full border border-soft p-2">
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl hover:bg-surface-2 transition">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>


      {menuOpen && (
        <div className="md:hidden bg-surface shadow-lg w-full absolute top-full left-0 z-40 border-b border-soft">
          <ul className="flex flex-col gap-4 py-4 px-6 font-medium">
            <li>
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `transition ${isActive ? "text-accent font-semibold" : "text-[color:var(--text)] hover:text-accent"}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/menu"
                className={({ isActive }) =>
                  `transition ${isActive ? "text-accent font-semibold" : "text-[color:var(--text)] hover:text-accent"}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Menu
              </NavLink>
            </li>
            <li>
              <NavLink to="/user/about" className="text-[color:var(--text)] hover:text-accent transition" onClick={() => setMenuOpen(false)}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/user/contact" className="text-[color:var(--text)] hover:text-accent transition" onClick={() => setMenuOpen(false)}>
                Contact
              </NavLink>
            </li>
            <li>
              <button className="w-full btn-primary">
                Order Now
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
