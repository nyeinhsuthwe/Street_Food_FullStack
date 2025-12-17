import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { colors } from "../../constant/color";
import { FaRegEdit } from "react-icons/fa";
import { useApiQuery } from "../../hook/useQuery";
import { useApiMutation } from "../../hook/useMutation";
import { MdDelete } from "react-icons/md";
import { useLocation } from "react-router-dom";
import UpdateMenu from "./UpdateMenu";
import toast from "react-hot-toast";
import { MenuSkeleton } from "../../constant/skeleton";

const AdminMenu: React.FC = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const initialCategory = location.state?.categoryId || "All";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Inputs | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(7);

  const { data: menusData, isError, isLoading, error } = useApiQuery<ApiResponse<Inputs[]>>(
    {
      queryKey: ["menus", selectedCategory, page],
      endpoint: `${import.meta.env.VITE_API_URL
        }/get-menu-list?pageNo=${page}&pageSize=${limit}${selectedCategory !== "All" ? `&category_id=${selectedCategory}` : ""
        }`,
    },
    {
      select: (res: ApiResponse<Inputs[]>) => res,
    }
  );

  const menus = menusData?.data || [];
  const totalPages = menusData?.totalPages || 1;
  const currentPage = menusData?.currentPage || 1;

  const deleteMutation = useApiMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate({
      endpoint: `${import.meta.env.VITE_API_URL}/delete-menu/${id}`,
      method: "DELETE",
    });
    toast.success("Menu deleted successfully!");
  };

  const handleEdit = (menu: Inputs) => {
    setSelectedMenu(menu);
  };

  const { data: categories } = useApiQuery(
    {
      queryKey: ["categories"],
      endpoint: `${import.meta.env.VITE_API_URL}/get-category-list`,
    },
    { select: (res: ApiResponse<Categories[]>) => res.data }
  );

  if (isError)
    return (
      <p className="text-center mt-10 text-red-600">
        Error: {(error as Error).message}
      </p>
    );

  const filterMenu =
    selectedCategory === "All"
      ? menus
      : menus.filter((menu: Inputs) => menu.category_id === selectedCategory);

  return (
    <div
      className="p-8 h-full pt-15 w-full overflow-y-auto"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="overflow-hidden mt-4 rounded-2xl max-w-5xl mx-auto flex space-x-6">
        <h2
          className="text-xl font-bold mb-3 flex items-center gap-2"
          style={{ color: colors.text }}
        >
          🍔 Menu List
        </h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border text-sm rounded-lg px-4 text-[#7f6743]"
        >
          <option value="All">All Categories</option>
          {categories?.map((cat: Categories) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <MenuSkeleton />
      ) : (
        <>
          <div
            className="overflow-hidden mt-4 rounded-2xl max-w-5xl mx-auto"
            style={{ height: "670px" }}
          >
            <table className="w-full">
              <thead
                style={{ backgroundColor: colors.accent, color: colors.white }}
              >
                <tr className="text-xs">
                  <th className="p-4 text-center">Photo</th>
                  <th className="p-4 text-center">Name</th>
                  <th className="p-4 text-center">Price</th>
                  <th className="p-4 text-center">Description</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="bg-amber-50">
                {filterMenu?.map((menu: Inputs) => (
                  <tr
                    key={menu._id}
                    className={`transition-transform duration-200 ease-in-out cursor-pointer ${activeRow === menu._id
                        ? "transform scale-105 shadow-sm"
                        : "hover:scale-105"
                      }`}
                    style={{
                      borderBottom: `2px solid ${colors.bg}`,
                    }}
                  >
                    <td className="text-center py-2">
                      <img
                        src={
                          menu.photo
                            ? `${import.meta.env.VITE_API_URL}/uploads/${menu.photo
                            }`
                            : "/no-photo.png"
                        }
                        alt={menu.menu}
                        className="w-15 h-15 object-cover rounded-lg mx-auto"
                      />
                    </td>
                    <td
                      className="text-center text-xs font-medium"
                      style={{ color: colors.text }}
                    >
                      {menu.menu}
                    </td>
                    <td
                      className="text-center text-xs"
                      style={{ color: colors.text }}
                    >
                      ${menu.price}
                    </td>
                    <td
                      className="text-center text-xs"
                      style={{ color: colors.text }}
                    >
                      {menu.description || "-"}
                    </td>
                    <td className="text-center text-xs">
                      <button
                        type="button"
                        onClick={() => handleEdit(menu)}
                        className="text-xl mr-2 text-green-600"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(menu._id!)}
                        type="button"
                        className="text-xl text-red-600"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end gap-4 mt-4">
              <span className="font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-green-400 rounded hover:bg-green-500 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-green-400 rounded hover:bg-green-500 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

        </>
      )}

      {selectedMenu && (
        <UpdateMenu
          menu={selectedMenu}
          onClose={() => {
            setSelectedMenu(null);
            setActiveRow(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminMenu;