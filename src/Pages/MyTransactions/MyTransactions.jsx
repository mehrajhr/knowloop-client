import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyTransactions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`transactions?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        My Transactions
      </h2>
      <table className="table table-zebra w-full border rounded-lg">
        <thead className="bg-base-200">
          <tr>
            <th>#</th>
            <th>Transaction ID</th>
            <th>Session ID</th>
            <th>Tutor Email</th>
            <th>Amount ($)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={txn._id}>
              <td>{index + 1}</td>
              <td className="text-blue-600 break-all">{txn.transactionId}</td>
              <td>{txn.sessionId}</td>
              <td>{txn.tutorEmail}</td>
              <td>${txn.amount}</td>
              <td>{format(new Date(txn.date), "PPpp")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTransactions;
