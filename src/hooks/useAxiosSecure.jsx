import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosInstance = axios.create({
  baseURL: "https://know-loop-server.vercel.app/",
});

const useAxiosSecure = () => {
  const { user, logOutUser , loading} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.accessToken) {
      // Add request interceptor
      const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          return config;
        }
      );

      // Add response interceptor
      const responseInterceptor = axiosInstance.interceptors.response.use(
        (res) => res,
        (err) => {
          if(err?.response?.status === 403){
            navigate('/forbidden');
          }
          else if (err?.response?.status === 401) {
            logOutUser()
              .then(() => {
                navigate('/login');
              })
              .catch(console.error);
          }
          return Promise.reject(err);
        }
      );

      // Cleanup to prevent multiple interceptors on re-renders
      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [user , loading , logOutUser]);

  return axiosInstance;
};

export default useAxiosSecure;