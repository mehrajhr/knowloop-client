import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ApproveRejectButtons from "./ApproveRejectButtons";
import { Select } from "antd";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";

const AllStudySessions = () => {
  const axiosSecure = useAxiosSecure();
  const [filter, setFilter] = useState("all");
  const [updateSessionId, setUpdateSessionId] = useState(null);
  const [isFree, setIsFree] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  const {
    data: sessions = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["all-study-sessions", filter],
    queryFn: async () => {
      const res = await axiosSecure.get(`sessions?status=${filter}`);
      return res.data;
    },
  });

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const handleUpdate = (session) => {
    setUpdateSessionId(session._id);
    setIsFree(session.fee === 'Free');
    reset({
      isFree: session.fee === 'Free' ? "yes" : "no",
      price: session.fee || 0,
    });
    document.getElementById("updateModal").checked = true;
  };

  const onUpdateSubmit = async (data) => {
    const updatedPrice =
      data.isFree === "yes" ? "Free" : parseFloat(data.price);

    try {
      const res = await axiosSecure.patch(`sessions/${updateSessionId}`, {
        price: updatedPrice,
      });
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success!", "Session updated successfully.", "success");
        document.getElementById("updateModal").checked = false;
        refetch();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update session", "error");
    }
  };

  // ✅ For Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This session will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`sessions/${id}`);
        refetch(); // re-fetch session list
        Swal.fire("Deleted!", "The session has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete session.", "error");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">All Study Sessions</h2>
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={handleFilterChange}
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
          ]}
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200 text-base font-semibold">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Tutor</th>
                <th>Reg. Dates</th>
                <th>Class Dates</th>
                <th>Duration</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={session._id}>
                  <td>{index + 1}</td>
                  <td>{session.title}</td>
                  <td>
                    <div className="font-medium">
                      {session.tutor}
                      <br />
                      <span className="text-sm text-gray-500">
                        {session.tutor_email}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span>{session.registrationStartDate}</span> -{" "}
                    <span>{session.registrationEndDate}</span>
                  </td>
                  <td>
                    <span>{session.classStartDate}</span> -{" "}
                    <span>{session.classEndDate}</span>
                  </td>
                  <td>{session.duration}</td>
                  <td>
                    {session.fee !== "Free" && "$"}
                    {`${session.fee}`}
                  </td>
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
                    {session.status === "pending" ? (
                      <ApproveRejectButtons
                        sessionId={session._id}
                        refetch={refetch}
                      />
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(session)}
                          className="btn btn-info btn-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(session._id)}
                          className="btn btn-error btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Price Modal */}
      <input type="checkbox" id="updateModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Update Session Price</h3>
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Is it Free?</span>
              </label>
              <select
                {...register("isFree", { required: true })}
                className="select select-bordered"
                onChange={(e) => setIsFree(e.target.value === "yes")}
              >
                <option value="yes">Yes (Free)</option>
                <option value="no">No (Paid)</option>
              </select>
            </div>

            {!isFree && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  {...register("price", { required: true })}
                  className="input input-bordered"
                />
              </div>
            )}

            <div className="modal-action">
              <button className="btn btn-success" type="submit">
                Update
              </button>
              <label htmlFor="updateModal" className="btn">
                Cancel
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AllStudySessions;
