import React, { useEffect, useState } from "react";
import { Search, Filter, SortAsc, User } from "lucide-react";

export default function FriendList() {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]); // State for fetched friends
  const [userId, setUserId] = useState(null); // State for current user's ID
  const base_url = "http://localhost:3000";
  const token = localStorage.getItem("accessToken");

  // Fetch current user's ID
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

  // Fetch accepted friends
  useEffect(() => {
    const fetchAcceptedFriends = async () => {
      if (!userId) return;

      try {
        // Fetch the list of accepted friends
        const res = await fetch(`${base_url}/friendship/friends`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Lỗi khi lấy danh sách bạn bè");

        const acceptedFriends = await res.json();
        console.log("Accepted Friends: ", acceptedFriends);

        // Remove duplicates by creating a unique key for each requester-recipient pair
        const uniqueFriendships = [];
        const seenPairs = new Set();

        for (const friendship of acceptedFriends) {
          const pairKey = [friendship.requester, friendship.recipient].sort().join("-");
          if (!seenPairs.has(pairKey)) {
            seenPairs.add(pairKey);
            uniqueFriendships.push(friendship);
          }
        }

        // Fetch user info for each friend (the user who is not the logged-in user)
        const friendInfos = await Promise.all(
          uniqueFriendships.map(async (friendship) => {
            const friendId =
              friendship.requester === userId
                ? friendship.recipient
                : friendship.requester;

            try {
              const res = await fetch(`${base_url}/users/${friendId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!res.ok) {
                throw new Error(`Lỗi khi lấy thông tin người dùng ${friendId}`);
              }

              const userData = await res.json();
              return {
                id: userData._id,
                name: userData.name,
                avatar: userData.avatar || "/upload/avatar.png", // Fallback avatar
              };
            } catch (err) {
              console.log(err.message);
              return null;
            }
          })
        );

        // Filter out null values (failed fetches) and set friends
        const validFriends = friendInfos.filter((friend) => friend !== null);
        console.log("Friend Infos: ", validFriends);
        setFriends(validFriends);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (userId) {
      fetchAcceptedFriends();
    }
  }, [userId, token]);

  // Filter and sort friends based on search
  const filteredFriends = friends
    .filter((friend) =>
      friend.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Group friends by the first letter of their name
  const groupedFriends = filteredFriends.reduce((acc, friend) => {
    const firstLetter = friend.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(friend);
    return acc;
  }, {});

  return (
    <div className="w-full rounded-lg bg-white shadow-md">
      <div className="sticky top-0 z-10 w-full bg-white shadow-md">
        <h2 className="flex items-center p-4 text-lg font-semibold">
          <span className="mr-3">
            <User />
          </span>
          <span className="mr-2">Danh sách bạn bè</span>
        </h2>
      </div>

      <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-100 p-4">
        <h3 className="mb-6 mt-2 font-semibold">
          Bạn bè
          <span className="ml-1 text-gray-500">({friends.length})</span>
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

        <div className="rounded-lg bg-white p-4 shadow">
          {Object.keys(groupedFriends).length === 0 ? (
            <div className="text-center text-gray-500">
              Không có bạn bè nào để hiển thị.
            </div>
          ) : (
            Object.keys(groupedFriends).map((letter) => (
              <div key={letter}>
                <h3 className="mt-4 text-lg font-semibold text-gray-700">
                  {letter}
                </h3>
                <ul>
                  {groupedFriends[letter].map((friend) => (
                    <li
                      key={friend.id}
                      className="flex items-center justify-between border-b py-3 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="mr-3 h-10 w-10 rounded-full border"
                        />
                        <span className="font-medium text-gray-800">
                          {friend.name}
                        </span>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700">
                        ⋮
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}