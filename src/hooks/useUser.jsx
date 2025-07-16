import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useUser = (email) => {
    const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["users", email],
    queryFn: async() => {
        const res = await axiosSecure.get(`users/${email}`);
        return res.data;
    },
    enabled: !!email, // Only run if email is provided
  });
};
