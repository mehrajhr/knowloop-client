import { useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../Loading/Loading";

const imgbbApiKey = import.meta.env.VITE_imagebb_key;

const MyProfile = () => {
  const { user: authUser , setUser , logOutUser } = useAuth();
  const email = authUser?.email;
  const { data: user, isLoading, refetch } = useUser(email);
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false); // <-- track save loading state

  const { register, handleSubmit, reset } = useForm();

  if (isLoading) {
    return <Loading />;
  }

  const handleLogout = () => {
    logOutUser()
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        setUser(null);
      })
      .catch((err) => {});
  };

  // Handle update with ImgBB
  const onSubmit = async (data) => {
    try {
      setSaving(true); // start loading
      let photoUrl = user?.photo;

      // if user selected a new file, upload to ImgBB
      if (data.photo?.[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);

        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          formData
        );

        if (imgbbRes.data.success) {
          photoUrl = imgbbRes.data.data.display_url;
        }
      }

      // update backend
      const res = await axiosSecure.put(`/users-update/${email}`, {
        name: data.name,
        photo: photoUrl,
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire("Success!", "Profile updated successfully", "success");
        refetch();
        setIsEditing(false);
      } else {
        Swal.fire("No Changes", "Nothing was updated", "info");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update profile", "error");
    } finally {
      setSaving(false); // stop loading no matter what
    }
  };

  // Open edit modal and reset form
  const handleEditClick = () => {
    reset({
      name: user?.name,
    });
    setIsEditing(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-xl bg-white rounded-2xl">
        <div className="card-body items-center text-center">
          {/* Profile Photo */}
          <div className="avatar">
            <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user?.photo} alt={user?.name} />
            </div>
          </div>

          {/* User Info */}
          <h2 className="card-title mt-4">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="badge badge-primary">{user?.role}</span>

          {/* Account Info */}
          <div className="divider">Account Info</div>
          <div className="text-sm text-left w-full">
            <p>
              <span className="font-medium">Created At:</span>{" "}
              {new Date(user?.created_at).toLocaleString()}
            </p>
          </div>

          {/* Buttons */}
          <div className="card-actions mt-4 flex justify-between w-full">
            <button
              onClick={handleEditClick}
              className="btn btn-outline btn-sm"
            >
              Edit Profile
            </button>
            <button className="btn btn-error btn-sm" onClick={() => handleLogout()}>Logout</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  className="input input-bordered w-full"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Upload Photo
                </label>
                <input
                  type="file"
                  {...register("photo")}
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  disabled={saving}
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${saving ? "loading" : ""}`}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default MyProfile;
