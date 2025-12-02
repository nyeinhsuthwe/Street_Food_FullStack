import { useApiMutation } from "../../hook/useMutation";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import Cookies from "js-cookie";

interface LoginFormInputs {
  email: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const loginMutation = useApiMutation({
    onSuccess: (res: any) => {
      localStorage.setItem("userRole", res.data.role);
      localStorage.setItem("user_id", res.data._id);
      Cookies.set("newToken", res.token)
      if (res.data.role === "admin") navigate("/admin");
      else navigate("/user");

    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Login failed!");
    },
  });


  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate({
      endpoint: `${import.meta.env.VITE_API_URL}/login`,
      method: "POST",
      body: data,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9F5F0]">
      <div className="rounded-2xl shadow-xl flex w-4/5 max-w-3xl max-h-110 overflow-hidden">

        <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-6">
          <img
            src="/img/logo.jpg"
            alt="Logo"
            className="w-5/6 h-auto object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 bg-red-500">
          <h2 className="text-xl font-bold text-white mb-8 text-center">
            Welcome Back
          </h2>

          <form className="space-y-4 max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <AiOutlineMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                size={20}
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required!",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className="w-full pl-10 placeholder:text-sm p-2 border-2  border-gray-100 rounded-xl focus:ring-1 focus:ring-white focus:outline-none text-white placeholder:text-white"
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
                {...register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full placeholder:text-sm placeholder:text-white  pl-10 p-2 border-2 border-gray-100 rounded-xl focus:ring-1 focus:ring-white focus:outline-none text-white"
              />
            </div>
            {errors.password && (
              <p className="text-white text-sm">{errors.password.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-red-500 py-3  rounded-xl hover:bg-gray-100 transition font-semibold text-sm"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>

          </form>
          {/* Optional links */}
          <div className="text-center mt-3">
            <a href="#" className="text-white hover:underline text-xs">
              Forgot Password?
            </a>
          </div>
          <div className="text-center">
            <a href="/register" className="text-white hover:underline text-xs">
              If you don't have an account? Register
            </a>
          </div>
        </div>
      </div>
    </div>

  );
};
