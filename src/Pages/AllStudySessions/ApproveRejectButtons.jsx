import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import { Modal, Input, Radio } from "antd";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ApproveRejectButtons = ({ sessionId, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState("free");
  const [fee, setFee] = useState("0");

  const handleApprove = async () => {
    const finalFee = type === "paid" ? parseFloat(fee) : 'Free';

    try {
      const res = await axiosSecure.patch(`sessions/approve/${sessionId}`, {
        fee: finalFee,
        status: "approved",
      });
      if (res.data.success) {
        Swal.fire("Approved!", "Session has been approved.", "success");
        refetch();
        setModalOpen(false);
      }
    } catch {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const handleReject = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This session will be removed from the pending list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`sessions/reject/${sessionId}`);
      if (res.data.success) {
        Swal.fire("Rejected", "Session has been rejected.", "success");
        refetch();
      }
    } catch {
      Swal.fire("Error", "Failed to reject session.", "error");
    }
  };

  return (
    <div className="flex gap-2">
      {/* ✅ Approve Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="btn btn-success btn-sm"
      >
        Approve
      </button>

      {/* ❌ Reject Button */}
      <button onClick={handleReject} className="btn btn-error btn-sm">
        Reject
      </button>

      {/* Modal for Approval */}
      <Modal
        open={modalOpen}
        title="Approve Session"
        onCancel={() => setModalOpen(false)}
        onOk={handleApprove}
        okText="Approve"
      >
        <div className="space-y-4">
          <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
            <Radio value="free">Free</Radio>
            <Radio value="paid">Paid</Radio>
          </Radio.Group>

          {type === "paid" && (
            <Input
              type="number"
              min={1}
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="Enter Fee Amount"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ApproveRejectButtons;
