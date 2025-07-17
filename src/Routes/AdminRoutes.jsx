import React from "react";
import useUserRole from "../hooks/useUserRole ";
import useAuth from "../hooks/useAuth";
import Loading from "../Pages/Loading/Loading";
import { Navigate } from "react-router";

const AdminRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loading></Loading>;
  }
  if (role !== "admin" || !user) {
    return <Navigate to="/forbidden"></Navigate>;
  }
  return children;
};
export default AdminRoutes;
