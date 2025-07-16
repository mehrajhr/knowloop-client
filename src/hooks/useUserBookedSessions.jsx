import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserBookedSessions = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const userBookedSessions = useQuery({
    queryKey: ["bookedSessions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/booked-sessions/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });
  return userBookedSessions;
};

export default useUserBookedSessions;
