import React from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole ";
import Loading from "../Pages/Loading/Loading";
import { Navigate } from "react-router";

const TutorRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loading></Loading>;
  }
  if (role !== "tutor" || !user) {
    return <Navigate to="/forbidden"></Navigate>;
  }
  return children;
};

export default TutorRoutes;
