import { useApiMutation } from "../../hook/useMutation";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AiOutlineMail, AiOutlineLock, AiOutlineUser } from "react-icons/ai";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

export const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const registerMutation = useApiMutation({
    onSuccess: (res: any) => {
      localStorage.setItem("token", res.token);
      alert("Registration successful!");
      navigate("/login");
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Registration failed!");
    },
  });

  const onSubmit = (data: RegisterFormInputs) => {
    registerMutation.mutate({
      endpoint: `${import.meta.env.VITE_API_URL}/register`,
      method: "POST",
      body: data,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9F5F0]">
      <div className="rounded-2xl shadow-xl flex w-4/5 max-w-4xl overflow-hidden">
        {/* Left side image/logo */}
        <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-6">
          <img
            src="/img/logo.jpg"
            alt="Logo"
            className="w-5/6 h-auto object-contain"
          />
        </div>

        {/* Right side register form */}
        <div className="w-full md:w-1/2 p-10 bg-red-500">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Create an Account
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="relative">
              <AiOutlineUser
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                size={20}
              />
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", { required: "Name is required!" })}
                className="w-full pl-10 p-3 border border-white rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-white bg-transparent placeholder-white"
              />
            </div>
            {errors.name && (
              <p className="text-white text-sm">{errors.name.message}</p>
            )}

            {/* Email */}
            <div className="relative">
              <AiOutlineMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                size={20}
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required!" })}
                className="w-full pl-10 p-3 border border-white rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-white bg-transparent placeholder-white"
              />
            </div>
            {errors.email && (
              <p className="text-white text-sm">{errors.email.message}</p>
            )}

            {/* Password */}
            <div className="relative">
              <AiOutlineLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                size={20}
              />
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required!" })}
                className="w-full pl-10 p-3 border border-white rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-white bg-transparent placeholder-white"
              />
            </div>
            {errors.password && (
              <p className="text-white text-sm">{errors.password.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-red-500 py-3 rounded-xl hover:bg-gray-100 transition font-semibold text-lg"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </button>

            {/* Optional link */}
            <div className="text-center mt-4">
              <a href="/login" className="text-white hover:underline text-sm">
                Already have an account? Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
