import { Bell, ChevronRight } from "lucide-react";

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

export default function FriendRequests() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="sticky top-0 z-10 w-full bg-white shadow-md">
        <h2 className="flex items-center p-4 text-lg font-semibold">
          <span className="mr-3">
          <Bell className="w-5 h-5 mr-2" />

          </span>
          <span className="mr-2">Lời mời kết bạn</span>
        </h2>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
          alt="Empty mailbox"
          className="w-24 h-24 mx-auto mb-2 opacity-70"
        />
        <p className="text-gray-500">Bạn không có lời mời nào</p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm text-gray-500 mb-2">
          Lời mời đã gửi ({sentRequests.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sentRequests.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full mb-2"
              />
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500 mb-2">
                Bạn đã gửi lời mời
              </p>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded hover:bg-gray-200 transition">
                Thu hồi lời mời
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button className="text-sm text-gray-600 hover:underline">
            Xem thêm
          </button>
        </div>
      </div>

      <div className="mt-6 text-sm text-blue-500 flex items-center cursor-pointer hover:underline">
        Gợi ý kết bạn (50)
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
}
