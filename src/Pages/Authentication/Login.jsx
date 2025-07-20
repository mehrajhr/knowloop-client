import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import loginanimation from "../../assets/login.json";
import Lottie from "lottie-react";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "./SocialLogin";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { loginUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const onSubmit = (data) => {
    console.log(data);
    loginUser(data.email, data.password)
      .then(async (res) => {
        const email = data.email;
        const response = await axios.post("http://localhost:5000/users", {
          email,
        });
        navigate(from);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${data.email}`,
        });
      })
      .catch((err) => {
        Swal.fire("Error", "Login failed.", "error");
        console.log(err);
      });
  };
  return (
    <div className="flex md:flex-row flex-col-reverse justify-center items-center gap-10">
      <div className="max-w-sm mt-10 p-6 shadow-lg rounded-xl bg-white">
        <h2 className="text-3xl font-bold mb-6">Login!</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="input input-bordered w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
        <p>
          Don't have an account ?{" "}
          <Link to="/register" className="btn btn-link">
            Register
          </Link>
        </p>
        <SocialLogin></SocialLogin>
      </div>

      <div>
        <Lottie
          style={{ width: "300px", height: "full" }}
          animationData={loginanimation}
          loop={true}
        ></Lottie>
      </div>
    </div>
  );
};

export default Login;
