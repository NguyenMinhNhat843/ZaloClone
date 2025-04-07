import { Stack } from "expo-router"
import React from "react"

const PageLayout = () => {
    return (
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
        </Stack>
    )
}

export default PageLayout