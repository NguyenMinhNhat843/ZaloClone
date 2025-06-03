import AppButton from "@/components/auth/Button";
import Input from "@/components/auth/input";
import { changePassword } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [isNewLikeCofirmPass, setIsNewLikeCofirmPass] = useState<boolean>(false);

    useEffect(() => {
        if (newPassword.length > 0 && confirmPassword.length > 0) {
            setIsNewLikeCofirmPass(newPassword === confirmPassword);
        } else {
            setIsNewLikeCofirmPass(false);
        }
    }, [newPassword, confirmPassword])

    const handleChangePassword = async () => {
        console.log("newPassword", newPassword)

        router.push("/(auth)/loading")
        try {
            const res = await changePassword(currentPassword, newPassword)
            console.log(res)
            if (res.error) {
                console.log("Change password failed")
                router.back()
            } else {
                console.log("Change password success")
                router.back()
                router.replace("/pages/setting/accountSecurity")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.reminder}>
                <Text style={styles.remindText}>Nên thay đổi mật khẩu gồm chữ và số, không chứa năm sinh, username và tên Zalo của bạn</Text>
            </View>
            <View style={styles.password}>
                <View style={styles.passwordField}>
                    <Text style={styles.passwordTitle}>Mật khẩu hiện tại:</Text>
                    <Input
                        placeholder="Nhập mật khẩu hiện tại"
                        secureTextEntry={true}
                        value={currentPassword}
                        setValue={setCurrentPassword}
                    />
                </View>
                <View style={styles.passwordField}>
                    <Text style={styles.passwordTitle}>Mật khẩu mới</Text>
                    <Input
                        placeholder="Nhập mật khẩu mới"
                        secureTextEntry={true}
                        value={newPassword}
                        setValue={setNewPassword}
                    />
                    <Input
                        placeholder="Nhập lại mật khẩu mới"
                        secureTextEntry={true}
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                    />
                </View>
            </View>
            <AppButton
                text="Cập nhật"
                color={isNewLikeCofirmPass ? "#f9fef8" : "#a2a7ab"}
                backGroundColor={isNewLikeCofirmPass ? APP_COLOR.PRIMARY : "#d1d6da"}
                onPress={() => handleChangePassword()}
                disabled={!isNewLikeCofirmPass}
                style={{ paddingTop: 20 }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        gap: 20
    },
    reminder: {
        backgroundColor: "#f4f3f8",
        padding: 15,
    },
    remindText: {
        fontSize: 16,
        color: "#1f1f1f",
        textAlign: "center",
    },
    password: {
        padding: 15,
        gap: 20,
    },
    passwordField: {
        gap: 10,
    },
    passwordTitle: {
        fontSize: 14,
        color: "#222222",
        fontWeight: "600",
    },
})

export default ChangePassword;