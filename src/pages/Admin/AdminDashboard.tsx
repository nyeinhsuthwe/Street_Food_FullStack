import { useApiQuery } from "../../hook/useQuery";
import { useApiMutation } from "../../hook/useMutation";
import React from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { colors } from "../../constant/color";


const AdminDashboard: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const { data: categories } = useApiQuery<Categories[]>(
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
    formData.append("description", menu.description);
    formData.append("category_id", menu.category_id);

    if (menu.photo && menu.photo[0]) {
      formData.append("photo", menu.photo[0]);
    }

    mutation.mutate({
      endpoint: `${import.meta.env.VITE_API_URL}/create-menu`,
      method: "POST",
      body: formData,
    });
  };

  return (
    <main
      className="min-h-screen w-full mx-auto flex flex-col items-center px-6 py-10"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="mb-10 text-center">
        <h1
          className="text-4xl font-extrabold"
          style={{ color: colors.accent }}
        >
          🍔 Menu Management
        </h1>
        <p style={{ color: colors.card }} className="mt-2">
          Manage your street food menu with a warm vintage vibe
        </p>
      </div>

      <section
        className="w-full max-w-5xl shadow-lg rounded-2xl p-8 mb-12 border"
        style={{ backgroundColor: colors.card, borderColor: colors.bg }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2
                className="text-2xl font-semibold"
                style={{ color: colors.bg }}
              >
                Create Menu Item
              </h2>
              <p className="text-sm mt-1" style={{ color: colors.accent }}>
                Fill out the details to add a new menu item
              </p>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 mt-4 md:mt-0 font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all duration-200 
               text-white hover:bg-amber-700 bg-amber-600"
            >
              <FaPlus /> Add Item
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Menu */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.bg }}
              >
                Menu
              </label>
              <input
                type="text"
                {...register("menu", { required: true })}
                className="w-full p-3 border rounded-lg outline-none transition"
                style={{ backgroundColor: colors.bg, borderColor: colors.bg }}
                placeholder="Enter Menu"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.bg }}
              >
                Category
              </label>
              <select
                {...register("category_id", { required: true })}
                className="w-full p-3 border rounded-lg outline-none transition"
                style={{ backgroundColor: colors.bg, borderColor: colors.bg }}
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
                className="block text-sm font-medium mb-1"
                style={{ color: colors.bg }}
              >
                Price ($)
              </label>
              <input
                type="number"
                {...register("price", { required: true })}
                className="w-full p-3 border rounded-lg outline-none transition"
                style={{ backgroundColor: colors.bg, borderColor: colors.bg }}
                placeholder="Enter Price"
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.bg }}
              >
                Description
              </label>
              <textarea
                {...register("description", { required: true })}
                className="w-full p-3 border rounded-lg outline-none transition"
                style={{ backgroundColor: colors.bg, borderColor: colors.bg }}
                rows={3}
                placeholder="Describe the dish..."
              />
            </div>

            {/* Upload Photo */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.bg }}
              >
                Upload Photo
              </label>
              <input
                {...register("photo")}
                type="file"
                accept="image/*"
                className="block bg-[#F2EAD3] w-full text-sm text-[#344F1F] file:mr-4 file:py-2 file:px-4 
                  file:border-0 file:font-semibold 
                  file:bg-amber-600 file:text-white hover:file:bg-amber-700 transition"
              />
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AdminDashboard;
