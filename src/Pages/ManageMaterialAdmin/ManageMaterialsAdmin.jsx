import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FiTrash2, FiExternalLink } from "react-icons/fi";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";

const ManageMaterialsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["admin-materials"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/materials");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/admin/materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-materials"]);
      Swal.fire("Deleted!", "The material has been removed.", "success");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the material.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📂 All Study Materials</h2>

      {isLoading ? (
        <p>Loading materials...</p>
      ) : materials.length === 0 ? (
        <p className="text-gray-500">No materials available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div
              key={material._id}
              className="card bg-base-100 shadow-md border"
            >
              <figure className="px-4 pt-4">
                <img
                  src={material.image}
                  alt="Study Material"
                  className="rounded-lg w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold mb-2">
                  Title: {material.title || "Unknown"}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  Uploaded At: {new Date(material.uploadedAt).toLocaleString()}
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    to={material.link}
                    target="_blank"
                    rel="noreferrer"
                    className="link text-blue-500 flex items-center gap-1"
                  >
                    Google Drive <FiExternalLink />
                  </Link>

                  <Link
                    to={material.image}
                    download
                    className="btn btn-sm btn-outline btn-success"
                  >
                    Download
                  </Link>
                </div>

                <button
                  className="btn btn-sm btn-outline btn-error mt-4 w-full"
                  onClick={() => handleDelete(material._id)}
                >
                  <FiTrash2 className="mr-1" /> Delete Material
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMaterialsAdmin;
