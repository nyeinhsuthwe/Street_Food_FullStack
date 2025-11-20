import React, { useState } from "react";
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

const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("newToken")
    navigate("/login", { replace: true });
  }

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-20"
        } bg-[#344F1F]  text-[#F2EAD3] border-r border-gray-200 flex flex-col transition-all duration-300 min-h-screen shadow-md`}
    >

      <div className="flex items-center gap-5 px-4 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {isOpen && <FaHamburger className="text-[#F4991A]" size={24} />}
          {isOpen && <span className="font-bold text-lg text-[#F2EAD3]">StreetBites</span>}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-[#F2EAD3]">
          <FaBars />
        </button>
      </div>

      <nav className="flex flex-col gap-2 p-4 mt-4 font-medium flex-1">
        <a
          href="/admin"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF5E1] hover:text-[#F4991A] transition"
        >
          <FaClipboardList />
          {isOpen && <span>Dashboard</span>}
        </a>

        <a
          href="/admin/create-category"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF5E1] hover:text-[#F4991A] transition"
        >
          <BiSolidCategoryAlt/>
          {isOpen && <span>Category</span>}
        </a>

        <a
          href="/admin/menu"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF5E1] hover:text-[#F4991A] transition"
        >
          <FaUtensils />
          {isOpen && <span>Menu</span>}
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF5E1] hover:text-[#F4991A] transition"
        >
          <FaUsers />
          {isOpen && <span>Customers</span>}
        </a>

        <a
          href="/admin/order"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF5E1] hover:text-[#F4991A] transition"
        >
          <FaClipboardList />
          {isOpen && <span>Orders</span>}
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF5E1] hover:text-[#F4991A] transition"
        >
          <FaCog />
          {isOpen && <span>Settings</span>}
        </a>
      </nav>


      <div className="p-4 border-t border-gray-200" onClick={()=>handleLogout()}>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF5E1] hover:text-[#F4991A] transition"
        >
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;
