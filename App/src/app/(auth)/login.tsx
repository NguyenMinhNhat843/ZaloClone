import Input from "@/components/auth/input"
import { APP_COLOR } from "@/utils/constant"
import AntDesign from "@expo/vector-icons/AntDesign"
import Entypo from "@expo/vector-icons/Entypo"
import React, { useEffect, useState } from "react"
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const LoginPage = () => {
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [isFilled, setIsFilled] = useState(false)

    useEffect(() => {
        if (phone.length > 0 && password.length > 0) {
            setIsFilled(true)
        } else {
            setIsFilled(false)
        }
    })
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
                    <Text style={styles.resetPassword}>Lấy lại mật khẩu</Text>
                </View>
                <View style={{ alignItems: "flex-end", margin: 10 }}>
                    <TouchableOpacity
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