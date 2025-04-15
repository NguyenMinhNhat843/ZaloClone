import Entypo from "@expo/vector-icons/Entypo"
import Ionicons from "@expo/vector-icons/Ionicons"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { FlatList, Pressable, Text, View } from "react-native"
import * as DocumentPicker from 'expo-document-picker';
import { getAccountByIdAPI, getAllConversationsByUserId, sendDocumentMessageAPI } from "@/utils/api"
import { useCurrentApp } from "@/context/app.context"

interface IItem {
    color: [string, string, ...string[]]
    icon: JSX.Element
    text: string
    onPress?: () => void
}

interface IProps {
    userId: string
    receiverId: string
    userAvatar: string
    conversationsId: string;
}

const ChatMore = (props: IProps) => {
    const { socket, setConversations, setMessages } = useCurrentApp();
    const { userId, receiverId, userAvatar, conversationsId } = props

    const uploadFile = async (uri: string, name: string, type: string) => {
        try {
            const res = await sendDocumentMessageAPI(uri, name, type);
            console.log("res", res)
            if (res.attachments) {
                socket.emit('sendMessage', {
                    senderId: userId,
                    receiverId: receiverId,
                    text: "[Tài liệu]",
                    attachments: res.attachments,
                });
                socket.on('sendMessageResult', async (res: any) => {
                    console.log('📥 Kết quả gửi tin nhắn:\n' + JSON.stringify(res));
                    const sendedMessage = {
                        ...res.message,
                        sender: {
                            _id: userId,
                            avatar: userAvatar,
                        }
                    }
                    // @ts-ignore
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
                        const res = await getAllConversationsByUserId(userId);
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
            } else {
                console.error("Lỗi khi tải file, vui lòng thử lại", res)
            }
        } catch (error) {
            console.error(error);
        } finally {
            console.log("✅ Hoàn tất tải file")
        }
    }
    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // hoặc 'application/pdf', 'image/*', tùy loại file bạn muốn chọn
                copyToCacheDirectory: true,
                multiple: false, // cho phép chọn nhiều nếu cần
            });

            if (result.canceled) {
                console.log("⛔ Hủy chọn file");
                return;
            }

            const file = result.assets[0];
            console.log("✅ File đã chọn:", file);

            if (file.uri && file.name && file.mimeType) {
                await uploadFile(file.uri, file.name, file.mimeType);
                setTimeout(() => {
                    socket.off('sendMessageResult')
                }, 1000)
            } else {
                console.error("❌ Missing file information:", file);
            }
        } catch (error) {
            console.error("❌ Lỗi khi chọn file:", error);
        }
    };

    const item: IItem[] = [
        {
            color: ["#f57d7a", "#f57f7d", "#f06b64"],
            icon: <Entypo name="location-pin" size={30} color="#fef3ed" />,
            text: "Vị trí",
            onPress: () => {
                console.log("Vị trí")
            }
        },
        {
            color: ["#3d4ed0", "#495be1", "#394bcb"],
            icon: <Ionicons name="document-attach-outline" size={30} color="#f6fbff" />,
            text: "Tài liệu",
            onPress: () => {
                pickFile()
            }
        }
    ]
    return (
        <View>
            <FlatList
                data={item}
                renderItem={({ item }) => (
                    <Pressable onPress={item.onPress} style={{ alignItems: "center", justifyContent: "center", }}>
                        <LinearGradient
                            colors={item.color}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            locations={[0, 0.5, 1]}
                            style={{ justifyContent: "center", alignItems: "center", padding: 20, borderRadius: 50 }}
                        >
                            {item.icon}
                        </LinearGradient>
                        <Text style={{}}>{item.text}</Text>
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, gap: 30 }}
                style={{ backgroundColor: "#fff", borderRadius: 10 }}
            />
        </View>
    )
}

export default ChatMore