import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  const {
    data,
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`role/users?email=${user.email}`);
      return res.data;
    },
  });

  return {
    role : data?.role,
    roleLoading,
    refetchRole: refetch,
  };
};

export default useUserRole;
