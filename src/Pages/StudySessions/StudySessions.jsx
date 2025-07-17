import { useState } from "react";
import { FaBookOpen, FaClock, FaSearch, FaTimesCircle } from "react-icons/fa";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth";
import useAvailableSessions from "../../hooks/useAvailableSessions";
import { Link } from "react-router";
import useUserBookedSessions from "../../hooks/useUserBookedSessions";
import useCancelBooking from "../../hooks/useCancelBookingCore";
import Loading from "../Loading/Loading";

const StudySessions = () => {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const { data: sessions = [], isLoading } = useAvailableSessions();

  // ✅ Get user's booked sessions
  const { data: bookedData = [] } = useUserBookedSessions();
  const cancelBooking = useCancelBooking();

  const bookedIds = bookedData.map((item) => item.sessionId);

  const today = new Date();

  const isOngoing = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return today >= startDate && today <= endDate;
  };

  const handleCancel = async (sessionId) => {
    cancelBooking(sessionId);
  };

  const filteredSessions = sessions.filter((session) => {
    const titleMatch =
      session.title.toLowerCase().includes(searchText.toLowerCase()) ||
      session.tutor?.toLowerCase().includes(searchText.toLowerCase());

    const ongoing = isOngoing(
      session.registrationStartDate,
      session.registrationEndDate
    );

    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "ongoing" && ongoing) ||
      (statusFilter === "closed" && !ongoing);

    const isFree = session.fee === 0 || session.fee?.toLowerCase?.() === "free";

    const priceMatch =
      priceFilter === "all" ||
      (priceFilter === "free" && isFree) ||
      (priceFilter === "paid" && !isFree);

    return titleMatch && statusMatch && priceMatch;
  });

  if (isLoading)
    return <Loading></Loading>;

  return (
    <section className="py-10 bg-base-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          All Study Sessions
        </h2>

        {/* 🔍 Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or tutor..."
              className="input input-bordered w-full pl-10"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto">
            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="closed">Closed</option>
            </select>

            <select
              className="select select-bordered"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* 📚 Sessions */}
        {filteredSessions.length === 0 ? (
          <p className="text-center text-gray-500">No sessions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => {
              const ongoing = isOngoing(
                session.registrationStartDate,
                session.registrationEndDate
              );
              const isBooked = bookedIds.includes(session._id);

              return (
                <div
                  key={session._id}
                  className="card bg-base-200 shadow-md border"
                >
                  <div className="card-body">
                    <h3 className="text-xl font-semibold">
                      <FaBookOpen className="inline mr-2 text-primary" />
                      {session.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {session.description}
                    </p>

                    <p className="text-sm">
                      <strong>Fee:</strong>{" "}
                      <span className="text-success">{session.fee!=="Free"&&'$'}{session.fee}</span>
                    </p>

                    <p className="mt-2 text-sm">
                      <FaClock className="inline mr-1 text-info" />
                      <strong>Registration:</strong>{" "}
                      {format(
                        new Date(session.registrationStartDate),
                        "MMM dd"
                      )}{" "}
                      -{" "}
                      {format(new Date(session.registrationEndDate), "MMM dd")}
                    </p>

                    <p className="text-sm mt-1">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          ongoing ? "text-success" : "text-error"
                        }`}
                      >
                        {ongoing ? "Ongoing" : "Closed"}
                      </span>
                    </p>

                    <div className="card-actions mt-4 flex gap-2">
                      {isBooked && user && ongoing ? (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleCancel(session._id)}
                        >
                          <FaTimesCircle className="mr-1" />
                          Cancel Booking
                        </button>
                      ) : (
                        <Link to={`/study-sessions/${session._id}`}>
                          <button
                            className={`btn btn-sm ${
                              ongoing && user ? "btn-primary" : "btn-disabled"
                            }`}
                            disabled={!user || !ongoing}
                          >
                            {ongoing
                              ? user
                                ? "Book Now"
                                : "Login to Book"
                              : "Registration Closed"}
                          </button>
                        </Link>
                      )}

                      <Link to={`/study-sessions/${session._id}`}>
                        <button className="btn btn-sm btn-outline">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default StudySessions;
