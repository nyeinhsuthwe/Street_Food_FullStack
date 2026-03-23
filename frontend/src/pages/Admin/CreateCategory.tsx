import React from "react";
import { FaPlus } from "react-icons/fa";
import Category from "../../components/Category";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useApiMutation } from "../../hook/useMutation";
import toast from "react-hot-toast";


const CreateCategory: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<Categories>();
  const queryClient = useQueryClient();


  const createMutation = useApiMutation({
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      console.log("Menu created successfully", res.data);
      reset();
    },
    onError: (err) => {
      console.error("API error:", err.message);
    },
  });



  const onSubmit = (category: Categories) => {
    const formData = new FormData();
    const data = {
      name: category.name,
      photo: category.photo
    }
    formData.append("name", data.name);
    if (data.photo && data.photo[0]) {
      formData.append("photo", data.photo[0]);
    }

    createMutation.mutate({
      endpoint: `${import.meta.env.VITE_API_URL}/create-category`,
      method: "POST",
      body: formData
    })
    toast.success("Category created successfully!")
  }

  return (
    <div className="flex flex-col items-center w-full">
      <main className="flex flex-col items-center px-6 py-10">
        <h1 className="text-xl font-extrabold mb-6 text-center text-accent">
          Category Management
        </h1>

        <section
          className="w-full h-full max-h-49 max-w-xl shadow-lg rounded-2xl p-8 border border-soft mb-12 bg-surface"
        >
          <form className="grid gap-6 max-w-xl" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-[color:var(--muted)] text-sm font-medium mb-1"
                 
                >
                  Category Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Enter category name"
                  className="w-full input placeholder:text-xs"
                />
              </div>

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
                  className="block rounded w-full text-xs text-[color:var(--text)] file:mr-4 file:py-3 file:px-4 
                                file:border-0 file:font-semibold 
                                file:bg-[color:var(--accent-2)] file:text-white hover:file:opacity-80 transition"
                />
              </div>
            </div>

          
            <button
              type="submit"
              className="flex justify-center text-sm text-center gap-1 mt-2 py-3 rounded-lg shadow-md font-semibold transition btn-primary"
            >
              <FaPlus /> Add Category
            </button>
            
          </form>
        </section>
      </main>

      <Category />
    </div>
  );
};

export default CreateCategory;
