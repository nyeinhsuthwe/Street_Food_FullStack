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
    <div className="flex items-center justify-center min-h-screen app-shell px-4">
      <div className="card flex w-full max-w-3xl overflow-hidden">

        <div className="hidden md:flex w-1/2 bg-accent items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <img
            src="/img/logo.jpg"
            alt="Logo"
            className="w-5/6 h-auto object-contain rounded-2xl shadow-xl border border-white/40"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 bg-surface">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-center text-[color:var(--muted)] mb-6 text-sm">Grab your favorites in a few taps</p>

          <form className="space-y-4 max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <AiOutlineMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--muted)]"
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
                className="w-full pl-10 input placeholder:text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-accent text-sm">{errors.email.message}</p>
            )}

            {/* Password */}
            <div className="relative">
              <AiOutlineLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--muted)]"
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
                className="w-full pl-10 input placeholder:text-sm"
              />
            </div>
            {errors.password && (
              <p className="text-accent text-sm">{errors.password.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary text-sm"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>

          </form>
          {/* Optional links */}
          <div className="text-center mt-3">
            <a href="#" className="text-[color:var(--muted)] hover:text-accent text-xs">
              Forgot Password?
            </a>
          </div>
          <div className="text-center">
            <a href="/register" className="text-[color:var(--muted)] hover:text-accent text-xs">
              If you don't have an account? Register
            </a>
          </div>
        </div>
      </div>
    </div>

  );
};
