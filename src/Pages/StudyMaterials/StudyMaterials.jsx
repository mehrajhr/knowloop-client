import { useQuery } from "@tanstack/react-query";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../Loading/Loading";

const StudyMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["student-materials", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`student/materials?email=${user?.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📚 Your Study Materials</h2>
      {materials.length === 0 ? (
        <p className="text-gray-500">No study materials available for your booked sessions.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div key={material._id} className="card shadow-xl border border-base-300">
              <figure>
                <img src={material.image} alt="Material" className="w-full h-56 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="font-semibold text-lg mb-2">{material.title}</h2>
                <p className="text-sm text-gray-500 mb-3">
                  Session ID: <span className="font-medium">{material.sessionId}</span>
                </p>
                <div className="flex justify-between items-center mt-3">
                  <a
                    href={material.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline btn-info"
                  >
                    <FiExternalLink className="mr-1" /> View Link
                  </a>
                  <a href={material.image} download className="btn btn-sm btn-outline btn-success">
                    <FiDownload className="mr-1" /> Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;
