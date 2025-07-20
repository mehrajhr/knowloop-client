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
  if (!user) {
    return <Navigate to="/login"></Navigate>;
  } else if (role !== "tutor") {
    return <Navigate to="/forbidden"></Navigate>;
  } else return children;
};

export default TutorRoutes;
