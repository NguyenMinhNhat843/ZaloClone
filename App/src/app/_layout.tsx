import Header from "@/components/Header";
import AppProvider from "@/context/app.context";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function RootLayout() {
  return (
    <AppProvider>
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
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="+not-found"
          options={{ headerShown: false }}
        />
      </Stack>
    </AppProvider>
  )
}
