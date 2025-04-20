import { useState, useEffect } from "react";

const useFriendRequest = (userId, token) => {
  const [requestStatus, setRequestStatus] = useState(null); // null, pending, accepted
  const [error, setError] = useState(null);

  // Kiểm tra trạng thái yêu cầu kết bạn khi userId hoặc token thay đổi
  useEffect(() => {
    const checkRequestStatus = async () => {
      if (!userId || !token) return;

      try {
        const res = await fetch(
          `http://localhost:3000/friendship/status/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setRequestStatus(data.status); // Giả định API trả về "pending" hoặc "accepted"
        } else {
          setRequestStatus(null);
          setError("Không thể kiểm tra trạng thái yêu cầu kết bạn.");
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái yêu cầu:", err);
        setRequestStatus(null);
        setError("Không thể kiểm tra trạng thái yêu cầu kết bạn.");
      }
    };

    checkRequestStatus();
  }, [userId, token]);

  const sendFriendRequest = async () => {
    if (!userId || !token) {
      setError("Thiếu thông tin để gửi yêu cầu kết bạn.");
      return { success: false, message: "Thiếu thông tin để gửi yêu cầu kết bạn." };
    }

    try {
      const res = await fetch(
        `http://localhost:3000/friendship/request/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Data user request add:", data);

      if (res.ok) {
        setRequestStatus("pending");
        return { success: true, message: "Đã gửi lời mời kết bạn." };
      } else {
        setError("Gửi lời mời kết bạn thất bại.");
        return { success: false, message: "Gửi lời mời kết bạn thất bại." };
      }
    } catch (error) {
      setError("Gửi lời mời kết bạn thất bại.");
      return { success: false, message: "Gửi lời mời kết bạn thất bại." };
    }
  };

  const resetRequestStatus = () => {
    setRequestStatus(null);
    setError(null);
  };

  return {
    requestStatus,
    error,
    sendFriendRequest,
    resetRequestStatus,
  };
};

export default useFriendRequest;