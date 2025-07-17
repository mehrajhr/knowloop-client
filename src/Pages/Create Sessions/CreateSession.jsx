import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CreateSession = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const sessionData = {
      ...data,
      tutor: user?.displayName,
      tutor_email: user?.email,
      fee: "0", // default
      status: "pending",
    };

    try {
      const res = await axiosSecure.post("study-sessions", sessionData);
      if (res.data.insertedId) {
        Swal.fire("Success", "Study session created successfully!", "success");
        reset();
      }
    } catch {
      Swal.fire("Error", "Failed to create session", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">Create Study Session</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Session Title</label>
          <input
            {...register("title", { required: true })}
            type="text"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Tutor Name</label>
          <input
            value={user?.displayName}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Tutor Email</label>
          <input
            value={user?.email}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Session Description</label>
          <textarea
            {...register("description", { required: true })}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Registration Start Date</label>
            <input
              {...register("registrationStartDate", { required: true })}
              type="date"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Registration End Date</label>
            <input
              {...register("registrationEndDate", { required: true })}
              type="date"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Class Start Date</label>
            <input
              {...register("classStartDate", { required: true })}
              type="date"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Class End Date</label>
            <input
              {...register("classEndDate", { required: true })}
              type="date"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div>
          <label className="label">Session Duration</label>
          <input
            {...register("duration", { required: true })}
            type="text"
            className="input input-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Create Session
        </button>
      </form>
    </div>
  );
};

export default CreateSession;
