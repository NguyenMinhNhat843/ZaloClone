import { formatFileSizeWithType, formatTimeFromDate, getCleanFileNameFromURI, getMimeType, truncateMiddle } from "@/utils/formatDataFile"
import Feather from "@expo/vector-icons/Feather"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import React, { useRef } from "react"
import { View, Pressable, Keyboard, Image, Text, StyleSheet, findNodeHandle, UIManager } from "react-native"
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Mime from 'mime';
import { router } from "expo-router"
import VideoAndAudio from "./audioRender"
import VideoPlayer from "./videoRender"
import AudioRender from "./audioRender"

interface IProps {
    message: IMessage,
    userId: string,
    onPress: () => void
}

const ChatMessage = (props: IProps) => {
    const ref = useRef<View>(null);
    const { message, onPress, userId } = props

    const handleLongPress = () => {
        if (ref.current) {
            const nodeHandle = findNodeHandle(ref.current);
            if (nodeHandle) {
                UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
                    console.log("🧭 Vị trí component:");
                    console.log("X:", x, "Y:", y);
                    router.push({
                        pathname: "/pages/chat/chatOptionModal",
                        params: {
                            x: pageX,
                            y: pageY,
                            width: width,
                            height: height,
                            messageId: message._id
                        }
                    })
                });
            }
        }
    };

    const getFileName = (uri: string): string => {
        const decoded = decodeURIComponent(uri);
        const fileName = decoded.split('/').pop() || 'Unknown file';
        const extMatch = fileName.match(/\.(\w+)(\?.*)?$/);
        return extMatch ? extMatch[1] : '';
    };

    // const downloadAndOpenAndroid = async (fileUrl: string, fileName: string) => {
    //     try {
    //         const fileUri = FileSystem.documentDirectory + fileName;

    //         // Tải file
    //         const { uri } = await FileSystem.downloadAsync(fileUrl, fileUri);
    //         console.log("✅ Tải xong:", uri);

    //         // 👉 Mở file bằng ứng dụng mặc định trên Android
    //         IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
    //             data: uri,
    //             flags: 1,
    //             type: getMimeType(fileUri) || 'application/octet-stream', // Thay đổi mime type nếu cần
    //         });
    //     } catch (err) {
    //         console.error("❌ Lỗi khi mở file:", err);
    //         alert("Không thể mở file!");
    //     }
    // };

    const downloadAndOpenFile = async (fileUrl: string, fileName: string) => {
        try {
            const downloadResumable = FileSystem.createDownloadResumable(
                fileUrl,
                FileSystem.documentDirectory + fileName
            );

            // @ts-ignore
            const { uri } = await downloadResumable.downloadAsync();
            console.log("✅ Tải thành công:", uri);

            if (!(await Sharing.isAvailableAsync())) {
                alert("Thiết bị không hỗ trợ mở file trực tiếp.");
                return;
            }

            // 👉 Mở file ngay sau khi tải
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error("❌ Tải hoặc mở file lỗi:", error);
            alert("Không thể mở file!");
        }
    };

    const getFileIcon = (extension: string) => {
        switch (extension.toLowerCase()) {
            case 'pdf':
                return <MaterialCommunityIcons name="file-pdf-box" size={70} color="#E74C3C" />;
            case 'doc':
            case 'docx':
                return <MaterialCommunityIcons name="file-word-box" size={65} color="#3498DB" />;
            case 'xlsx':
            case 'xls':
                return <MaterialCommunityIcons name="file-excel-box" size={70} color="#2ECC71" />;
            case 'ppt':
            case 'pptx':
                return <MaterialCommunityIcons name="file-powerpoint-box" size={70} color="#E67E22" />;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return <FontAwesome5 name="file-image" size={70} color="#8E44AD" />;
            case 'mp4':
            case 'mov':
            case 'avi':
                return <FontAwesome5 name="file-video" size={70} color="#F39C12" />;
            case 'txt':
                return <Feather name="file-text" size={70} color="#7F8C8D" />;
            case 'zip':
            case 'rar':
                return <Feather name="archive" size={70} color="#34495E" />;
            default:
                return <Feather name="file" size={70} color="#95A5A6" />;
        }
    };

    return (message.sender._id === userId
        ?
        message.deletedFor.includes(userId)
            ?
            <Pressable ref={ref as any} onLongPress={handleLongPress} onPress={() => {
                onPress();
            }} style={{ alignItems: "flex-end", marginRight: 10 }}>
                <View style={[styles.message, {
                    backgroundColor: "#d4f1ff",
                    maxWidth: "80%",
                    gap: 5
                }]}>
                    <Text style={{ color: "#929da6" }}>Tin nhắn đã thu hồi</Text>
                    <Text style={{ fontSize: 12, color: "#959b9f", }}>{formatTimeFromDate(message.createdAt)}</Text>
                </View>
            </Pressable>
            :
            message.attachments.length > 0
                ? <View style={{ alignItems: "flex-end", marginRight: 10 }}>
                    {message.attachments.map((attachment: any) => {
                        if (attachment.type === "image") {
                            return (
                                <Pressable
                                    key={attachment.url}
                                    style={{ marginVertical: 5, gap: 5 }}
                                    onPress={() => {
                                        router.push({
                                            pathname: "/pages/chat/showImage",
                                            params: {
                                                uri: attachment.url,
                                            }
                                        })
                                    }}
                                    onLongPress={handleLongPress}
                                    ref={ref as any}
                                >
                                    <Image
                                        source={{ uri: attachment.url }}
                                        style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 5 }} />
                                    <Text style={{ fontSize: 12, color: "#959b9f", }}>{formatTimeFromDate(message.createdAt)}</Text>
                                </Pressable>
                            )
                        }
                        if (attachment.type === "video") {
                            console.log(getFileName(attachment.url))
                            if (getFileName(attachment.url).includes("mp4")) {
                                return (
                                    <VideoPlayer key={attachment.url} ref={ref} onLongPress={handleLongPress} uri={attachment.url} time={formatTimeFromDate(message.createdAt)} />
                                )
                            }
                            return (
                                <VideoAndAudio key={attachment.url} ref={ref} onLongPress={handleLongPress} uri={attachment.url} time={formatTimeFromDate(message.createdAt)} />
                            )
                        }
                        else {
                            return (
                                <Pressable
                                    onPress={() => downloadAndOpenFile(attachment.url, getCleanFileNameFromURI(attachment.url))}
                                    onLongPress={handleLongPress}
                                    ref={ref as any}
                                    key={attachment.url}
                                    style={{ marginVertical: 5, gap: 5 }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 10, backgroundColor: "#d4f1ff", borderRadius: 10 }}>
                                        {getFileIcon(getFileName(attachment.url))}
                                        <View>
                                            <Text style={{ color: "#060f14", fontSize: 16, fontWeight: 500 }}>{truncateMiddle(getCleanFileNameFromURI(attachment.url))}</Text>
                                            <Text style={{ color: "#675f6a", fontSize: 13, fontWeight: 400 }}>{formatFileSizeWithType(attachment.url, attachment.size)}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 12, color: "#959b9f", }}>{formatTimeFromDate(message.createdAt)}</Text>
                                </Pressable>
                            )
                        }
                    })}
                </View>
                : <Pressable ref={ref as any} onLongPress={handleLongPress} onPress={() => {
                    onPress();
                }} style={{ alignItems: "flex-end", marginRight: 10 }}>
                    <View style={[styles.message, {
                        backgroundColor: "#d4f1ff",
                        maxWidth: "80%",
                        gap: 5
                    }]}>
                        <Text style={{ color: "#21271d", fontSize: 16 }}>{message.text}</Text>
                        <Text style={{ fontSize: 12, color: "#959b9f", }}>{formatTimeFromDate(message.createdAt)}</Text>
                    </View>
                </Pressable>
        : message.deletedFor.includes(message.sender._id)
            ?
            <Pressable
                onPress={() => {
                    onPress();
                }}
                style={[styles.messageGroup, { alignItems: "flex-start" }]}>
                <Pressable onPress={() => { console.log("helo") }}>
                    <Image style={styles.avatar} source={{ uri: message.sender.avatar }} />
                </Pressable>
                <Pressable ref={ref as any} onLongPress={handleLongPress} style={[{ alignItems: "flex-start", maxWidth: "80%" }]}>
                    <View style={[styles.message, {
                        backgroundColor: "#ffffff", gap: 5
                    }]}>
                        <Text style={{ color: "#929da6" }}>Tin nhắn đã thu hồi</Text>
                        <Text style={{ fontSize: 12, color: "#959b9f", }}>{formatTimeFromDate(message.createdAt)}</Text>
                    </View>
                </Pressable>
            </Pressable>
            :
            message.attachments.length > 0
                ? <View style={[styles.messageGroup, { alignItems: "flex-start" }]}>
                    <Pressable onPress={() => { console.log("helo") }}>
                        <Image style={styles.avatar} source={{ uri: message.sender.avatar }} />
                    </Pressable>
                    <View style={[{ alignItems: "flex-start", maxWidth: "80%" }]}>
                        {message.attachments.map((attachment: any) => {
                            if (attachment.type === "image") {
                                return (
                                    <Pressable
                                        key={attachment.url}
                                        ref={ref as any}
                                        onLongPress={handleLongPress}
                                        style={{ marginVertical: 5, gap: 5 }}
                                        onPress={() => {
                                            router.push({
                                                pathname: "/pages/chat/showImage",
                                                params: {
                                                    uri: attachment.url,
                                                }
                                            })
                                        }}>
                                        <Image
                                            source={{ uri: attachment.url }}
                                            style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 5 }} />
                                        <Text style={{ fontSize: 12, color: "#959b9f", }}>{formatTimeFromDate(message.createdAt)}</Text>
                                    </Pressable>
                                )
                            }
                            if (attachment.type === "video") {
                                if (getFileName(attachment.url).includes("mp4")) {
                                    return (
                                        <VideoPlayer key={attachment.url} ref={ref} onLongPress={handleLongPress} uri={attachment.url} time={formatTimeFromDate(message.createdAt)} />
                                    )
                                }
                                return (
                                    <AudioRender key={attachment.url} ref={ref} onLongPress={handleLongPress} uri={attachment.url} time={formatTimeFromDate(message.createdAt)} />
                                )
                            }
                            else {
                                return (
                                    <Pressable
                                        ref={ref as any}
                                        onLongPress={handleLongPress}
                                        onPress={() => downloadAndOpenFile(attachment.url, getCleanFileNameFromURI(attachment.url))}
                                        key={attachment.url}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 5, paddingHorizontal: 10, backgroundColor: "#d4f1ff", borderRadius: 10 }}>
                                            {getFileIcon(getFileName(attachment.url))}
                                            <View>
                                                <Text style={{ color: "#060f14", fontSize: 16, fontWeight: 500 }}>{truncateMiddle(getCleanFileNameFromURI(attachment.url))}</Text>
                                                <Text style={{ color: "#675f6a", fontSize: 13, fontWeight: 400 }}>{formatFileSizeWithType(attachment.url, attachment.size)}</Text>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 12, color: "#959b9f", }}>{formatTimeFromDate(message.createdAt)}</Text>
                                    </Pressable>
                                )
                            }
                        })}
                    </View>
                </View>
                : <Pressable
                    onPress={() => {
                        onPress();
                    }}
                    style={[styles.messageGroup, { alignItems: "flex-start" }]}>
                    <Pressable onPress={() => { console.log("helo") }}>
                        <Image style={styles.avatar} source={{ uri: message.sender.avatar }} />
                    </Pressable>
                    <Pressable ref={ref as any} onLongPress={handleLongPress} style={[{ alignItems: "flex-start", maxWidth: "80%" }]}>
                        <View style={[styles.message, {
                            backgroundColor: "#ffffff",
                            gap: 5
                        }]}>
                            <Text style={{ color: "#21271d", fontSize: 16 }}>{message.text}</Text>
                            <Text style={{ fontSize: 12, color: "#959b9f", }}>{formatTimeFromDate(message.createdAt)}</Text>
                        </View>
                    </Pressable>
                </Pressable>

    )
}

const styles = StyleSheet.create({
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
});

export default ChatMessage