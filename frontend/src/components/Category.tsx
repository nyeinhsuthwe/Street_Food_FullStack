import { colors } from "../constant/color";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useApiQuery } from "../hook/useQuery";
import { useApiMutation } from "../hook/useMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import UpdateCategoryForm from "../pages/Admin/UpdateCategory";
import { useNavigate } from "react-router-dom";

const Category: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
  const navigate = useNavigate();

  const { data } = useApiQuery<Categories[]>(
  {
    queryKey: ["categories"],
    endpoint: `${import.meta.env.VITE_API_URL}/get-category-list`,
  },
  {
    select: (res: ApiResponse<Categories[]>) => res.data,
  }
);



  const deleteMutation = useApiMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate({
      endpoint: `${import.meta.env.VITE_API_URL}/delete-category/${id}`,
      method: "DELETE",
    });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl px-4">
        <div
          style={{ backgroundColor: colors.bg }}
          className="min-h-0 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 rounded-xl p-6"
        >
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.map((category: Categories) => (
              <div
                key={category._id}
               
                className="bg-amber-50 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform relative group"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${category.photo}`}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex-col gap-4 hidden group-hover:flex">
                  <FaRegEdit
                    size={42}
                    onClick={() => setSelectedCategory(category)}
                    className="border-[2.5px] border-gray-300 p-2 rounded cursor-pointer drop-shadow-lg text-yellow-400 hover:border-yellow-500 transition-transform hover:scale-110"
                  />
                  <MdDelete
                    size={42}
                    onClick={() => handleDelete(category._id!)}
                    className="border-[2.5px] border-gray-300 p-2 rounded text-red-500 cursor-pointer drop-shadow-lg hover:border-red-500 transition-transform hover:scale-110"
                  />
                </div>
                <div className="p-4 text-center"  onClick={()=>navigate(`/admin/menu`, {state: {category : category.name, categoryId : category._id}})}>
                  <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                    {category.name}
                  </h3>
                   
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
      {selectedCategory && (
        <UpdateCategoryForm
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
};

export default Category;
