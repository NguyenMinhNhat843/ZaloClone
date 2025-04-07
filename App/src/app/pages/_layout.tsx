import { InfoProvider } from "@/context/InfoContext"
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
                    options={{ headerShown: false }}
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
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="profile/profilePage"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="profile/editProfilePage"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="profile/editAvatarModal"
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