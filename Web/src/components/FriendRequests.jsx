import { Bell, ChevronRight } from "lucide-react";
import { useEffect } from "react";

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

const receiverRequests = [
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

export default function FriendRequests() {

  

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
          Lời mời nhận được ({receiverRequests.length})
        </h3>

        {receiverRequests.length === 0 ? (
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
            {receiverRequests.map((user) => (
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
                      <p className="text-xs text-gray-500">2 giờ trước</p>
                    </div>
                  </div>
                </div>
                <button className="rounded-md bg-blue-500 py-2 text-sm text-white transition hover:bg-blue-600">
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
                  {/* Icon chat giả lập */}
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
