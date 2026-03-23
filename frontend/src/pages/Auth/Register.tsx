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
    <div className="flex items-center justify-center min-h-screen app-shell px-4">
      <div className="card flex w-full max-w-3xl overflow-hidden">
        {/* Left side image/logo */}
        <div className="hidden md:flex w-1/2 bg-accent-2 items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <img
            src="/img/logo.jpg"
            alt="Logo"
            className="w-5/6 h-auto object-contain rounded-2xl shadow-xl border border-white/40"
          />
        </div>

        {/* Right side register form */}
        <div className="w-full md:w-1/2 p-10 bg-surface">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Create an Account
          </h2>
          <p className="text-center text-[color:var(--muted)] mb-6 text-sm">Join the tastiest street crew</p>

          <form className="space-y-4 max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="relative">
              <AiOutlineUser
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--muted)]"
                size={20}
              />
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", {
                  required: "Name is required!", minLength: {
                    value: 4,
                    message: "Name must be at least 4 characters",
                  },
                })}
                className="w-full pl-10 input placeholder:text-sm"
              />
            </div>
            {errors.name && (
              <p className="text-accent text-sm">{errors.name.message}</p>
            )}

            {/* Email */}
            <div className="relative">
              <AiOutlineMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--muted)]"
                size={20}
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required!", pattern: {
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
                  required: "Password is required!", minLength: {
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
              {registerMutation.isPending ? "Registering..." : "Register"}
            </button>

          </form>

          {/* Optional link */}
          <div className="text-center mt-2">
            <a href="/login" className="text-[color:var(--muted)] hover:text-accent text-xs">
              Already have an account? Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
