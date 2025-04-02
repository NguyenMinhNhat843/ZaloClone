import ChatContainer from "@/components/chat/chatContainer"
import { APP_COLOR } from "@/utils/constant"
import AntDesign from "@expo/vector-icons/AntDesign"
import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import React, { useEffect, useRef, useState } from "react"
import { FlatList, Image, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { io } from "socket.io-client"

const me = {
    "_id": "user123",
    "name": "John Doe",
    "avatar": null,
    "status": "online",
}

const room = {
    "_id": "64f2c0e4d1b3a5c8f7b8e4a1",
    "name": "Chat Room",
    "messages": [
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4a2",
            "senderId": "user123",
            "content": "Hello!",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:00:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4a3",
            "senderId": "user456",
            "content": "Hi! How are you?",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:01:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4a4",
            "senderId": "user123",
            "content": "I'm good, thanks!",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:02:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4a5",
            "senderId": "user456",
            "content": "Great to hear!",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:03:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4a6",
            "senderId": "user123",
            "content": "What are you up to?",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:04:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4a7",
            "senderId": "user456",
            "content": "Just working on a project.",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:05:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4a8",
            "senderId": "user123",
            "content": "Sounds interesting!",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:06:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4a9",
            "senderId": "user456",
            "content": "Yeah, it is!",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:07:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4aa",
            "senderId": "user123",
            "content": "Let me know if you need any help.",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:08:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4ab",
            "senderId": "user456",
            "content": "Will do! Thanks!",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:09:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4ac",
            "senderId": "user123",
            "content": "No problem!",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:10:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4ad",
            "senderId": "user456",
            "content": "Talk to you later!",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:11:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4ae",
            "senderId": "user123",
            "content": "Bye!",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:12:00Z",
            "seenAt": null,
        },
        {
            "_id": "64f2c0e4d1b3a5c8f7b8e4af",
            "senderId": "user456",
            "content": "See you!",
            "messageType": "text",
            "status": "delivered",
            "createdAt": "2023-09-01T12:13:00Z",
            "seenAt": null,
        },
    ]
}

const socket = io("http://localhost:3000");

const chatRoom = () => {
    const [index, setIndex] = useState(0);
    const [messages, setMessages] = useState(room.messages);
    const [inputText, setInputText] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (flatListRef.current && messages.length > 0) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 100); // Đợi render hoàn tất
    };

    // Cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (inputText.trim() === "") return; // Kiểm tra nếu tin nhắn rỗng  
        const newMessage = {
            _id: `${messages.length + 1}`,
            senderId: me._id,
            content: inputText,
            messageType: "text",
            status: "delivered",
            createdAt: new Date().toISOString(),
            seenAt: null,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputText(""); // Xóa nội dung ô nhập
    };

    useEffect(() => {
        const showListener = Keyboard.addListener("keyboardDidShow", (event) => {
            setKeyboardHeight(event.endCoordinates.height);
            scrollToBottom();
        });

        const hideListener = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
        });

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    const openModal = () => {
        Keyboard.dismiss()
        setTimeout(() => {
            setModalVisible(true);
            scrollToBottom();
        }, 70)
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback accessible={false} style={styles.messageList} onPressOut={() => {
                Keyboard.dismiss()
                setModalVisible(false)
            }}>
                <View style={styles.messageList}>
                    <FlatList
                        ref={flatListRef}
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled={true}
                        data={messages}
                        renderItem={({ item }) => {
                            return (
                                item.senderId === me._id
                                    ?
                                    <Pressable onPress={() => {
                                        Keyboard.dismiss()
                                        setIndex(0)
                                        setModalVisible(false)
                                    }} style={{ alignItems: "flex-end", marginRight: 10 }}>
                                        <View style={[styles.message, {
                                            backgroundColor: "#d4f1ff",
                                            maxWidth: "80%"
                                        }]}>
                                            <Text>{item.content}</Text>
                                        </View>
                                    </Pressable>

                                    :
                                    <Pressable
                                        onPress={() => {
                                            Keyboard.dismiss()
                                            setModalVisible(false)
                                            setIndex(0)
                                        }}
                                        style={styles.messageGroup}>
                                        <Pressable onPress={() => { console.log("helo") }}>
                                            <Image style={styles.avatar} source={require('../../assets/images/avatar2.png')} />
                                        </Pressable>
                                        <View style={[{ alignItems: "flex-start", maxWidth: "80%" }]}>
                                            <View style={[styles.message, {
                                                backgroundColor: "#ffffff"
                                            }]}>
                                                <Text>{item.content}</Text>
                                            </View>
                                        </View>
                                    </Pressable>
                            )
                        }}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.footer}>
                <Pressable style={styles.icon}
                    onPress={() => {
                        openModal()
                        setIndex(1)
                    }}>
                    {index === 1
                        ? (<MaterialCommunityIcons name="sticker-emoji" size={30} color="#0097f6" />)
                        : (<MaterialCommunityIcons name="sticker-emoji" size={30} color="#757575" />)}

                </Pressable>
                <TextInput
                    cursorColor={APP_COLOR.PRIMARY}
                    placeholderTextColor={"#757575"}
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Tin nhắn"
                    value={inputText}
                    onChangeText={setInputText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="send"
                    blurOnSubmit={false}
                    onSubmitEditing={sendMessage}
                    onPress={() => {
                        setModalVisible(false)
                        setIndex(0)
                    }}
                    onFocus={() => {
                        setModalVisible(false)
                        setIndex(0)
                    }}
                    onBlur={() => {
                        setModalVisible(false)
                    }}

                />
                <Pressable style={styles.icon}
                    onPress={() => {
                        openModal()
                        setIndex(2)
                    }}
                >
                    {index === 2
                        ? (<Ionicons name="ellipsis-horizontal-sharp" size={30} color="#1494ff" />)
                        : (<Ionicons name="ellipsis-horizontal-outline" size={30} color="#757575" />)
                    }
                </Pressable>
                <Pressable
                    style={styles.icon}
                    onPress={() => {
                        openModal()
                        setIndex(3)
                    }}
                >
                    {index === 3
                        ? (<Ionicons name="mic-sharp" size={26} color="#1494ff" />)
                        : (<Ionicons name="mic-outline" size={26} color="#757575" />)
                    }
                </Pressable>
                <Pressable style={styles.icon}
                    onPress={() => {
                        openModal()
                        setIndex(4)
                    }}
                >
                    {index === 4
                        ? (<Ionicons name="image-sharp" size={26} color="#1494ff" />)
                        : (<Ionicons name="image-outline" size={26} color="#757575" />)
                    }
                </Pressable>
            </View>
            <ChatContainer isModalVisible={isModalVisible} index={index} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageList: {
        flex: 1,
        backgroundColor: "#e4e8f3",
    },
    messageGroup: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 6,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    message: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
    },
    footer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        gap: 5
    },
    input: {
        flex: 1,
        color: "#1c1c1c",
        fontSize: 18,
    },
    icon: {
        padding: 10,
    },
    modalContainer: {
    },
    modalText: {
        fontSize: 18,
        fontWeight: "bold",
    },
})

export default chatRoom