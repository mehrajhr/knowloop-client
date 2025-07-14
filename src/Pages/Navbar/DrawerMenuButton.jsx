import { useState } from "react";
import { Link } from "react-router";
import { FiMenu, FiUser, FiEdit, FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const DrawerMenuButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { logOutUser , setUser } = useAuth();

  const handleLogout = () => {
    logOutUser()
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        setUser(null);
      })
      .catch((err) => {

      });
  };

  return (
    <div className="relative">
      {/* Menu Icon Button (put this inside your Navbar's right corner) */}
      <button
        className="btn btn-ghost text-xl"
        onClick={() => setIsDrawerOpen(true)}
      >
        <FiMenu />
      </button>

      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-opacity-40 z-40 transition-opacity duration-200 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      ></div>

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-base-200 z-50 shadow-lg transform transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="btn btn-xs btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Menu Links */}
        <ul className="menu p-4 text-base-content space-y-2">
          <li>
            <Link onClick={() => setIsDrawerOpen(false)}>
              <FiUser className="inline mr-2" /> My Profile
            </Link>
          </li>
          <li>
            <Link onClick={() => setIsDrawerOpen(false)}>
              <FiEdit className="inline mr-2" /> Update Profile
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                handleLogout();
                setIsDrawerOpen(false);
              }}
            >
              <FiLogOut className="inline mr-2" /> Logout
            </button>
          </li>
          {/* Add More Menu Items Here */}
        </ul>
      </div>
    </div>
  );
};

export default DrawerMenuButton;
