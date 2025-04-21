import { useState, useEffect } from "react";

const useGetUser = (userId, token) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !token) return;

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Lỗi khi lấy thông tin người dùng");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  return { user, loading, error };
};

export default useGetUser;