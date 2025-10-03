import React from "react";
import { Link, NavLink } from "react-router";
import logo from "../../assets/knowlooplogo.png";
import useAuth from "../../hooks/useAuth";
import DrawerMenuButton from "./DrawerMenuButton";
import { useUser } from "../../hooks/useUser";
import Loading from "../Loading/Loading";
import {
  FaHome,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaInfoCircle,
  FaLightbulb,
} from "react-icons/fa";
import "./navlinkStyle.css";

const Navbar = () => {
  const { user } = useAuth();
  const { data: currentUser, isLoading } = useUser(user?.email);

  if (isLoading) {
    <Loading></Loading>;
  }

  const links = (
    <>
      <li className="my-2 md:mx-2 md:my-0">
        <NavLink to="/">
          <FaHome /> Home
        </NavLink>
      </li>

      <li className="my-2 md:mx-2 md:my-0">
        <NavLink to="/study-sessions">
          <FaChalkboardTeacher /> Study Sessions
        </NavLink>
      </li>

      <li className="my-2 md:mx-2 md:my-0">
        <NavLink to="/all-tutors" className="flex items-center gap-2">
          <FaUserGraduate /> All Tutors
        </NavLink>
      </li>

      <li className="my-2 md:mx-2 md:my-0">
        <NavLink to="/tips" className="flex items-center gap-2">
          <FaLightbulb /> Tips
        </NavLink>
      </li>

      <li className="my-2 md:mx-2 md:my-0">
        <NavLink to="/about" className="flex items-center gap-2">
          <FaInfoCircle /> About
        </NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 right-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow navbar-links"
          >
            {links}
          </ul>
        </div>
        <img className="h-16 fles justify-center items-center" src={logo}></img>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 navbar-links">{links}</ul>
      </div>
      <div className="navbar-end">
        <div className="flex gap-4 justify-center items-center">
          {user ? (
            <>
              <img
                className="h-12 w-12 rounded-full"
                src={currentUser?.photo}
                alt=""
              />
              <DrawerMenuButton></DrawerMenuButton>
            </>
          ) : (
            <>
              <Link
                className="text-gray-600 text-xl hover:btn-link"
                to="/login"
              >
                Login
              </Link>
              <Link className="btn btn-primary rounded-xl" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
