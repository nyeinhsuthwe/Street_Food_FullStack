import React from "react";
import { FaPlus } from "react-icons/fa";
import { colors } from "../../constant/color";
import Category from "../../components/Category";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useApiMutation } from "../../hook/useMutation";


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
  }

  return (
    <div className="flex flex-col items-center w-full  " style={{ backgroundColor: colors.bg }}>
      <main
        className=" flex flex-col items-center px-6 py-10"

      >
        <h1
          className="text-4xl font-extrabold mb-6 text-center"
          style={{ color: colors.accent }}
        >
          🍕 Category Management
        </h1>

        <section
          className="w-full h-full max-w-3xl shadow-lg rounded-2xl p-8 border mb-12"
          style={{ backgroundColor: colors.card, borderColor: colors.bg }}
        >
          <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.bg }}
                >
                  Category Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Enter category name"
                  className="w-full p-3 border rounded-lg outline-none transition"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.bg,
                    color: colors.text,
                  }}
                />
              </div>

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
                  className="block  rounded bg-[#F2EAD3] w-full text-sm text-[#344F1F] file:mr-4 file:py-2 file:px-4 
                                file:border-0 file:font-semibold 
                                file:bg-amber-600 file:text-white hover:file:bg-amber-700 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex  text-center gap-2 justify-center mt-3 px-6 py-3 rounded-xl shadow-md font-semibold transition bg-green-600 hover:bg-green-700 text-white"
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
