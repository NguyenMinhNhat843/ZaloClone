import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const chatCollection = collection(db, "chats");

export const getMessages = async () => {
  const snapshot = await getDocs(chatCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const sendMessage = async (message: string, sender: string) => {
  await addDoc(chatCollection, { message, sender, timestamp: new Date() });
};
