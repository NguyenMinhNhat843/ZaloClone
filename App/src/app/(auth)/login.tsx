import Input from "@/components/auth/input"
import { useCurrentApp } from "@/context/app.context"
import { getAccountAPI, loginAPI } from "@/utils/api"
import { APP_COLOR } from "@/utils/constant"
import AntDesign from "@expo/vector-icons/AntDesign"
import Entypo from "@expo/vector-icons/Entypo"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const LoginPage = () => {
    const { setAppState } = useCurrentApp();

    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")

    const [isPhoneInvalid, setIsPhoneInvalid] = useState(false)
    const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false)

    const handelLogin = async (phone: string, password: string) => {
        phone.length < 10 || phone.length > 11 || !/^\d+$/.test(phone) ? setIsPhoneInvalid(true) : setIsPhoneInvalid(false)
        try {
            router.push("/(auth)/loading")
            const res = await loginAPI(phone, password)
            router.back()
            if (res.accessToken) {
                await AsyncStorage.setItem("access_token", res.accessToken);
                const user = await getAccountAPI();
                if (user._id) {
                    setAppState({
                        user: user,
                    })
                    router.replace("/(tabs)")
                } else {
                    router.back()
                    setIsPasswordIncorrect(true)
                }
            } else {
                console.log(res.message)
            }
        } catch (error) {
            router.back()
            setIsPasswordIncorrect(true)
        }
    }

    const isFilled = phone.length > 0 && password.length > 0

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
                <View>
                    <View style={styles.reminder}>
                        <Text style={styles.reminderText}>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
                    </View>
                    <Input
                        placeholder="Số điện thoại"
                        keyboardType="phone-pad"
                        value={phone}
                        setValue={setPhone}
                        autoFocus={true}
                    />
                    <Input
                        placeholder="Mật khẩu"
                        keyboardType="default"
                        secureTextEntry={true}
                        value={password}
                        setValue={setPassword}
                    />
                    {
                        isPhoneInvalid && <Text style={styles.errorText}>Số điện thoại không hợp lệ.{"\n"}Vui lòng kiểm tra và thử lại.</Text>
                    }
                    {
                        isPasswordIncorrect && <Text style={styles.errorText}>Mật khẩu không đúng.{"\n"}Vui lòng kiểm tra và thử lại.</Text>
                    }

                    <Text style={styles.resetPassword}>Lấy lại mật khẩu</Text>
                </View>
                <View style={{ alignItems: "flex-end", margin: 10 }}>
                    <TouchableOpacity
                        onPress={() => handelLogin(phone, password)}
                        disabled={!isFilled}
                        style={[styles.button, { backgroundColor: isFilled ? '#009eff' : '#c1d4e2' }]}>
                        <AntDesign name="arrowright" size={24} color={isFilled ? '#fbfcfb' : '#e2eaf5'} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.question}>
                <Text style={{ fontWeight: 400 }}>Câu hỏi thường gặp</Text>
                <Entypo name="chevron-right" size={18} color="black" />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    reminder: {
        backgroundColor: "#f4f3f8",
        paddingVertical: 10,
        paddingLeft: 15
    },
    reminderText: {
        color: APP_COLOR.BLACK,
        fontSize: 14,
        fontWeight: "400",
    },
    errorText: {
        marginTop: 15,
        marginLeft: 20,
        fontSize: 12,
        fontWeight: "500",
        color: "#d36568"
    },
    resetPassword: {
        marginTop: 20,
        marginLeft: 15,
        fontSize: 15,
        fontWeight: "500",
        color: APP_COLOR.PRIMARY
    },
    button: {
        height: 50,
        width: 50,
        marginHorizontal: 15,
        marginTop: 20,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    question: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        bottom: 20,
        left: 15
    }
})

export default LoginPage