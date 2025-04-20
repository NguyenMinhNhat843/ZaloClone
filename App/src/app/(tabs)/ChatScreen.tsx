import ChatItem from "@/components/chat/ChatItem";
import Header from "@/components/Header";
import ChatScreenModel from "@/components/modal/chatScreenModel";
import { useCurrentApp } from "@/context/app.context";
import { getAccountByIdAPI, getAllConversationsByUserId } from "@/utils/api";
import { timeStamToDate } from "@/utils/formatDataFile";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";

const ChatScreen = () => {
    const user = useCurrentApp().appState?.user
    const { conversations } = useCurrentApp()
    const [openModal, setOpenModal] = useState(false)

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
                        lastMessage={item.lastMessage?.text ?? "text"}
                        lastMessageOwner={item.lastMessage?.sender === user._id ? "Bạn: " : ""}
                        lastMessageTime={item.lastMessage ? timeStamToDate(item.lastMessage?.timestamp) : ""}
                        chatName={item?.nameConversation ?? item?.groupName}
                        chatAvatar={item.groupAvatar}
                        participants={item.participants}
                        type={item.type}
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
