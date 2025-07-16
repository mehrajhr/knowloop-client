import { useState } from "react";
import { useNavigate } from "react-router";
import { FaStickyNote, FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CreateNote = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      return Swal.fire("Required", "Please fill in all fields", "warning");
    }

    try {
      const res = await axiosSecure.post("/notes", {
        email: user.email,
        title,
        description,
      });

      if (res.data.success) {
        Swal.fire("Created!", "Note created successfully.", "success");
        navigate("/manage-notes");
      }
    } catch {
      Swal.fire("Error", "Failed to create note", "error");
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <div className="card bg-base-200 shadow-md">
        <form onSubmit={handleSubmit} className="card-body space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaStickyNote className="text-primary" /> Create a Note
          </h2>

          <div>
            <label className="label">Your Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your notes here..."
              rows={5}
              required
            ></textarea>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/manage-notes")}
              className="btn btn-outline flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
            <button type="submit" className="btn btn-primary">
              Save Note
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateNote;
