import React, { useState } from "react";
import Swal from "sweetalert2";
import { Modal, Input, Radio } from "antd";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ApproveRejectButtons = ({ sessionId, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [type, setType] = useState("free");
  const [fee, setFee] = useState("0");

  // New rejection fields
  const [rejectionReason, setRejectionReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleApprove = async () => {
    const finalFee = type === "paid" ? parseFloat(fee) : "Free";

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

  const handleRejectSubmit = async () => {
    if (!rejectionReason || !feedback) {
      Swal.fire("Warning", "Please fill all fields.", "warning");
      return;
    }

    try {
      const res = await axiosSecure.patch(`sessions/reject/${sessionId}`, {
        reason: rejectionReason,
        feedback,
      });

      if (res.data.success) {
        Swal.fire(
          "Rejected",
          "Session has been rejected with feedback.",
          "success"
        );
        setRejectionReason("");
        setFeedback("");
        setRejectModalOpen(false);
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
      <button
        onClick={() => setRejectModalOpen(true)}
        className="btn btn-error btn-sm"
      >
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

      {/* Modal for Rejection */}
      <Modal
        open={rejectModalOpen}
        title="Reject Session"
        onCancel={() => setRejectModalOpen(false)}
        onOk={handleRejectSubmit}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <div className="space-y-4">
          <Input
            placeholder="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <Input.TextArea
            placeholder="Feedback for the tutor"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ApproveRejectButtons;
