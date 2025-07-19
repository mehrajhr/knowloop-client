import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AllTutors = () => {
  const axiosInstance = useAxiosSecure();

  const { data: tutors = [], isLoading, isError } = useQuery({
    queryKey: ['all-tutors'],
    queryFn: async () => {
      const res = await axiosInstance.get('users/role/tutor');
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center mt-10">Loading tutors...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Failed to load tutors</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">📘 All Tutors</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div
            key={tutor._id}
            className="border border-gray-200 shadow-lg rounded-xl p-4 hover:shadow-xl transition-all bg-base-100"
          >
            <img
              src={tutor.photo}
              alt={tutor.name}
              className="w-24 h-24 rounded-full mx-auto border-2 border-primary object-cover"
            />
            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold">{tutor.name}</h3>
              <p className="text-sm text-gray-500">{tutor.email}</p>
              <span className="badge badge-info mt-2">Tutor</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTutors;
