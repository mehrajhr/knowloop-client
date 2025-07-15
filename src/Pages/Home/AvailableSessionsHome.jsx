import { useQuery } from "@tanstack/react-query";
import { FaBookOpen, FaClock } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { format } from "date-fns";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../Loading/Loading";

const AvailableSessionsHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await axiosSecure.get("sessions");
      return res.data;
    },
  });

  const today = new Date();

  const filtered = sessions.filter((s) => s.status === "approved").slice(0, 6);

  const isOngoing = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return today >= startDate && today <= endDate;
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <section className="py-10 bg-base-200">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Available Study Sessions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((session) => {
            const ongoing = isOngoing(
              session.registrationStartDate,
              session.registrationEndDate
            );
            return (
              <div
                key={session._id}
                className="card bg-base-100 shadow-md border"
              >
                <div className="card-body">
                  <h3 className="text-xl font-semibold">
                    <FaBookOpen className="inline mr-2 text-primary" />
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600">{session.description}</p>

                  <p className="mt-2 text-sm">
                    <FaClock className="inline mr-1 text-info" />
                    <strong>Registration:</strong>{" "}
                    {format(new Date(session.registrationStartDate), "MMM dd")}{" "}
                    - {format(new Date(session.registrationEndDate), "MMM dd")}
                  </p>

                  <p className="text-sm mt-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        ongoing ? "text-success" : "text-error"
                      }`}
                    >
                      {ongoing ? "Ongoing" : "Closed"}
                    </span>
                  </p>

                  <div className="card-actions mt-4">
                    <button className="btn btn-sm btn-outline">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn btn-outline btn-primary mx-auto mt-8 flex gap-0 justify-center items-center">
          See More <FaArrowRight className="ml-2" />
        </button>
      </div>
    </section>
  );
};

export default AvailableSessionsHome;
