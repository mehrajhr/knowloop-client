import { Link } from "react-router";
import { FaEye, FaTimes, FaCreditCard } from "react-icons/fa";
import { format } from "date-fns";
import useUserBookedSessions from "../../hooks/useUserBookedSessions";
import useCancelBookingCore from "../../hooks/useCancelBookingCore";

const MyBookedSessions = () => {
  const cancel = useCancelBookingCore();

  const { data: bookings = [], refetch, isLoading } = useUserBookedSessions();

  const handleCancel = async (sessionId) => {
    const success = await cancel(sessionId);

    if(success){
      refetch();
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">My Booked Sessions</h2>

      {isLoading ? (
        <p className="text-center">Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200 text-base-content text-sm">
                <th>#</th>
                <th>Title</th>
                <th>Tutor</th>
                <th>Tutor Email</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Booked At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{index + 1}</td>
                  <td>{booking.sessionTitle}</td>
                  <td>{booking.tutorName}</td>
                  <td>{booking.tutorEmail}</td>
                  <td>
                   {
                    booking.fee
                   }
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        booking.paymentStatus === "paid"
                          ? "badge-success"
                          : booking.paymentStatus === "unpaid"
                          ? "badge-error"
                          : "badge-info"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {booking.bookedAt
                      ? format(new Date(booking.bookedAt), "PPpp")
                      : "N/A"}
                  </td>
                  <td className="space-x-1">
                    <Link to={`/study-sessions/${booking.sessionId}`}>
                      <button className="btn btn-xs btn-outline">
                        <FaEye className="inline mr-1" /> Details
                      </button>
                    </Link>

                    {booking.paymentStatus === "unpaid" && (
                      <>
                        <button
                          onClick={() =>
                            handleCancel(booking.sessionId)
                          }
                          className="btn btn-xs btn-outline btn-error"
                        >
                          <FaTimes className="inline mr-1" /> Cancel
                        </button>
                        <Link to={`/payment/${booking.sessionId}`}>
                          <button className="btn btn-xs btn-outline btn-success">
                            <FaCreditCard className="inline mr-1" /> Pay Now
                          </button>
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MyBookedSessions;
