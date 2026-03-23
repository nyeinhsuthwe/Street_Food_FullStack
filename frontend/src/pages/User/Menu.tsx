import { useState } from "react";
import { useApiQuery } from "../../hook/useQuery";
import AddToCart from "../../components/AddToCart";
import { useLocation } from "react-router-dom";

export const UserMenu: React.FC = () => {
  const [addToCart, setAddToCart] = useState<Inputs | null>(null);
  const location = useLocation();

  const initialCategory = location.state?.categoryId || "All";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const { data: categoryData, isLoading: loadingCategories } = useApiQuery<ApiResponse<Categories[]>>({
    queryKey: ["category", selectedCategory],
    endpoint: `${import.meta.env.VITE_API_URL}/get-category-list${selectedCategory !== "All" ? `?category_id=${selectedCategory}` : ""
      }`,

  });

  const { data: menuData, isLoading: loadingMenus } = useApiQuery<ApiResponse<Inputs[]>>({
    queryKey: ["menus"],
    endpoint: `${import.meta.env.VITE_API_URL}/get-menu-list`,
  });

  const categories = categoryData?.data || [];
  const menus = menuData?.data || [];

  const filteredMenu =
    selectedCategory === "All"
      ? menus
      : menus.filter((menu) => menu.category_id === selectedCategory);

 
  const renderCategorySkeleton = () => (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="h-8 w-24 bg-[color:var(--border)] rounded-full animate-pulse"></div>
      ))}
    </div>
  );

  
  const renderMenuSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="rounded-lg shadow-md bg-surface animate-pulse h-80">
          <div className="h-48 bg-[color:var(--border)] w-full"></div>
          <div className="p-5 space-y-3">
            <div className="h-6 bg-[color:var(--border)] w-3/4 rounded"></div>
            <div className="h-4 bg-[color:var(--border)] w-1/2 rounded"></div>
            <div className="h-8 bg-[color:var(--border)] rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 mt-8">


        <div className="w-full lg:w-1/6 lg:sticky lg:top-28 self-start">
          {loadingCategories ? (
            renderCategorySkeleton()
          ) : (
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`flex-shrink-0 chip transition-colors duration-200 ${selectedCategory === "All"
                  ? "chip-active"
                  : "hover:shadow-sm"
                  }`}
              >
                All Items
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => setSelectedCategory(category._id ?? "")}
                  className={`flex-shrink-0 chip transition-colors duration-200 ${selectedCategory === category._id
                    ? "chip-active"
                    : "hover:shadow-sm"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>


        <div className="w-full lg:w-4/5">
          <h2 className="section-title mb-8 text-center lg:text-left">
            {selectedCategory === "All"
              ? "All Menu Items"
              : `${categories.find((c) => c._id === selectedCategory)?.name || ""} Menu`}
          </h2>

          {loadingMenus ? renderMenuSkeleton() : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMenu.map((menu) => (
                <div
                  key={menu._id}
                  className="card hover:-translate-y-1 transition-transform relative group overflow-hidden duration-300"
                >
                  <div className="relative">
                    <img
                      src={
                        menu.photo
                          ? `${import.meta.env.VITE_API_URL}/uploads/${menu.photo}`
                          : "/no-photo.png"
                      }
                      alt={menu.menu}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold truncate">
                        {menu.menu}
                      </h3>
                      <span className="text-accent font-bold">
                        ${menu.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-[color:var(--muted)] mb-5 text-sm min-h-[48px]">
                      {menu.description ? (
                        <p className="line-clamp-2">{menu.description}</p>
                      ) : (
                        <p className="opacity-0 select-none">No description</p>
                      )}
                    </div>

                    <button
                      onClick={() => setAddToCart(menu)}
                      className="mt-auto w-full btn-primary"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {addToCart && (
        <AddToCart menu={addToCart} onClose={() => setAddToCart(null)} />
      )}
    </div>
  );
};
