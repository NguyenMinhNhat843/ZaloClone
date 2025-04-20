import { useCurrentApp } from "@/context/app.context";
import { APP_COLOR } from "@/utils/constant";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

const memberOptionModal = () => {
    const { conversationsId, memberId, memberName, memberAvatar, myRole } = useLocalSearchParams();
    const { socket } = useCurrentApp();
    const hanleDeleteMember = async (memberId: string) => {
        try {
            socket.emit('removeMembersFromGroup', {
                groupId: conversationsId,
                members: [memberId],
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Animated.View
            entering={FadeIn}
            style={{
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "rgba(0, 0, 0, 0.5)",

            }}
        >
            <Pressable
                onPress={() => router.back()}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View
                entering={SlideInDown}
                style={{
                    width: "100%",
                    height: "auto",
                    backgroundColor: "#fff",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    gap: 10,
                }}
            >
                <AntDesign
                    style={{ position: "absolute", top: 10, right: 10 }}
                    name="close" size={26} color="#888b91"
                    onPress={() => router.back()}
                />
                <Text style={styles.title}>Thông tin thành viên</Text>
                <View style={styles.memberInfo}>
                    <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: memberAvatar as string }} />
                    <Text style={{ flex: 1, color: "#232323", fontSize: 18, fontWeight: 500 }}>{memberName}</Text>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <Ionicons style={styles.memberIcon} name="call-outline" size={24} color="black" />
                        <Ionicons style={styles.memberIcon} name="chatbubble-ellipses-outline" size={22} color="black" />
                    </View>
                </View>
                <Pressable
                    onPress={() => { }}
                    style={styles.item}>
                    <Text style={styles.itemText}>Xem trang cá nhân</Text>
                </Pressable>
                {myRole === "admin" && (
                    <>

                        <Pressable
                            onPress={() => { }}
                            style={styles.item}>
                            <Text style={styles.itemText}>Bổ nhiệm làm phó nhóm</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => { }}
                            style={styles.item}>
                            <Text style={styles.itemText}>Chặn thành viên</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => { hanleDeleteMember(memberId as string) }}
                            style={styles.item}>
                            <Text style={[styles.itemText, { color: "#fb5464" }]}>Xóa khỏi nhóm</Text>
                        </Pressable>
                    </>
                )}
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "500",
        paddingVertical: 10,
        textAlign: "center",
        borderBottomWidth: 1,
        borderColor: "#e1e1e1",
    },
    memberInfo: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 20,
        borderBottomWidth: 1,
        borderColor: "#f1f1f1",
    },
    memberIcon: {
        backgroundColor: "#f5f4f9",
        padding: 7,
        borderRadius: 40
    },
    item: {
        marginHorizontal: 20,
    },
    itemText: {
        fontSize: 16,
        padding: 10
    }
})

export default memberOptionModal;