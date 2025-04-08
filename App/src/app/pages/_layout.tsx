import { InfoProvider } from "@/context/InfoContext"
import { LinearGradient } from "expo-linear-gradient"
import { Stack } from "expo-router"
import React from "react"

const PageLayout = () => {
    return (
        <InfoProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="chatRoom"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PersonalPage"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="settingPage"
                    options={{
                        headerTintColor: "#fff",
                        headerShown: true,
                        title: "Cài đặt",
                        headerBackground: () => (
                            <LinearGradient
                                colors={["#1f7bff", "#0e9afc", "#12bcfa"]}
                                style={{ flex: 1 }}
                                start={[0, 0]}
                                end={[1, 1]}
                                locations={[0, 0.7, 1]}
                            />
                        )
                    }}
                />
                <Stack.Screen
                    name="warning"
                    options={{
                        headerShown: false,
                        animation: "fade",
                        presentation: "transparentModal",
                    }}
                />
                <Stack.Screen
                    name="setting/accountSecurity"
                    options={{
                        headerTintColor: "#fff",
                        headerShown: true,
                        title: "Tài khoản và bảo mật",
                        headerBackground: () => (
                            <LinearGradient
                                colors={["#1f7bff", "#0e9afc", "#12bcfa"]}
                                style={{ flex: 1 }}
                                start={[0, 0]}
                                end={[1, 1]}
                                locations={[0, 0.7, 1]}
                            />
                        )
                    }}
                />
                <Stack.Screen
                    name="profile/profilePage"
                    options={{
                        headerTintColor: "#fff",
                        headerShown: true,
                        title: "Thông tin cá nhân",
                        headerBackground: () => (
                            <LinearGradient
                                colors={["#1f7bff", "#0e9afc", "#12bcfa"]}
                                style={{ flex: 1 }}
                                start={[0, 0]}
                                end={[1, 1]}
                                locations={[0, 0.7, 1]}
                            />
                        )
                    }}
                />
                <Stack.Screen
                    name="profile/editProfilePage"
                    options={{
                        headerTintColor: "#fff",
                        headerShown: true,
                        title: "Chỉnh sửa thông tin",
                        headerBackground: () => (
                            <LinearGradient
                                colors={["#1f7bff", "#0e9afc", "#12bcfa"]}
                                style={{ flex: 1 }}
                                start={[0, 0]}
                                end={[1, 1]}
                                locations={[0, 0.7, 1]}
                            />
                        )
                    }}
                />
                <Stack.Screen
                    name="profile/verifyEmail"
                    options={{
                        headerTintColor: "#fff",
                        headerShown: true,
                        title: "Xác thực email",
                        headerBackground: () => (
                            <LinearGradient
                                colors={["#1f7bff", "#0e9afc", "#12bcfa"]}
                                style={{ flex: 1 }}
                                start={[0, 0]}
                                end={[1, 1]}
                                locations={[0, 0.7, 1]}
                            />
                        )
                    }}
                />
                <Stack.Screen
                    name="profile/editAvatarModal"
                    options={{
                        headerShown: false,
                        animation: "fade",
                        presentation: "transparentModal",
                    }}
                />
                <Stack.Screen
                    name="loading"
                    options={{
                        headerShown: false,
                        animation: "fade",
                        presentation: "transparentModal",
                    }}
                />
            </Stack>
        </InfoProvider>
    )
}

export default PageLayout