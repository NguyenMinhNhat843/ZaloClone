import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return <Stack
    screenOptions={{
    }}
  >
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="+not-found" options={{ headerShown: false }} />

  </Stack>;
}
