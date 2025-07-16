import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../Loading/Loading";
import useCancelBookingCore from "../../hooks/useCancelBookingCore";

const StudySessionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const cancelBooking = useCancelBookingCore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const {
    data: session = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useQuery({
    queryKey: ["bookingStatus", id, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/booked-sessions/check?email=${user?.email}&sessionId=${id}`
      );
      const data = res.data;
      setAlreadyBooked(data.booked);

      if (data.booked && data.paymentStatus === "unpaid") {
        setBookingInProgress(true);
        setShowPaymentOptions(true);
        const now = new Date();
        const bookedAt = new Date(data.bookedAt);
        const elapsed = Math.floor((now - bookedAt) / 1000);
        const remaining = 900 - elapsed;

        if (remaining > 0) {
          setTimeLeft(remaining);
          setTimerActive(true);
        } else {
          cancelBookingDueToTimeout();
        }
      }

      return data;
    },
    enabled: !!user && !!id,
  });

  useEffect(() => {
    if (!timerActive || !bookingInProgress) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          cancelBookingDueToTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, bookingInProgress]);

  const cancelBookingDueToTimeout = async () => {
    try {
      await axiosSecure.delete(
        `/booked-sessions?email=${user.email}&sessionId=${session._id}`
      );
      Swal.fire(
        "⏳ Time Expired!",
        "Your booking was automatically canceled after 15 minutes.",
        "warning"
      );
      setAlreadyBooked(false);
      setBookingInProgress(false);
      setShowPaymentOptions(false);
      setTimerActive(false);
    } catch {
      Swal.fire("Error", "Failed to cancel expired booking.", "error");
    }
  };

  const handleBookNow = async () => {
    if (!user) return;

    const bookingData = {
      sessionId: session._id,
      studentEmail: user.email,
      studentName: user.displayName,
      tutorEmail: session.tutor_email,
      tutorName: session.tutor,
      sessionTitle: session.title,
      fee: session.fee,
      bookedAt: new Date(),
      paymentStatus: isFree ? "free" : "unpaid",
    };

    try {
      const res = await axiosSecure.post("/booked-sessions", bookingData);
      if (res.data.success) {
        Swal.fire(
          "🎉 Booking Started!",
          isFree ? "Booked successfully!" : "Proceed to payment.",
          "success"
        );
        setAlreadyBooked(true);
        setBookingInProgress(true);

        if (!isFree) {
          setShowPaymentOptions(true);
          setTimeLeft(900);
          setTimerActive(true);
        }
      } else {
        Swal.fire("Failed", res.data.message || "Booking failed", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong while booking.", "error");
    }
  };

  const handleCancelBooking = async () => {
    const success = await cancelBooking(session._id);
    if (success) {
      setAlreadyBooked(false);
      setBookingInProgress(false);
      setShowPaymentOptions(false);
      setTimerActive(false);
    }
  };

  const reviewMutation = useMutation({
    mutationFn: async ({ reviewText, rating }) => {
      const res = await axiosSecure.post(`sessions/review/${session._id}`, {
        studentName: user.displayName,
        reviewText,
        rating,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Thank you!", "Your review has been submitted.", "success");
      setReviewText("");
      setRating(5);
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Failed to submit review.", "error");
    },
  });

  const handleSubmitReview = () => {
    if (!reviewText || !rating) return;
    reviewMutation.mutate({ reviewText, rating });
  };

  if (isLoading) return <Loading />;
  if (!session?._id)
    return (
      <div className="text-center text-red-500 mt-10">Session not found.</div>
    );

  const {
    title,
    tutor,
    tutor_email,
    description,
    registrationStartDate,
    registrationEndDate,
    classStartDate,
    classEndDate,
    duration,
    fee,
    reviews = [],
    averageRating,
  } = session;

  const now = new Date();
  const isOngoing =
    now >= new Date(registrationStartDate) &&
    now <= new Date(registrationEndDate);
  const isFree = fee === 0 || fee?.toString()?.toLowerCase() === "free";
  const canReview =
    alreadyBooked && (isFree || (!isFree && !bookingInProgress));

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaBookOpen className="text-primary" /> {title}
          </h2>
          <p className="text-sm mt-1 text-gray-600">{description}</p>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <FaUser className="inline mr-2 text-info" />{" "}
              <strong>Tutor:</strong> {tutor}
            </p>
            <p>
              <FaStar className="inline mr-2 text-yellow-500" />{" "}
              <strong>Rating:</strong> {averageRating || "N/A"}
            </p>
            <p>
              <FaCalendarAlt className="inline mr-2 text-secondary" />{" "}
              <strong>Registration:</strong>{" "}
              {format(new Date(registrationStartDate), "PPP")} –{" "}
              {format(new Date(registrationEndDate), "PPP")}
            </p>
            <p>
              <FaCalendarAlt className="inline mr-2 text-secondary" />{" "}
              <strong>Class:</strong> {format(new Date(classStartDate), "PPP")}{" "}
              – {format(new Date(classEndDate), "PPP")}
            </p>
            <p>
              <FaClock className="inline mr-2 text-info" />{" "}
              <strong>Duration:</strong> {duration}
            </p>
            <p>
              <strong>Fee:</strong>{" "}
              {isFree ? (
                <span className="text-success">Free</span>
              ) : (
                <span className="text-warning">{fee}</span>
              )}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {isOngoing ? (
                <span className="text-success">Ongoing</span>
              ) : (
                <span className="text-error">Closed</span>
              )}
            </p>
          </div>

          <div className="mt-6 space-x-2">
            <button
              onClick={handleBookNow}
              className={`btn ${
                user && isOngoing && !alreadyBooked
                  ? "btn-primary"
                  : "btn-disabled"
              }`}
              disabled={!user || !isOngoing || alreadyBooked}
            >
              {alreadyBooked
                ? "Already Booked"
                : !isOngoing
                ? "Registration Closed"
                : user
                ? "Book Now"
                : "Login to Book"}
            </button>

            {alreadyBooked && isFree && (
              <button onClick={handleCancelBooking} className="btn btn-warning">
                Cancel Booking
              </button>
            )}
          </div>

          {bookingInProgress && showPaymentOptions && !isFree && (
            <div className="mt-6 p-4 bg-base-100 rounded-lg border space-y-2">
              <h4 className="text-lg font-semibold">Complete Your Booking</h4>
              <p className="text-sm text-error">
                ⏳ Time left:{" "}
                <strong>
                  {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
                </strong>
              </p>
              <button
                onClick={() => navigate(`/payment/${session._id}`)}
                className="btn btn-success"
              >
                Proceed to Payment
              </button>
              <button
                onClick={handleCancelBooking}
                className="btn btn-outline btn-error ml-2"
              >
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>

      <Link
        to="/study-sessions"
        className="btn btn-outline w-fit mx-auto my-4 flex items-center gap-2"
      >
        <FaArrowLeft /> Back to All Sessions
      </Link>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Student Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, idx) => (
              <div key={idx} className="bg-base-100 p-4 rounded border">
                <p className="font-semibold text-primary">{r.studentName}</p>
                <p className="italic text-sm text-gray-600">"{r.reviewText}"</p>
                <p className="text-yellow-500 text-sm">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar
                      key={i}
                      className={`inline mr-1 ${
                        i < r.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </p>
              </div>
            ))}
          </div>
        )}

        {canReview && (
          <div className="mt-6 space-y-3">
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={`cursor-pointer text-2xl ${
                    i < rating ? "text-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>

            <button onClick={handleSubmitReview} className="btn btn-primary">
              Submit Review
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudySessionDetails;
