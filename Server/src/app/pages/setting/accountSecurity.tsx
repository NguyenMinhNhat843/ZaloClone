import Option from "@/components/Option"
import { useCurrentApp } from "@/context/app.context"
import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { router } from "expo-router"
import React from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const AccountSecurity = () => {
    const { appState } = useCurrentApp()
    const user = appState?.user
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.account}>
                <Text style={styles.title}>Tài khoản</Text>
                <Pressable onPress={() => router.push("/pages/profile/profilePage")} style={styles.profile}>
                    <Image style={styles.avatar} source={{ uri: user.avatar }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: "#717171" }}>Thông tin cá nhân</Text>
                        <Text style={{ color: "#121212", fontWeight: 500 }}>{user.name}</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" color={'#808080'} size={16} />
                </Pressable>
                <Option
                    icon={<Ionicons name="call-outline" size={24} color="#747474" />}
                    name="Số điện thoại"
                    title={user.phone}
                    option={true} />
                <Option
                    icon={<MaterialCommunityIcons name="email-outline" size={24} color="#747474" />}
                    name="Email"
                    title={user.gmail === " " ? "Chưa liên kết" : user.gmail}
                    option={true}
                    onPress={() => router.push("/pages/profile/verifyEmail")}
                />
            </View>
            <View style={styles.account}>
                <Text style={styles.title}>Đăng nhập</Text>
                <Option
                    icon={<MaterialIcons name="lock-open" size={24} color="#747474" />}
                    name="Mật khẩu"
                    title=""
                    option={true}
                    onPress={() => router.push("/(auth)/changePassword")}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f3f8",
    },
    title: {
        fontSize: 15,
        fontWeight: "600",
        color: "#14439a",
    },
    account: {
        backgroundColor: "#fff",
        padding: 15,
        gap: 15,
    },
    profile: {
        borderWidth: 1,
        borderColor: "#e5e5e5",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        gap: 15,
        borderRadius: 15
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 55,
    }
})

export default AccountSecurity