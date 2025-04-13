import ChatItem from "@/components/chat/ChatItem";
import Header from "@/components/Header";
import ChatScreenModel from "@/components/modal/chatScreenModel";
import { useCurrentApp } from "@/context/app.context";
import { getAccountByIdAPI, getAllConversationsByUserId } from "@/utils/api";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";

const ChatScreen = () => {
  const user = useCurrentApp().appState?.user
  const { socket, conversations, setConversations } = useCurrentApp()
  const [openModal, setOpenModal] = useState(false)
  const timeStamToDate = function getTimeAgo(isoDateString: string): string {
    const now = new Date();
    const past = new Date(isoDateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return `${diffInDays} ngày trước`;
  }

  interface Message {
    _id: string;
    conversationId: string;
    senderId: string;
    receiverId: string
    text: string;
    createdAt: string;
    updatedAt: string;
  }

  useFocusEffect(
    useCallback(() => {
      console.log('ChatScreen focus')
      const handler = async (newMessage: Message) => {
        console.log('newMessage', newMessage)
        if (newMessage.senderId !== user._id) {
          //@ts-ignore
          if (conversations.some(item => item._id === newMessage.conversationId)) {
            //@ts-ignore
            setConversations((prevConversations: IConversations[]) => {
              return prevConversations.map((conversation: IConversations) => {
                if (conversation._id === newMessage.conversationId) {
                  return {
                    ...conversation,
                    lastMessage: {
                      _id: newMessage._id,
                      sender: newMessage.senderId,
                      text: newMessage.text,
                      timestamp: newMessage.createdAt,
                    },
                  };
                }
                return conversation;
              });
            });
          }
          else {
            const res = await getAllConversationsByUserId(user._id);
            if (res.length > 0 && res[0]._id) {
              const updatedConversations = await Promise.all(
                res.map(async (conversation: any) => {
                  const participants = await Promise.all(
                    conversation.participants.map(async (participantId: string) => {
                      const user = await getAccountByIdAPI(participantId);
                      return {
                        _id: user._id,
                        name: user.name,
                        avatar: user.avatar
                      };
                    })
                  );

                  return {
                    ...conversation,
                    participants
                  };
                })
              );

              if (setConversations) {
                setConversations(updatedConversations); // Cập nhật state
              }
            }
            else {
              console.error("No conversations found for this user.")
            }
          }
        }
      };

      socket.on("receiveMessage", handler);

      return () => {
        socket.off("receiveMessage", handler); // Cleanup mỗi khi rời màn
      };
    }, [socket, user._id])
  );

  const listOption = [
    {
      icon: <Ionicons name="qr-code" size={24} color="#fff" />,
      onPress: () => { console.log('QR') }
    },
    {
      icon: <AntDesign name="plus" size={24} color="#fff" />,
      onPress: () => { setOpenModal(!openModal) }
    },
  ]
  return (
    <Pressable onPress={() => { setOpenModal(false) }} style={styles.container}>
      <ChatScreenModel
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <Header listOption={listOption} />
      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <ChatItem
            conversationsId={item._id}
            lastMessage={item.lastMessage.text}
            lastMessageOwner={
              item.lastMessage.sender === user._id ? "Bạn"
                : item.participants.filter((p: any) => p._id === item.lastMessage.sender)[0].name
            }
            lastMessageTime={timeStamToDate(item.lastMessage.timestamp)}
            chatName={item.nameConversation}
            chatAvatar={
              item.participants.filter((p: any) => p._id !== user._id)[0].avatar
            }
            participants={item.participants}
          />
        )}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f3f8",
  },
})

export default ChatScreen;
