import { useParams } from "react-router";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const CheckoutForm = () => {
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const {user} = useAuth();

  // 🔹 Fetch the session info from backend
  const { data: session, isLoading } = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`sessions/${id}`);
      return res.data;
    },
  });

  // 🔹 Create payment intent when session is loaded
  useEffect(() => {
    if (session?.fee && session.fee > 0) {
      axiosSecure
        .post("create-payment-intent", { amount: session.fee })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [session, axiosSecure]);

  // 🔹 Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      });

    if (confirmError) {
      setError(confirmError.message);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      setTransactionId(paymentIntent.id);

      // 🔸 Save transaction
      await axiosSecure.post("transactions", {
        sessionId: session._id,
        studentEmail: user?.email,
        tutorEmail: session.tutor_email,
        amount: session.fee,
        transactionId: paymentIntent.id,
        date: new Date(),
      });

      // 🔸 Update session payment status
      await axiosSecure.patch(`sessions/payment/${session._id}`, {
        payment_status: "paid",
        studentEmail: user?.email
      })
      .then(res => {
        // console.log(res.data);
      })
      .catch(err => {
        // console.log(err);
      });

      Swal.fire({
        icon: "success",
        title: "Payment Successful",
        text: `Transaction ID: ${paymentIntent.id}`,
      });
    }
  };

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Pay for: {session?.title}
      </h2>
      <p className="mb-2 text-center text-gray-700">
        Tutor: {session?.tutorName}
      </p>
      <p className="mb-4 text-center text-lg text-blue-600 font-semibold">
        Amount: ${session?.fee}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement className="border p-4 rounded-md" />
        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={!stripe || !clientSecret}
        >
          Pay Now
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {transactionId && (
        <p className="text-green-600 mt-2">
          Payment successful! Transaction ID: {transactionId}
        </p>
      )}
    </div>
  );
};

export default CheckoutForm;
