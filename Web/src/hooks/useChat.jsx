import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../firebase/firebaseService";

export const useChat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages();
      setMessages(data);
    };
    fetchMessages();
  }, []);

  return { messages, sendMessage };
};
