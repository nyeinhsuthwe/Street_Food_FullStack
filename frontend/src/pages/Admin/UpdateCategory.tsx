import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaSave, FaTimes } from "react-icons/fa";
import { useApiMutation } from "../../hook/useMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateCategoryProps {
  category: Categories;
  onClose: () => void;
}

const UpdateCategoryForm: React.FC<UpdateCategoryProps> = ({
  category,
  onClose,
}) => {
  const { register, handleSubmit, setValue } = useForm<Categories>();
  const queryClient = useQueryClient();

  const [preview, setPreview] = useState<string | null>(null);

  const updateMutation = useApiMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: (err) => {
      console.error("Update failed:", err);
    },
  });

  useEffect(() => {
    setValue("name", category.name);
    setPreview(`${import.meta.env.VITE_API_URL}/uploads/${category.photo}`);
  }, [category, setValue]);

  const onSubmit = (data: Categories) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.photo && data.photo[0]) {
      formData.append("photo", data.photo[0]);
    }

    updateMutation.mutate({
      endpoint: `${import.meta.env.VITE_API_URL}/update-category/${
        category._id
      }`,
      method: "PUT",
      body: formData,
    });

    toast.success("Category updated successfully!")
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50 backdrop-blur-sm">
      <div className="card p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-accent hover:opacity-80"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 ">
          Update Category
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1 text-[color:var(--muted)]"
              
            >
              Category Name
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter category name"
              className="w-full input text-sm"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1 text-[color:var(--muted)]"
              
            >
              Upload Photo
            </label>
            <input
              {...register("photo")}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="block w-full text-sm p-3 rounded bg-accent-2 text-white hover:opacity-80"
             
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>

          <button
            type="submit"
            className="flex items-center text-sm justify-center gap-2 px-4 py-3 rounded shadow-md font-semibold btn-primary"
          >
            <FaSave /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategoryForm;
