import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loading from "../Loading/Loading";

const MyMaterials = () => {
  const { user , loading} = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [updatedLink, setUpdatedLink] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");

  const {
    data: materials = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["materials", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`materials?email=${user?.email}`);
      return res.data;
    },
  });

  if (isLoading || loading) {
    return <Loading></Loading>;
  }

  // console.log(materials);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this material!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.delete(`materials/${id}`);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Material deleted",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    });
  };

  const handleUpdateMaterial = async () => {
    try {
      await axiosSecure.patch(`materials/${editingMaterial._id}`, {
        title: updatedTitle,
        link: updatedLink,
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Material updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      setEditingMaterial(null); // close modal
      setUpdatedLink("");
      setUpdatedTitle("");
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update",
        text: error.message,
      });
    }
  };

  console.log(materials);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        My Study Materials
      </h2>

      {materials?.length === 0 ? (
        <p className="text-center">No materials uploaded yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials?.map((material) => (
            <div
              key={material._id}
              className="card shadow-xl border rounded-xl hover:shadow-2xl transition"
            >
              <figure className="h-52">
                <img
                  src={material.image}
                  alt={material.title}
                  className="object-cover w-full h-full"
                />
              </figure>
              <div className="card-body">
                <h3 className="font-semibold text-lg">{material.title}</h3>
                <p className="text-sm text-gray-600">
                  <a
                    href={material.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Resource
                  </a>
                </p>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingMaterial(material);
                      setUpdatedTitle(material.title);
                      setUpdatedLink(material.link);
                    }}
                    className="btn btn-xs btn-outline"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(material._id)}
                    className="btn btn-xs btn-error"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMaterial && (
        <dialog id="edit_modal" className="modal modal-open"  key={editingMaterial?._id}>
          <div className="modal-box">
            <button
              onClick={() => setEditingMaterial(null)}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">Edit Material</h3>

            <div className="form-control mb-3">
              <label className="label">Title</label>
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="input input-bordered"
              />
            </div>

            <div className="form-control mb-3">
              <label className="label">Google Drive Link</label>
              <input
                type="text"
                value={updatedLink}
                onChange={(e) => setUpdatedLink(e.target.value)}
                className="input input-bordered"
              />
            </div>

            <div className="modal-action mt-4">
              <button
                onClick={handleUpdateMaterial}
                className="btn btn-primary"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingMaterial(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default MyMaterials;
