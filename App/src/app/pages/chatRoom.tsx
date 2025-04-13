import ChatContainer from "@/components/chat/chatContainer"
import ChatMessage from "@/components/chat/chatMessage"
import { useCurrentApp } from "@/context/app.context"
import { getAccountByIdAPI, getAllConversationsByUserId, getAllMessagesByConversationId, sendTextMessageAPI } from "@/utils/api"
import { APP_COLOR } from "@/utils/constant"
import AntDesign from "@expo/vector-icons/AntDesign"
import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { useLocalSearchParams } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { FlatList, Image, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const chatRoom = () => {
    const { conversationsId, receiverId } = useLocalSearchParams();
    const { conversations, setConversations, socket } = useCurrentApp();
    const user = useCurrentApp().appState?.user;
    const [index, setIndex] = useState(0);
    const [messages, setMessages] = useState<IMessages[]>([]);
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
        }, 1000); // Đợi render hoàn tất
    };

    // Cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        console.log("[Client] user", user.name, user._id)
        socket.on("receiveMessage", (newMessage: IMessage) => {
            console.log('[Client] 📩 Received message:', newMessage)

            // console.log('[Client] currentUser:', user);

            if (newMessage.senderId !== user._id) {
                const sender = conversations?.filter((item) => item._id === newMessage.conversationId)[0].participants.filter((item: { _id: string }) => item._id === newMessage.senderId)[0];
                const sendedMessage = {
                    ...newMessage,
                    sender: {
                        _id: sender._id,
                        avatar: sender.avatar,
                    }
                }
                console.log("sendedMessage", sendedMessage)
                setMessages((prevMessages) => [...prevMessages, sendedMessage]);

                //@ts-ignore
                setConversations((prevConversations: IConversations[]) => {

                    return prevConversations.map((conversation: IConversations) => {
                        // Kiểm tra nếu tin nhắn thuộc về cuộc trò chuyện này
                        if (conversation._id === newMessage.conversationId) {

                            // Cập nhật lastMessage của conversation
                            return {
                                ...conversation, // Sao chép các thuộc tính cũ
                                lastMessage: {
                                    _id: newMessage._id,
                                    sender: newMessage.senderId,
                                    text: newMessage.text,
                                    timestamp: newMessage.createdAt,
                                },
                            };
                        }
                        return conversation; // Giữ nguyên các cuộc trò chuyện không thay đổi
                    });
                });
            }
        });
        return () => {
            socket.off("receiveMessage"); // Dọn dẹp khi component unmount
        };
    }, [socket]);

    const sendMessage = () => {
        if (inputText.trim() === "") return; // Kiểm tra nếu tin nhắn rỗng 
        // const res = await sendTextMessageAPI(user._id, receiverId as string, inputText);
        socket.emit('sendMessage', {
            senderId: user._id,
            receiverId: receiverId,
            text: inputText,
        });

        socket.on('sendMessageResult', async (res: any) => {
            console.log('📥 Kết quả gửi tin nhắn:\n' + JSON.stringify(res));
            const sendedMessage = {
                ...res.message,
                sender: {
                    _id: user._id,
                    avatar: user.avatar,
                }
            }
            console.log("sendedMessage", messages.length)
            await setMessages((prevMessages) => [...prevMessages, sendedMessage]);

            if (conversationsId === res.message.conversationId) {
                //@ts-ignore
                await setConversations((prevConversations: IConversations[]) => {

                    return prevConversations.map((conversation: IConversations) => {
                        // Kiểm tra nếu tin nhắn thuộc về cuộc trò chuyện này
                        if (conversation._id === res.message.conversationId) {

                            // Cập nhật lastMessage của conversation
                            return {
                                ...conversation, // Sao chép các thuộc tính cũ
                                lastMessage: {
                                    _id: res.message._id,
                                    sender: res.message.senderId,
                                    text: res.message.text,
                                    timestamp: res.message.createdAt,
                                },
                            };
                        }
                        return conversation; // Giữ nguyên các cuộc trò chuyện không thay đổi
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
            console.log("sendedMessage", messages.length)
        });

        setInputText(""); // Xóa nội dung ô nhập sau khi gửi
    };

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                const res = await getAllMessagesByConversationId(conversationsId as string);
                if (res.length > 0) {
                    setMessages(res)
                } else {
                    console.log("No messages found for this conversation.")
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchAllMessages();
        scrollToBottom();
    }, []);

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
            <Text>{JSON.stringify(receiverId)}</Text>
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
                                <ChatMessage
                                    message={item}
                                    userId={user._id}
                                    onPress={() => {
                                        Keyboard.dismiss()
                                        setIndex(0)
                                        setModalVisible(false)
                                    }} />
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
                    onSubmitEditing={() => {
                        sendMessage();
                        setTimeout(() => {
                            socket.off('sendMessageResult')
                        }, 1000)
                    }}
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
            <ChatContainer
                conversationsId={conversationsId as string}
                setMessages={setMessages}
                userAvatar={user.avatar}
                userId={user._id}
                receiverId={receiverId as string}
                isModalVisible={isModalVisible}
                index={index} />
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