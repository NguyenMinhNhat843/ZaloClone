import ChatContainer from "@/components/chat/chatContainer"
import ChatMessage from "@/components/chat/chatMessage"
import HeaderCustom from "@/components/chat/header"
import { useCurrentApp } from "@/context/app.context"
import { getAccountByIdAPI, getAllConversationsByUserId, getAllMessagesByConversationId, sendTextMessageAPI } from "@/utils/api"
import { APP_COLOR } from "@/utils/constant"
import AntDesign from "@expo/vector-icons/AntDesign"
import Feather from "@expo/vector-icons/Feather"
import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { FlatList, Image, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const chatRoom = () => {
    let { conversationsId, receiverId } = useLocalSearchParams();
    const { conversations, setConversations, socket, messages, setMessages } = useCurrentApp();
    const user = useCurrentApp().appState?.user;
    const [index, setIndex] = useState(0);
    const [inputText, setInputText] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [receiver, setReceiver] = useState<any>("");
    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            // @ts-ignore
            if (flatListRef.current && messages.length > 0) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 1000); // Đợi render hoàn tất
    };

    // Cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    interface Message {
        _id: string;
        conversationId: string;
        senderId: string;
        receiverId: string
        text: string;
        createdAt: string;
        updatedAt: string;
    }

    useEffect(() => {
        const handler = (newMessage: Message) => {
            const avatar = conversations?.filter((item) => item._id === newMessage.conversationId)[0].groupAvatar
            const sendedMessage = {
                ...newMessage,
                sender: {
                    _id: newMessage.senderId,
                    avatar: avatar,
                }
            }
            console.log("sendedMessage", sendedMessage)
            //@ts-ignore
            setMessages((prevMessages) => [...prevMessages, sendedMessage]);
        }

        socket?.on("receiveMessage", handler);

        return () => {
            socket?.off("receiveMessage", handler); // cleanup khi rời màn hình
        }
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
            //@ts-ignore
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
        });

        setInputText(""); // Xóa nội dung ô nhập sau khi gửi
    };

    useEffect(() => {
        const fetchReceiver = async () => {
            try {
                const res = await getAccountByIdAPI(receiverId as string)
                setReceiver(res)
            } catch (error) {
                console.error(error)
            }
        }
        fetchReceiver();
        const fetchAllMessages = async () => {
            try {
                const res = await getAllMessagesByConversationId(conversationsId as string);
                if (res.length > 0) {
                    //@ts-ignore
                    setMessages(res)
                } else {
                    console.log("No messages found for this conversation.")
                }
            } catch (error) {
                console.error(error)
            }
        }
        console.log("receiverId", receiverId, typeof receiverId)
        fetchAllMessages();
        scrollToBottom();
        return () => {
            //@ts-ignore
            setMessages([])
        }
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

    const items = [
        {
            icon: <AntDesign name="videocamera" size={24} color="#fffdfd" />,
            onPress: () => { console.log("Video") }
        },
        {
            icon: <AntDesign name="search1" size={24} color="#fffdfd" />,
            onPress: () => { console.log("search1") }
        },
        {
            icon: <Feather name="list" size={24} color="#fffdfd" />,
            onPress: () => {
                router.push("/pages/chat/chatSetting")
            }
        }
    ]

    return (
        <SafeAreaView style={styles.container}>
            <HeaderCustom
                listOption={items}
                name={receiver.name}
            />
            <Text>{JSON.stringify(messages?.length)}</Text>
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