import { useCurrentApp } from "@/context/app.context"
import AntDesign from "@expo/vector-icons/AntDesign"
import Entypo from "@expo/vector-icons/Entypo"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons"
import { router, useLocalSearchParams } from "expo-router"
import React, { useState } from "react"
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View, } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

const ChatOptionModal = () => {
    const { x, y, width, height, messageId } = useLocalSearchParams();
    const screenHeight = Dimensions.get("window").height;
    const user = useCurrentApp().appState?.user
    const [containerHeight, setContainerHeight] = useState(0);
    const [measured, setMeasured] = useState(false);
    const { messages, socket } = useCurrentApp();
    const message = (messages ?? []).find((item) => item._id === messageId);

    const computedTop = () => {
        const numericY = Number(y);
        if (!measured) return numericY;

        const availableSpaceBelow = screenHeight - numericY;

        if (containerHeight > availableSpaceBelow) {
            return Math.max(numericY - containerHeight, 20); // tránh âm
        }
        return numericY;
    };
    const items = [
        {
            icon: <FontAwesome name="mail-reply" size={24} color="#8a64d4" />,
            text: "Trả lời",
            onPress: () => {
                console.log("Trả lời")
            }
        },
        {
            icon: <FontAwesome name="share" size={24} color="#5994fd" />,
            text: "Chuyển tiếp",
            onPress: () => {
                console.log("Chuyển tiếp")
            }
        },
        {
            icon: <Entypo name="cloud" size={24} color="#24a3d2" />,
            text: "Lưu Cloud",
            onPress: () => {
                console.log("Xóa")
            }
        },
        {
            icon: <MaterialIcons name="content-copy" size={24} color="#0358df" />,
            text: "Sao chép",
            onPress: () => {
                console.log("Báo cáo")
            }
        },
        {
            icon: <SimpleLineIcons name="pin" size={24} color="#f27f23" />,
            text: "Ghim",
            onPress: () => {
                console.log("Báo cáo")
            }
        },
        {
            icon: <FontAwesome6 name="clock" size={24} color="#a80711" />,
            text: "Nhắc hẹn",
            onPress: () => {
                console.log("Báo cáo")
            }
        },

    ]

    const itemsUser = [
        {
            icon: <SimpleLineIcons name="trash" size={24} color="#cf061a" />,
            text: "Xóa",
            onPress: () => {
                console.log("Xóa tin nhắn", message?.sender)
                socket.emit("deleteMessage", {
                    messageId: messageId,
                    type: 'everyone',
                    // @ts-ignore
                    userId: message?.sender._id,
                    conversationId: message?.conversationId,
                });
                router.back()
            }
        },

        {
            icon: <AntDesign name="reload1" size={24} color="#da5905" />,
            text: "Thu hồi",
            onPress: () => {
                console.log("Thu hồi", message?.sender)
                socket.emit("revokeMessage", {
                    messageId: messageId,
                    // @ts-ignore
                    userId: message?.sender._id,
                    conversationId: message?.conversationId,
                });
                router.back()
            }
        },
    ]

    const itemsChat = [

    ]

    const baseOptions = (data: any) => {
        return (
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={item.onPress}
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: 80,
                            gap: 5,
                        }}
                    >
                        {item.icon}
                        <Text>{item.text}</Text>
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={4}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                columnWrapperStyle={{
                    justifyContent: 'space-evenly',
                }}
                contentContainerStyle={{
                    marginHorizontal: 20,
                    paddingVertical: 10,
                    gap: 20,
                    borderRadius: 20,
                    backgroundColor: "#fff"
                }}
            />
        )
    }

    return (
        <Animated.View
            entering={FadeIn}
            style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
        >
            <Pressable
                onPress={() => router.back()}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View
                onLayout={(e) => {
                    setContainerHeight(e.nativeEvent.layout.height);
                    setMeasured(true);
                }}
                entering={FadeIn}
                style={[styles.container, { top: computedTop() }]}
            >
                {
                    // @ts-ignore
                    message?.sender._id !== user._id
                        ?
                        baseOptions(items)
                        : baseOptions(items.concat(itemsUser))
                }


            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
    },
    button: {
        marginTop: 10,
        backgroundColor: "#ededed",
        padding: 10,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    }
})

export default ChatOptionModal;