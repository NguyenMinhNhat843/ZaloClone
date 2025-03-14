import Header from "@/components/Header";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)/welcome"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)/login"
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
          ),
        }}
      />
      <Stack.Screen
        name="(auth)/signup"
        options={{
          headerShown: true,
          title: ""
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="+not-found"
        options={{ headerShown: false }}
      />

    </Stack>
  )
}
