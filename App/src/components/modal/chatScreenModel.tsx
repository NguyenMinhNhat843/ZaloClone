import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

interface IProps {
    openModal: boolean
    setOpenModal: (v: boolean) => void
}

const ChatScreenModel = (props: IProps) => {
    const { openModal, setOpenModal } = props

    return (
        <View style={[styles.container, { display: openModal ? "flex" : "none" }]}>
            <Pressable
                onPress={() => {
                    setOpenModal(false);
                    router.push("/pages/profile/findAccount")
                }}
                style={styles.group}>
                <AntDesign name="adduser" size={24} color="black" />
                <Text>Thêm bạn</Text>
            </Pressable>
            <Pressable style={styles.group}>
                <AntDesign name="addusergroup" size={24} color="black" />
                <Text>Tạo nhóm</Text>
            </Pressable>
            <Pressable style={styles.group}>
                <AntDesign name="addusergroup" size={24} color="black" />
                <Text>Tạo cuộc gọi nhóm</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#fff",
        position: "absolute",
        right: 10,
        top: 60,
        zIndex: 100,
    },
    group: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
    }
})

export default ChatScreenModel;