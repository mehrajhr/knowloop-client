import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FiUploadCloud } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";

const image_hosting_key = import.meta.env.VITE_imagebb_key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UploadMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: approvedSessions = [], isLoading } = useQuery({
    queryKey: ["approvedSessions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`sessions?email=${user.email}&status=approved`);
      return res.data;
    },
  });

  const onSubmit = async (data) => {
    const imageFile = { image: data.image[0] };

    try {
      const res = await axios.post(image_hosting_api, imageFile, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const materialData = {
          title: data.title,
          sessionId: data.sessionId,
          tutorEmail: user.email,
          image: res.data.data.url,
          link: data.link,
          uploadedAt: new Date(),
        };

        const dbRes = await axiosSecure.post("/materials", materialData);
        if (dbRes.data.insertedId) {
          Swal.fire("✅ Uploaded", "Material uploaded successfully!", "success");
          reset();
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Upload failed. Please try again.", "error");
    }
  };

  if (isLoading) return <div className="text-center py-10"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <FiUploadCloud className="text-primary" /> Upload Study Materials
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="form-control col-span-1 md:col-span-2">
          <label className="label font-semibold">Material Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter material title"
            className="input input-bordered input-primary w-full"
          />
          {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Approved Sessions */}
        <div className="form-control">
          <label className="label font-semibold">Select Session</label>
          <select
            {...register("sessionId", { required: "Please select a session" })}
            className="select select-bordered select-primary w-full"
          >
            <option value="">Select an approved session</option>
            {approvedSessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.title}
              </option>
            ))}
          </select>
          {errors.sessionId && <p className="text-red-500 mt-1">{errors.sessionId.message}</p>}
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label font-semibold">Your Email</label>
          <input
            type="email"
            value={user?.email}
            readOnly
            className="input input-bordered bg-base-200 text-base-content"
          />
        </div>

        {/* Image Upload */}
        <div className="form-control col-span-1 md:col-span-2">
          <label className="label font-semibold">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
            className="file-input file-input-bordered file-input-primary w-full"
          />
          {errors.image && <p className="text-red-500 mt-1">{errors.image.message}</p>}
        </div>

        {/* Google Drive Link */}
        <div className="form-control col-span-1 md:col-span-2">
          <label className="label font-semibold">Google Drive Link</label>
          <input
            type="url"
            {...register("link", {
              required: "Link is required",
              pattern: {
                value: /^https:\/\/drive\.google\.com\/.+/,
                message: "Must be a valid Google Drive link",
              },
            })}
            placeholder="https://drive.google.com/..."
            className="input input-bordered input-primary w-full"
          />
          {errors.link && <p className="text-red-500 mt-1">{errors.link.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 text-center mt-4">
          <button type="submit" className="btn btn-primary w-full text-lg rounded-xl">
            Upload Material
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadMaterials;
