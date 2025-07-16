// src/hooks/useCancelBookingCore.js
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useCancelBookingCore = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const cancelBooking = async (sessionId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return false;

    try {
      const res = await axiosSecure.delete(
        `/booked-sessions?email=${user.email}&sessionId=${sessionId}`
      );
      if (res.data.success) {
        Swal.fire("Canceled", "Booking has been canceled", "success");
        queryClient.invalidateQueries(["bookedSessions", user.email]);
        return true;
      } else {
        Swal.fire("Info", res.data.message || "Already canceled", "info");
        return false;
      }
    } catch {
      Swal.fire("Error", "Failed to cancel booking", "error");
      return false;
    }
  };

  return cancelBooking;
};

export default useCancelBookingCore;
