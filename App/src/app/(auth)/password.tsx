import AppButton from "@/components/auth/Button";
import Input from "@/components/auth/input";
import { useCurrentApp } from "@/context/app.context";
import { useInfo } from "@/context/InfoContext";
import { getAccountAPI, loginAPI, registerAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react"
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const RegisterPasswordPage = () => {
    const { setAppState } = useCurrentApp()

    const { email, name, phone, gender, dateOfBirth, avatar, password, setPassword } = useInfo()
    const isFilled = password.length >= 8 && password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[^a-zA-Z0-9]/)

    const handleLogin = async (phone: string, password: string) => {
        try {
            const res = await loginAPI(phone, password)
            if (res.accessToken) {
                await AsyncStorage.setItem("access_token", res.accessToken);
                const user = await getAccountAPI();
                if (user._id) {
                    setAppState({
                        user: user,
                    })
                    router.replace("/(tabs)/ChatScreen")
                } else {
                    router.back()
                    console.log("Login failed")
                }
            } else {
                router.back()
                console.log(res.message)
            }
        } catch (error) {
            router.back()
            console.log(error)
        }
    }

    const handleRegister = async () => {
        router.push("/(auth)/loading")
        try {
            const res = await registerAPI(
                phone, password, avatar, name, email, dateOfBirth.toLocaleDateString("en-CA"), gender
            )
            console.log(res);
            if (res._id) {
                handleLogin(res.phone, password)
                console.log("Register success", res)
            } else {
                router.back()
                console.log("Register failed")
            }
        } catch (error) {
            router.back()
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ justifyContent: "flex-start", }}>
                <Text style={styles.title}>Nhập mật khẩu</Text>
                <Text style={styles.reminder}>
                    Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt
                </Text>
                <Input
                    placeholder="Nhập mật khẩu"
                    keyboardType="default"
                    value={password}
                    setValue={setPassword}
                    autoFocus={true}
                    fullBorder={true}
                    secureTextEntry={true}
                />

                <View style={{ marginLeft: 20, marginTop: 10 }}>
                    <Text style={styles.nameRule}>•  Dài từ 8 ký tự</Text>
                    <Text style={styles.nameRule}>•  Gồm chữ hoa, số và ký tự đặc biệt</Text>
                </View>
            </View>

            <AppButton
                text="Tiếp tục"
                backGroundColor={isFilled ? APP_COLOR.PRIMARY : "#d1d6da"}
                color={isFilled ? "#fdfcf3" : "#a2a7ab"}
                disabled={!isFilled}
                onPress={() => handleRegister()}
                style={{ marginBottom: 30 }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 24,
        fontWeight: "500",
        marginTop: 80,
        textAlign: "center"
    },
    reminder: {
        textAlign: "center",
        paddingVertical: 15,
        paddingHorizontal: 25,
        color: "#858a8e",
        fontWeight: 400
    },
    nameRule: {
        fontSize: 15,
        fontWeight: "400",
        color: "#858a8e",
        marginTop: 5
    },
})

export default RegisterPasswordPage;