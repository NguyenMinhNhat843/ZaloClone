import AppButton from "@/components/auth/Button"
import Option from "@/components/Option"
import AntDesign from "@expo/vector-icons/AntDesign"
import Feather from "@expo/vector-icons/Feather"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import Octicons from '@expo/vector-icons/Octicons';
import { router } from "expo-router"
import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const SettingPage = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: 100 }}></View>
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.group}>
                    <Option icon={<MaterialCommunityIcons name="shield-star-outline" size={24} color="#5881d9" />} name="Tài khoản và bảo mật" title="" option={true} />
                    <Option icon={<AntDesign name="lock1" size={24} color="#5881d9" />} name="Quyền riêng tư" title="" option={true} />
                </View>
                <View style={styles.group}>
                    <Option icon={<Ionicons name="pie-chart-outline" size={24} color="#5881d9" />} name="Dữ liệu trên máy" title="" option={true} />
                    <Option icon={<AntDesign name="sync" size={20} color="#5881d9" />} name="Sao lưu và khôi phục" title="" option={true} />
                </View>
                <View style={styles.group}>
                    <Option icon={<Ionicons name="notifications-outline" size={24} color="#5881d9" />} name="Thông báo" title="" option={true} />
                    <Option icon={<Ionicons name="chatbubble-ellipses-outline" size={24} color="#5881d9" />} name="Tin nhắn" title="" option={true} />
                    <Option icon={<Ionicons name="call-outline" size={24} color="#5881d9" />} name="Cuộc gọi" title="" option={true} />
                    <Option icon={<MaterialCommunityIcons name="clock-time-eight-outline" size={24} color="#5881d9" />} name="Nhật ký" title="" option={true} />
                    <Option icon={<FontAwesome6 name="contact-book" size={22} color="#5881d9" />} name="Danh bạ" title="" option={true} />
                    <Option icon={<Feather name="moon" size={24} color="#5881d9" />} name="Giao diện và ngôn ngữ" title="" option={true} />
                </View>
                <View style={styles.group}>
                    <Option icon={<AntDesign name="infocirlceo" size={22} color="#5881d9" />} name="Thông tin về Zalo" title="" option={true} />
                    <Option icon={<AntDesign name="questioncircleo" size={22} color="#5881d9" />} name="Liên hệ hỗ trợ" title="" option={true} />
                </View>
                <View style={[styles.group, { marginBottom: 0, gap: 15 }]}>
                    <Option icon={<MaterialCommunityIcons name="account-sync-outline" size={24} color="#5881d9" />} name="Chuyển tài khoản" title="" option={true} />
                    <AppButton
                        text="Đăng xuất"
                        color="#0e0e0e"
                        icon={<Octicons name="sign-out" size={24} color="black" />}
                        onPress={() => {
                            router.navigate("/pages/warning")
                        }}
                        backGroundColor="#ededed"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    group: {
        marginBottom: 5,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
})

export default SettingPage