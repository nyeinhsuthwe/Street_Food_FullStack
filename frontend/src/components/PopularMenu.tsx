import { motion } from "framer-motion";

export const PopularMenu: React.FC<{ menus: Inputs[] }> = ({ menus }) => (
  <div className="mb-8">
    <h2 className="section-title mb-4">Popular Menu</h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {menus.slice(0, 4).map((menu) => (
        <motion.div
          key={menu._id}
          whileHover={{ scale: 1.05 }}
          className="card overflow-hidden p-3"
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${menu.photo}`}
            alt={menu.menu}
            className="w-full h-32 object-cover rounded-lg"
          />
          <h3 className="mt-2 font-semibold">{menu.menu}</h3>
          <p className="text-accent font-bold">${menu.price}</p>
        </motion.div>
      ))}
    </div>
  </div>
);
