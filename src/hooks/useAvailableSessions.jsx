import React from "react";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useAvailableSessions = () => {
  const axiosSecure = useAxiosSecure();

  const sessions = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await axiosSecure.get("sessions");
      return res.data;
    },
  });
  return sessions;
};

export default useAvailableSessions;
