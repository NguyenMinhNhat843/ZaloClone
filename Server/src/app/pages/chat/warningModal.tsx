import { useCurrentApp } from "@/context/app.context"
import { router, useLocalSearchParams } from "expo-router"
import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

const WarningModal = () => {
    const { conversationsId, memberId, memberName, chatName, chatAvatar, receiverId, } = useLocalSearchParams()
    const { socket } = useCurrentApp();
    return (
        <Animated.View
            entering={FadeIn}
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",

            }}
        >
            <Pressable
                onPress={() => router.back()}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View
                entering={FadeIn}
                style={{
                    maxWidth: "80%",
                    height: "auto",
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    gap: 10,
                }}
            >
                {memberId ? (
                    <>
                        <Text style={styles.title}>Chuyển quyền trưởng nhóm cho {memberName}?</Text>
                        <Text style={styles.text}>{memberName} sẽ trở thành trưởng nhóm. Bạn sẽ trở thành một thành viên bình thường.</Text>
                        <View style={styles.buttonGroup}>
                            <Pressable
                                onPress={() => router.back()}
                                style={styles.button}>
                                <Text style={styles.buttonText}>Hủy</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    socket.emit('changeGroupAdmin', {
                                        groupId: conversationsId,
                                        newAdminId: memberId,
                                    });
                                    router.replace({
                                        pathname: '/pages/chat/chooseNewAdmin',
                                        params: {
                                            conversationsId: conversationsId,
                                            chatName: chatName,
                                            chatAvatar: chatAvatar,
                                            receiverId: receiverId,
                                            type: "group",
                                        }
                                    })
                                }}
                                style={styles.button}>
                                <Text style={[styles.buttonText, { color: "#d50601" }]}>Chuyển</Text>
                            </Pressable>
                        </View>
                    </>
                )
                    : (
                        <>
                            <Text style={styles.title}>Chuyển quyền trưởng nhóm</Text>
                            <Text style={styles.text}>Người được chọn sẽ trở thành trưởng nhóm và có mọi quyền quản lý nhóm. Bạn sẽ mất quyền quản lý nhưng vẫn là một thành viên của nhóm. Hành động này không thể phục hồi.</Text>
                            <View style={styles.buttonGroup}>
                                <Pressable
                                    onPress={() => router.back()}
                                    style={styles.button}>
                                    <Text style={styles.buttonText}>Hủy</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => router.push({
                                        pathname: '/pages/chat/chooseNewAdmin',
                                        params: {
                                            conversationsId: conversationsId,
                                            chatName: chatName,
                                            chatAvatar: chatAvatar,
                                            receiverId: receiverId,
                                        }
                                    })}
                                    style={styles.button}>
                                    <Text style={[styles.buttonText, { color: "#d50601" }]}>Chuyển</Text>
                                </Pressable>
                            </View>
                        </>
                    )
                }

            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "500",
        marginTop: 30,
        textAlign: "left",
        color: "#0d0d0d"
    },
    text: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "left",
        color: "#111111",
        marginTop: 10,
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 30,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderColor: "#ededed",
        marginTop: 10,
    },
    button: {

    },
    buttonText: {
        fontSize: 16,
        color: "#272727",
        fontWeight: "500",
    }
})

export default WarningModal