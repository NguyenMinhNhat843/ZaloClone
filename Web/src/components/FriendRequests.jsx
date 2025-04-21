import { Bell } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

const sentRequests = [
  {
    id: 1,
    name: "Nguyễn Trọng Tiến",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Thu Ha",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Le Trong Hien",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

export default function FriendRequests({}) {
  const [requesters, setRequesters] = useState([]);
  const base_url = "http://localhost:3000";
  const token = localStorage.getItem("accessToken");
  const [userId, setUserId] = useState(null);
  const socketRef = useRef(null);

  // Khởi tạo socket
  useEffect(() => {
    socketRef.current = io(base_url, {
      auth: { token },
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);

  // Lấy thông tin người dùng hiện tại
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${base_url}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Lỗi khi lấy thông tin người dùng");
        const user = await res.json();
        setUserId(user._id);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchUserInfo();
  }, [token]);

  useEffect(() => {
    const fetchPendingFriendship = async () => {
      if (!userId) return;

      try {
        // Lấy danh sách lời mời kết bạn
        const res = await fetch(`${base_url}/friendship/pending`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Lỗi khi lấy danh sách lời mời");

        const pending = await res.json();
        const received = pending.filter(
          (req) => req.recipient === userId && req.status === "pending"
        );
        console.log("Data: ", received);

        // Fetch user info for each requester
        const requesterIds = received.map((req) => req.requester);
        const requesterInfos = await Promise.all(
          requesterIds.map(async (id) => {
            try {
              const res = await fetch(`${base_url}/users/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!res.ok) {
                throw new Error(`Lỗi khi lấy thông tin người dùng ${id}`);
              }

              const data = await res.json();
              return { ...data, requestId: received.find((req) => req.requester === id)._id }; // Include requestId
            } catch (err) {
              console.log(err.message);
              return null;
            }
          })
        );

        // Filter out null values and set requesters
        const validUsers = requesterInfos.filter((user) => user !== null);
        console.log("Data users: ", validUsers);
        setRequesters(validUsers);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (userId) {
      fetchPendingFriendship();
    }
  }, [userId, token]);

  const handleAcceptRequest = async (requestId) => {
    try {
      const res = await fetch(`${base_url}/friendship/accept/${requestId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Lỗi khi chấp nhận lời mời");
      alert("Chấp nhận lời mời thành công!");
      // Optionally, update the requesters list to remove the accepted request
      setRequesters((prev) => prev.filter((user) => user.requestId !== requestId));
    } catch (err) {
      console.error("Lỗi khi chấp nhận lời mời: ", err);
      alert("Lỗi khi chấp nhận lời mời");
    }
  };

  return (
    <div className="h-full w-full rounded-lg bg-gray-100 shadow-md">
      <div className="sticky top-0 z-10 w-full bg-white shadow-md">
        <h2 className="flex items-center p-4 text-lg font-semibold">
          <span className="mr-3">
            <Bell className="mr-2 h-5 w-5" />
          </span>
          <span className="mr-2">Lời mời kết bạn</span>
        </h2>
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Lời mời nhận được ({requesters.length})
        </h3>

        {requesters.length === 0 ? (
          <div className="rounded-lg bg-gray-100 p-6 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
              alt="Empty mailbox"
              className="mx-auto mb-2 h-24 w-24 opacity-70"
            />
            <p className="text-gray-500">Bạn không có lời mời nào</p>
          </div>
        ) : (
          <div
            className="mt-5 grid justify-center gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {requesters.map((user) => (
              <div
                key={user._id}
                className="mx-auto flex w-full max-w-[280px] flex-col justify-between rounded-xl bg-white p-4 shadow"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">2 giờ trước</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptRequest(user.requestId)}
                  className="rounded-md bg-blue-500 py-2 text-sm text-white transition hover:bg-blue-600"
                >
                  Chấp nhận lời mời
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Lời mời đã gửi ({sentRequests.length})
        </h3>

        <div
          className="mt-5 grid justify-center gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {sentRequests.map((user) => (
            <div
              key={user.id}
              className="mx-auto flex w-full max-w-[280px] flex-col justify-between rounded-xl bg-white p-4 shadow"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.time || "Bạn đã gửi lời mời"}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8a9 9 0 110-18 9 9 0 010 18z"
                    />
                  </svg>
                </div>
              </div>
              <button className="rounded-md bg-gray-100 py-2 text-sm text-gray-700 transition hover:bg-gray-200">
                Thu hồi lời mời
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-sm text-gray-600 hover:underline">
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
}