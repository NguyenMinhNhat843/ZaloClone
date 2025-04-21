import { Search, Filter, MoreVertical, Users, SortAsc } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function GroupList() {
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const base_url = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("accessToken");

  // Lấy thông tin người dùng để lấy userId
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`${base_url}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Lỗi khi lấy thông tin người dùng");
        const user = await res.json();
        setUserId(user._id);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [token, base_url]);

  // Lấy danh sách nhóm
  useEffect(() => {
    if (!userId) return; // Không gọi API nếu userId chưa có

    const fetchConvGroupById = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`${base_url}/chat/conversations/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Lỗi khi lấy các group");
        const groupsByUser = await res.json();
        const groupsList = groupsByUser.filter((group) => group.type === "group");
        setGroups(groupsList);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConvGroupById();
  }, [userId, token, base_url]); // Chỉ phụ thuộc vào userId, token, base_url

  // Tối ưu lọc và sắp xếp với useMemo
  const filteredFriends = useMemo(() => {
    return groups
      .filter((group) =>
        group.groupName.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => a.groupName.localeCompare(b.groupName));
  }, [groups, search]);

  return (
    <div className="w-full rounded-lg bg-white shadow-md">
      <div className="sticky top-0 z-10 w-full bg-white shadow-md">
        <h2 className="flex items-center p-4 text-lg font-semibold">
          <span className="mr-3">
            <Users />
          </span>
          <span className="mr-2">Danh sách nhóm và cộng đồng</span>
        </h2>
      </div>
      <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-100 p-4">
        <h3 className="mb-6 mt-2 font-semibold">
          Nhóm
          <span className="ml-1 text-gray-500">({groups.length})</span>
        </h3>
        <div className="mb-4 flex items-center space-x-2 rounded-lg bg-white p-3 shadow">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm nhóm"
              className="w-full rounded-lg border py-2 pl-10 pr-3 outline-none focus:ring focus:ring-blue-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center rounded-lg bg-gray-100 px-3 py-2 transition hover:bg-gray-200">
            <SortAsc className="mr-1" size={18} /> Tên (A-Z)
          </button>
          <button className="flex items-center rounded-lg bg-gray-100 px-3 py-2 transition hover:bg-gray-200">
            <Filter className="mr-1" size={18} /> Tất cả
          </button>
        </div>

        {/* Hiển thị trạng thái loading hoặc lỗi */}
        {isLoading && <p className="text-center text-gray-500">Đang tải...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Hiển thị danh sách nhóm */}
        {!isLoading && !error && (
          <ul className="mt-4 space-y-2 rounded-lg bg-white p-4 shadow">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((group, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={group.groupAvatar || "default-avatar.png"}
                      className="h-10 w-10 rounded-full object-cover"
                      alt={`${group.groupName} avatar`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{group.groupName}</p>
                      <p className="text-sm text-gray-500">
                        {group.participants?.length || 0} thành viên
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical size={18} />
                  </button>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">Không tìm thấy nhóm nào.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}