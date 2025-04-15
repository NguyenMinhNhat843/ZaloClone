import Fontisto from "@expo/vector-icons/Fontisto";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Audio } from 'expo-av';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import { getAccountByIdAPI, getAllConversationsByUserId, sendAudioMessageAPI } from "@/utils/api";
import { useCurrentApp } from "@/context/app.context";

interface IProps {
    userId: string
    receiverId: string
    userAvatar: string
    conversationsId: string;
}

const ChatRecord = (props: IProps) => {
    const recordingRef = useRef<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedUri, setRecordedUri] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { socket, setConversations, setMessages } = useCurrentApp()
    const { userId, receiverId, userAvatar, conversationsId } = props

    const sendAudio = async () => {
        try {
            console.log("Gửi âm thanh:", recordedUri);
            const res = await sendAudioMessageAPI(recordedUri || "");
            console.log("res", res)
            if (res.attachments) {
                socket.emit('sendMessage', {
                    senderId: userId,
                    receiverId: receiverId,
                    text: "[Tin nhắn thoại]",
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
                    console.log(sendedMessage)
                    // @ts-ignore
                    await setMessages((prevMessages) => [...prevMessages, sendedMessage]);
                    console.log("xxxxxxxxxxxx")
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
        } catch (err) {
            console.error("❌ Lỗi gửi âm thanh:", err);
        }
    };

    const playRecording = async (uri: string) => {
        try {
            setIsPlaying(true);
            const { sound } = await Audio.Sound.createAsync({ uri });
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                // @ts-ignore
                if (!status.isPlaying) {
                    setIsPlaying(false);
                }
            });
        } catch (err) {
            console.error("❌ Lỗi phát âm thanh:", err);
            setIsPlaying(false);
        }
    };

    const startRecording = async () => {
        try {
            // Xin quyền
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                alert('Bạn cần cấp quyền micro để ghi âm');
                return;
            }

            // Cấu hình chế độ audio
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(
                // @ts-ignore
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            await recording.startAsync();

            recordingRef.current = recording;
            setIsRecording(true);
        } catch (err) {
            console.error('❌ Lỗi khi bắt đầu ghi âm:', err);
        }
    };

    const stopRecording = async () => {
        try {
            const recording = recordingRef.current;
            if (!recording) return;

            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordedUri(uri || null);
            setIsRecording(false);
        } catch (err) {
            console.error('❌ Lỗi khi dừng ghi âm:', err);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={{ fontWeight: '500' }}>{isRecording ? "Nhấn để kết thúc" : "Nhấn để ghi âm"}</Text>
            <Pressable style={[styles.recordButton, isRecording && styles.recording]}
                onPress={isRecording ? stopRecording : startRecording}
            >

                {isRecording
                    ? (<Feather name="pause" size={24} color="black" />)
                    : (<Fontisto name="mic" size={22} color="#fff" />)}
            </Pressable>
            {isRecording && (
                <View style={styles.waveContainer}>
                    {new Array(30).fill(0).map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: 3,
                                height: Math.random() * 20 + 10,
                                backgroundColor: '#1068fe',
                                marginHorizontal: 1,
                                borderRadius: 2,
                            }}
                        />
                    ))}
                </View>
            )}
            {recordedUri && !isRecording && (
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    {/* <Text style={{ marginTop: 10 }}>📁 File: {recordedUri}</Text> */}
                    <View style={{ alignItems: 'center', flexDirection: "row", gap: 10 }}>
                        <Pressable
                            onPress={() => playRecording(recordedUri)}
                            style={styles.audioBubble}
                        >
                            <Text style={{ color: '#fff' }}>
                                {isPlaying ? '⏸ Đang phát...' : '▶️ Nghe lại'}
                            </Text>
                        </Pressable>

                        <View style={styles.waveContainer}>
                            {new Array(30).fill(0).map((_, index) => (
                                <View
                                    key={index}
                                    style={{
                                        width: 3,
                                        height: Math.random() * 20 + 10,
                                        backgroundColor: '#ccc',
                                        marginHorizontal: 1,
                                        borderRadius: 2,
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                    <View style={styles.typeRecord}>
                        <Pressable
                            onPress={() => {
                                setIsRecording(false);
                                sendAudio();
                                setTimeout(() => {
                                    socket.off('sendMessageResult')
                                    setRecordedUri(null);
                                }, 1000)
                            }}
                            style={styles.typeButton}>
                            <Text style={styles.typeButtonText}>Gửi bản ghi âm</Text>
                        </Pressable>
                        <Pressable onPress={() => {
                            setRecordedUri(null);
                            setIsRecording(false);
                            recordingRef.current = null;
                        }} style={styles.typeButton}>
                            <Text style={styles.typeButtonText}>Hủy</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        flex: 1,
        paddingVertical: 40,
    },
    recordButton: {
        backgroundColor: '#1068fe',
        padding: 10,
        borderRadius: 50,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    recording: {
        backgroundColor: '#f13c3c',
    },
    audioBubble: {
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
    },
    waveContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignSelf: 'center',
    },
    typeRecord: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: "#f2f2f2",
        padding: 4,
        borderRadius: 50,
        marginTop: 20,
    },
    typeButton: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeButtonText: {
        color: '#080808',
        fontWeight: '500',
        fontSize: 14,
    },
});

export default ChatRecord;