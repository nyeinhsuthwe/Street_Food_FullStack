import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useApiQuery } from "../hook/useQuery";
import { useApiMutation } from "../hook/useMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import UpdateCategoryForm from "../pages/Admin/UpdateCategory";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CategorySkeleton } from "../constant/skeleton";

const Category: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useApiQuery<Categories[]>(
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

    toast.success("Category deleted successfully!")
  };


  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-7">
        <div className="min-h-0 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 rounded-2xl p-6 bg-surface">
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={i} />)
              : data?.map((category: Categories) => (
                <div
                  key={category._id}
                  className="card overflow-hidden hover:-translate-y-1 transition-transform relative group"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${category.photo}`}
                    alt={category.name}
                    className="w-full h-45 object-cover"
                  />

                  <div className="absolute top-3 right-3 flex-col gap-4 hidden group-hover:flex">
                    <FaRegEdit
                      size={42}
                      onClick={() => setSelectedCategory(category)}
                      className="border-[2.5px] border-soft p-2 rounded cursor-pointer drop-shadow-lg text-accent-3 hover:border-accent-3 transition-transform hover:scale-110 bg-surface"
                    />
                    <MdDelete
                      size={42}
                      onClick={() => handleDelete(category._id!)}
                      className="border-[2.5px] border-soft p-2 rounded text-accent cursor-pointer drop-shadow-lg hover:border-accent transition-transform hover:scale-110 bg-surface"
                    />
                  </div>

                  <div
                    className="p-3 text-center"
                    onClick={() =>
                      navigate(`/admin/menu`, {
                        state: { category: category.name, categoryId: category._id },
                      })
                    }
                  >
                    <h3 className="font-bold text-md">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))
            }

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
