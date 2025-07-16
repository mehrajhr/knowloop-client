import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loading from "../Loading/Loading";
import { format } from "date-fns";

const ManageNotes = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`notes/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`notes/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Note has been deleted.", "success");
      queryClient.invalidateQueries(["notes", user?.email]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete note.", "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, title, description }) => {
      const res = await axiosSecure.patch(`notes/${id}`, {
        title,
        description,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Updated!", "Note has been updated.", "success");
      queryClient.invalidateQueries(["notes", user?.email]);
      setEditingNote(null);
      setTitle("");
      setDescription("");
    },
    onError: () => {
      Swal.fire("Error", "Failed to update note.", "error");
    },
  });

  const handleEdit = (note) => {
    setEditingNote(note._id);
    setTitle(note.title);
    setDescription(note.description);
  };

  const handleUpdate = () => {
    if (!title || !description) return;
    updateMutation.mutate({ id: editingNote, title, description });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Manage Your Notes</h2>
      <div className="overflow-x-auto bg-base-200 rounded-xl shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>CreatedAt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={note._id}>
                <td>{index + 1}</td>
                <td>
                  {editingNote === note._id ? (
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input input-bordered input-sm w-full"
                    />
                  ) : (
                    note.title
                  )}
                </td>
                <td>
                  {editingNote === note._id ? (
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="textarea textarea-bordered textarea-sm w-full"
                    ></textarea>
                  ) : (
                    <span className="line-clamp-2">{note.description}</span>
                  )}
                </td>
                <td>{format(new Date(note.createdAt), "pp , PP")}</td>
                <td className="flex gap-2">
                  {editingNote === note._id ? (
                    <button
                      onClick={handleUpdate}
                      className="btn btn-sm btn-success"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(note)}
                      className="btn btn-sm btn-warning"
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="btn btn-sm btn-error"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageNotes;
