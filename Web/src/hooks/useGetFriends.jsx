import { useState, useEffect } from "react";

const useGetFriends = (userId, token) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId || !token) return;

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/friendship/friends`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Lỗi khi lấy danh sách bạn bè");
        }

        const data = await res.json();
        setFriends(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId, token]);

  return { friends, loading, error };
};

export default useGetFriends;