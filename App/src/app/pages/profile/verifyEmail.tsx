import AppButton from "@/components/auth/Button"
import Input from "@/components/auth/input"
import { useInfo } from "@/context/InfoContext"
import { sendOTP } from "@/utils/api"
import { APP_COLOR } from "@/utils/constant"
import { router } from "expo-router"
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const VerifyEmail = () => {
    const { email, setEmail } = useInfo()

    const handleSendEmail = async () => {
        try {
            const res = await sendOTP(email)
            console.log(res)
            if (res.status) {
                console.log("Send email verification code success")
                router.push("/pages/profile/verify")
            }
            else {
                console.log("Send email verification code failed")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.email}>
                <Text>Địa chỉ email</Text>
                <Input
                    placeholder="Nhập địa chỉ email của bạn"
                    keyboardType="email-address"
                    value={email}
                    setValue={setEmail}
                    fullBorder={true}
                />
            </View>
            <AppButton
                text="Liên kết"
                color="#f9fef8"
                backGroundColor={APP_COLOR.PRIMARY}
                onPress={() => handleSendEmail()}
                style={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
    },
    email: {
        padding: 15,
    },
})

export default VerifyEmail