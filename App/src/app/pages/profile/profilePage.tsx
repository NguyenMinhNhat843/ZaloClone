import AppButton from "@/components/auth/Button";
import { useCurrentApp } from "@/context/app.context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfilePage = () => {
    const user = useCurrentApp().appState?.user;

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ backgroundColor: "fff", alignItems: "center" }}>
                <Image style={styles.avatar} source={{ uri: user.avatar }} />
                <View style={styles.field}>
                    <FontAwesome name="user-circle" size={24} color="#6d6d6d" />
                    <Text style={styles.title}>Tên Zalo</Text>
                    <Text>{user.name}</Text>
                </View>
                <View style={styles.field}>
                    <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#6d6d6d" />
                    <Text style={styles.title}>Ngày sinh</Text>
                    <Text>{new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}</Text>
                </View>
                <View style={styles.field}>
                    <MaterialCommunityIcons name="account-outline" size={24} color="#6d6d6d" />
                    <Text style={styles.title}>Giới tính</Text>
                    <Text>{user.gender === "male" ? "Nam" : "Nữ"}</Text>
                </View>
            </View>
            <AppButton
                text="Chỉnh sửa"
                color="#4c4c4c"
                icon={<MaterialCommunityIcons name="pencil-outline" size={24} color="black" />}
                onPress={() => router.push("/pages/profile/editProfilePage")}
                backGroundColor="#ededed"
                style={{ marginTop: 20, }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#fff"
    },
    field: {
        fontSize: 16,
        fontWeight: "600",
        color: "#14439a",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f3f3f3",
        backgroundColor: "#fff",
        padding: 15,
        gap: 15,
    },
    title: {
        color: "#6d6d6d",
        flex: 1,
        fontSize: 16,
    }
})

export default ProfilePage;