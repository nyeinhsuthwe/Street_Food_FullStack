import { useApiQuery } from "../../hook/useQuery";
import { useApiMutation } from "../../hook/useMutation";
import React from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { DashboardSkeleton } from "../../constant/skeleton";

const AdminDashboard: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const { data: categories, isLoading } = useApiQuery<Categories[]>(
    {
      queryKey: ["categories"],
      endpoint: `${import.meta.env.VITE_API_URL}/get-category-list`,
    },
    {
      select: (res: ApiResponse<Categories[]>) => res.data,
    }
  );



  const mutation = useApiMutation({
    onSuccess: (res: unknown) => {
      console.log("Menu created successfully", res);
      reset();
    },
    onError: (err: unknown) => {
      console.error("API error:", err);
    },
  });


  const onSubmit = (menu: Inputs) => {
    const formData = new FormData();
    formData.append("menu", menu.menu);
    formData.append("price", String(menu.price));
    formData.append("description", menu.description?.trim() || "No description");
    formData.append("category_id", menu.category_id);

    if (menu.photo && menu.photo[0]) {
      formData.append("photo", menu.photo[0]);
    }

    mutation.mutate({
      endpoint: `${import.meta.env.VITE_API_URL}/create-menu`,
      method: "POST",
      body: formData,
    });

    toast.success("Menu created successfully!")
  };



  return (
    <main
      className="min-h-screen w-full mx-auto flex flex-col items-center px-6 py-10"
    >
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-extrabold text-accent">
          Menu Management
        </h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Manage your menu items, pricing, and descriptions
        </p>
      </div>

      <section
        className="max-w-3xl w-full mx-auto shadow-lg rounded-2xl p-8 mb-12 border border-soft bg-surface"
      >
        {isLoading ? (
         
          <div className="max-w-6xl">
             <DashboardSkeleton />
           </div>
          
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="flex flex-col  md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">
                  Create Menu Item
                </h2>
                <p className="text-xs mt-1 text-accent">
                  Fill out the details to add a new menu item
                </p>
              </div>
              <button
                type="submit"
                className="flex items-center text-xs gap-2 mt-4 md:mt-0 btn-primary"
              >
                <FaPlus className="text-xs" /> Add Item
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Menu */}
              <div>
                <label
                  className="block text-[color:var(--muted)] text-sm font-medium mb-1"

                >
                  Menu
                </label>
                <input
                  type="text"
                  {...register("menu", { required: true })}
                  className="w-full input placeholder:text-xs"
                  placeholder="Enter Menu"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label
                  className="block text-[color:var(--muted)] text-sm font-medium mb-1 "

                >
                  Category
                </label>
                <select
                  {...register("category_id", { required: true })}
                  className="w-full input text-sm"
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label
                  className="block text-[color:var(--muted)] text-sm font-medium mb-1"

                >
                  Price ($)
                </label>
                <input
                  type="number"
                  {...register("price", { required: true })}
                  className="w-full input placeholder:text-xs"
                  placeholder="Enter Price"
                />
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label
                  className="block text-[color:var(--muted)] text-sm font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full input placeholder:text-xs"
                  rows={3}
                  placeholder="Describe the dish..."
                />
              </div>

              {/* Upload Photo */}
              <div>
                <label
                  className="block text-[color:var(--muted)] text-sm font-medium mb-1"

                >
                  Upload Photo
                </label>
                <input
                  {...register("photo")}
                  type="file"
                  accept="image/*"
                  className="block w-full text-xs text-[color:var(--text)] file:mr-4 file:py-2 file:px-4 
                  file:border-0 file:font-semibold 
                  file:bg-[color:var(--accent-2)] file:text-white hover:file:opacity-80 transition"
                />
              </div>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default AdminDashboard;
