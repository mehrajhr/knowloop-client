import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";
import registrationanimation from "../../assets/register.json";
import Lottie from "lottie-react";
import { Link, Links, useLocation, useNavigate } from "react-router";
import SocialLogin from "./SocialLogin";
import useAuth from "../../hooks/useAuth";

const RegisterForm = () => {
  const { setUser, profileUpdate, createUser } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [imagePreview, setImagePreview] = useState(null);

  const imgbbApiKey = import.meta.env.VITE_imagebb_key;

  const onSubmit = async (data) => {
    try {
      const imageFile = data.photo[0];

      // Upload image to ImgBB
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgbbRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );
      const imageUrl = imgbbRes.data.data.url;
      // console.log(imageUrl);

      const userData = {
        name: data.name,
        email: data.email,
        photo: imageUrl,
        role: data.role,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      createUser(data.email, data.password)
        .then(async (res) => {
          if (res.user) {
            profileUpdate(userData)
              .then(() => {
                Swal.fire(
                  "Success!",
                  "Account created successfully.",
                  "success"
                );
                reset();
                setImagePreview(null);
              })
              .catch(() => {
                Swal.fire("Error", "Image upload Failed", "error");
              });

            const res = await axios.post(
              "https://know-loop-server.vercel.app/users",
              userData
            );
            navigate(from);
          }
        })
        .catch((err) => {
          Swal.fire("Error", "Registration failed.", "error");
        });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Image upload or registration failed.", "error");
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-10 justify-center items-center">
      <div className="max-w-md p-6 bg-white shadow-lg rounded-xl mt-10">
        <h2 className="text-3xl font-bold mb-6">Register Now!</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="input input-bordered w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              className="input input-bordered w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="label">
              <span className="label-text">Photo</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("photo", { required: "Photo is required" })}
              className="file-input file-input-bordered w-full"
              onChange={handleImagePreview}
            />
            {errors.photo && (
              <p className="text-red-500 text-sm">{errors.photo.message}</p>
            )}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 mt-2 rounded-full object-cover"
              />
            )}
          </div>

          {/* Hidden Role Field */}
          <input type="hidden" value="student" {...register("role")} />

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </form>
        <p>
          Have an account?{" "}
          <Link className="btn btn-link" to="/login">
            Login
          </Link>
        </p>
        <SocialLogin></SocialLogin>
      </div>

      <div>
        <Lottie
          style={{ width: "300px", height: "full" }}
          animationData={registrationanimation}
          loop={true}
        ></Lottie>
      </div>
    </div>
  );
};

export default RegisterForm;
