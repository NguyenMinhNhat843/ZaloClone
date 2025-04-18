import AppButton from "@/components/auth/Button";
import { useInfo } from "@/context/InfoContext";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Avatar = () => {
    const { avatar, setAvatar } = useInfo();

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 70, gap: 10 }}>
                <Text style={styles.title}>Cập nhật ảnh đại diện</Text>
                <Text style={styles.reminder}>Đặt ảnh đại diện để mọi người dễ nhận ra bạn</Text>
                <Image style={styles.avatar} source={{ uri: avatar ? avatar : "https://i.ibb.co/TDvW7DKg/pepe-the-frog-1272162-640.jpg" }} />
            </View>
            <View style={{ gap: 10, marginBottom: 30 }}>
                <AppButton
                    text={avatar.length > 0 ? "Tiếp tục" : "Cập nhật"}
                    backGroundColor="#1068fe"
                    color="#fefef6"
                    onPress={avatar.length > 0
                        ? () => {
                            router.push("/(auth)/password")
                        }
                        : () => {
                            router.push("/(auth)/chooseAvatarModal")
                        }}
                />
                <AppButton
                    text={avatar.length > 0 ? "Chọn ảnh khác" : "Bỏ qua"}
                    backGroundColor="#ededed"
                    color="#101010"
                    onPress={avatar.length > 0
                        ? () => {
                            router.push("/(auth)/chooseAvatarModal")
                        }
                        : () => {
                            setAvatar("https://i.ibb.co/TDvW7DKg/pepe-the-frog-1272162-640.jpg")
                            router.push("/(auth)/password")
                        }}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 24,
        fontWeight: "500",
        marginLeft: 15,
        marginTop: 10
    },
    reminder: {
        fontSize: 14,
        color: "#858a8e",
        marginLeft: 15,
        marginTop: 5
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20,
    },
})

export default Avatar;