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
        <div key={idx} className="h-8 w-24 bg-gray-300 rounded-full animate-pulse"></div>
      ))}
    </div>
  );

  
  const renderMenuSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="rounded-lg shadow-md bg-white animate-pulse h-80">
          <div className="h-48 bg-gray-300 w-full"></div>
          <div className="p-5 space-y-3">
            <div className="h-6 bg-gray-300 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 mt-20">


        <div className="w-full lg:w-1/6 lg:sticky lg:top-31 self-start">
          {loadingCategories ? (
            renderCategorySkeleton()
          ) : (
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-medium transition-colors duration-200 border ${selectedCategory === "All"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-red-500 border-red-500 hover:bg-red-50"
                  }`}
              >
                All Items
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => setSelectedCategory(category._id ?? "")}
                  className={`flex-shrink-0 px-5 py-2 rounded-full font-medium transition-colors duration-200 border ${selectedCategory === category._id
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-red-500 border-red-500 hover:bg-red-50"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>


        <div className="w-full lg:w-4/5">
          <h2 className="text-xl text-gray-600 font-bold mb-8 text-center lg:text-left">
            {selectedCategory === "All"
              ? "All Menu Items"
              : `${categories.find((c) => c._id === selectedCategory)?.name || ""} Menu`}
          </h2>

          {loadingMenus ? renderMenuSkeleton() : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMenu.map((menu) => (
                <div
                  key={menu._id}
                  className="rounded-lg hover:scale-105 transition-transform relative group shadow-md overflow-hidden hover:shadow-lg duration-300 bg-white"
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
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {menu.menu}
                      </h3>
                      <span className="text-red-500 font-bold">
                        ${menu.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-gray-600 mb-5 text-sm min-h-[48px]">
                      {menu.description ? (
                        <p className="line-clamp-2">{menu.description}</p>
                      ) : (
                        <p className="opacity-0 select-none">No description</p>
                      )}
                    </div>

                    <button
                      onClick={() => setAddToCart(menu)}
                      className="mt-auto w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 font-medium"
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
