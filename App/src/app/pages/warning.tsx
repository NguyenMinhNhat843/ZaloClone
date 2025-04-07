import { router } from "expo-router"
import React from "react"
import { Pressable, StyleSheet, Text, View, } from "react-native"
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated"
import Foundation from '@expo/vector-icons/Foundation';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCurrentApp } from "@/context/app.context";

const Warning = () => {

    const handleSignOut = async () => {
        await AsyncStorage.removeItem("access_token")
        router.replace("/(auth)/welcome")
    }

    return (
        <Animated.View
            entering={FadeIn}
            style={{
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "rgba(0, 0, 0, 0.5)",

            }}
        >
            <Pressable
                onPress={() => router.back()}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View
                entering={SlideInDown}
                style={styles.container}
            >
                <Foundation style={{ textAlign: "center" }} name="info" size={24} color="#0045ad" />
                <Text style={{ color: "#101010", fontSize: 22, fontWeight: 500 }}>Đăng xuất khỏi tài khoản này?</Text>
                <Text style={{ color: "#111111", fontSize: 14, fontWeight: 400 }}>Bạn có muốn đăng xuất khỏi tài khoản này không?</Text>
                <Pressable style={styles.button} onPress={() => handleSignOut()}>
                    <Text style={{ color: "#111111", fontSize: 18, fontWeight: 600 }}>Đăng xuất</Text>
                </Pressable>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "auto",
        backgroundColor: "#fff",
        borderRadius: 20,
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    button: {
        marginTop: 10,
        backgroundColor: "#ededed",
        padding: 10,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    }
})

export default Warning