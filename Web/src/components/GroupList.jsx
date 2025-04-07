import { Search, Filter, MoreVertical, Users, SortAsc } from "lucide-react";
import { useState } from "react";

const groups = [
  { name: "bèo 41nvb", members: 838 },
  { name: "MCB44 CHIA SẺ TIẾNG ANH A-Z", members: 357 },
  { name: "Thứ 4 - 26_03_2025_META - SKILLS FOR JOB", members: 136 },
  { name: "DHKTMP17B_QLDA", members: 63 },
  { name: "LTPTJAVA-DHKTMP18C-4-1012", members: 82 },
  { name: "Kien Truc Phan Mem - Nhom 7", members: 4 },
  { name: "Bang Thiên Môn Tây Du 170", members: 18 },
  { name: "25-03 Kien Tập Mobiphone", members: 152 },
  { name: "DHKTMP19A_NoSQL", members: 34 },
];

export default function GroupList() {
  const [search, setSearch] = useState("");

  const filteredFriends = groups
    .filter((groups) =>
      groups.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const groupedFriends = filteredFriends.reduce((acc, group) => {
    const firstLetter = group.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(group);
    return acc;
  }, {});

  return (
    <div className="w-full bg-white shadow-md rounded-lg">
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
          Bạn bè
          <span className="ml-1 text-gray-500">({groups.length})</span>
        </h3>
        <div className="mb-4 flex items-center space-x-2 rounded-lg bg-white p-3 shadow">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm bạn"
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
        <ul className="mt-4 space-y-2 rounded-lg bg-white p-4 shadow">
          {filteredFriends.map((group, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-gray-500">{group.members} thành viên</p>
              </div>
              <button>
                <MoreVertical size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
