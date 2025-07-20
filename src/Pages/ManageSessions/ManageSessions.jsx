import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FiSend } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../Loading/Loading";

const ManageStudySessions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["tutorSessions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`sessions?email=${user?.email}&status=all`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const resendMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/sessions/resend/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tutorSessions"]);
      Swal.fire("Success", data.message, "success");
    },
    onError: () => {
      Swal.fire("Error", "Something went wrong", "error");
    },
  });

  const handleResend = (id) => {
    Swal.fire({
      title: "Resend Approval Request?",
      text: "This will change the session status to 'pending'.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Resend",
    }).then((result) => {
      if (result.isConfirmed) {
        resendMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Manage Your Study Sessions
      </h2>

      <div className="overflow-x-auto shadow rounded-lg border">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Class Date</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Fee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={session._id}>
                <td>{index + 1}</td>
                <td>{session.title}</td>
                <td>
                  {session.classStartDate} to {session.classEndDate}
                </td>
                <td>{session.duration}</td>
                <td>
                  <span
                    className={`badge ${
                      session.status === "approved"
                        ? "badge-success"
                        : session.status === "pending"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {session.status}
                  </span>
                </td>
                <td>
                  {session.fee === "0" ? (
                    <span className="badge badge-accent">Free</span>
                  ) : (
                    `$${session.fee}`
                  )}
                </td>
                <td>
                  {session.status === "rejected" ? (
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => {
                          Swal.fire({
                            title: "Rejection Feedback",
                            html: `
              <p><strong>Reason:</strong> ${
                session.rejectionReason || "N/A"
              }</p>
              <p><strong>Feedback:</strong> ${
                session.rejectionFeedback || "N/A"
              }</p>
            `,
                            icon: "info",
                          });
                        }}
                      >
                        View Feedback
                      </button>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleResend(session._id)}
                      >
                        <FiSend className="mr-1" />
                        Resend
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No sessions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudySessions;
