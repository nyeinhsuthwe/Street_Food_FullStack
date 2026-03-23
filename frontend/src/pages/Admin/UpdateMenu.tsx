import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "../../hook/useMutation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";


interface UpdateMenuFormProps {
  menu: Inputs;
  onClose: () => void;
}

const UpdateMenu: React.FC<UpdateMenuFormProps> = ({ menu, onClose }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      menu: menu.menu,
      price: menu.price,
      description: menu.description || "",
      category_id: menu.category_id,
      photo: undefined,
    },
  });

  const updateMutation = useApiMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });

      onClose();
    },
  });

  const uploadMutation = useApiMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      onClose();
    },
  });

  const onSubmit = async (data: Inputs) => {
    const payload = {
      menu: data.menu,
      description: data.description,
      price: data.price,
      category_id: data.category_id,
    };

    updateMutation.mutate({
      endpoint: `${import.meta.env.VITE_API_URL}/update-menu/${menu._id}`,
      method: "PATCH",
      body: payload,
    });

    if (imageFile) {
      const formData = new FormData();
      formData.append("photo", imageFile);
      await uploadMutation.mutateAsync({
        endpoint: `${import.meta.env.VITE_API_URL}/${menu._id}/upload`,
        method: "POST",
        body: formData,
      });
    }

    toast.success("Menu updated successfully!")
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="card p-6 rounded-2xl w-[500px] relative">
        <h2 className="text-xl font-bold mb-4" >
          Update Menu
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            {...register("menu")}
            placeholder="Menu Name"
            className="input"
          />
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="Price"
            className="input"
          />
          <textarea
            {...register("description")}
            placeholder="Description"
            className="input"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 rounded bg-accent-2 text-white hover:opacity-80"
          />
          <div className="flex justify-end text-sm gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-secondary"
              
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMenu;
