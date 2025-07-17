import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSearch, FiEdit3 } from "react-icons/fi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/users?search=${search}`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return axiosSecure.patch(`/admin/users/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users", search]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "User role updated",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const handleRoleChange = (id, newRole) => {
    Swal.fire({
      title: "Do you want to change his rule?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Change",
      denyButtonText: `Don't change`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        mutation.mutate({ id, role: newRole });
      } else if (result.isDenied) {
        Swal.fire("Not changes his rule", "", "info");
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👥 Manage Users</h2>

      <div className="form-control mb-4 w-full md:w-1/2">
        <label className="input input-bordered flex items-center gap-2">
          <FiSearch />
          <input
            type="text"
            className="grow"
            placeholder="Search by name or email"
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {isLoading ? (
        <div className="text-center">Loading users...</div>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200 text-base">
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Update Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user._id}>
                  <td>{idx + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge badge-info badge-outline">
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <select
                      className="select select-sm select-bordered w-full max-w-xs"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option disabled>Update Role</option>
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
