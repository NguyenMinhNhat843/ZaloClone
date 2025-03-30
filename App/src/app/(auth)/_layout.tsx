import { InfoProvider } from "@/context/InfoContext";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
    return (
        <InfoProvider>

            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="welcome"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="login"
                    options={{
                        headerTintColor: "#fff",
                        headerShown: true,
                        title: "Đăng nhập",
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
                    name="signup"
                    options={{
                        headerShown: false,
                        title: ""
                    }}
                />
                <Stack.Screen
                    name="gender"
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