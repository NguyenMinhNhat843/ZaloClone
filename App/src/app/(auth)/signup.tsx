import React, { useEffect, useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CheckBox from 'react-native-check-box'
import AntDesign from "@expo/vector-icons/AntDesign";
import AppButton from "@/components/auth/Button";
import { APP_COLOR } from "@/utils/constant";
import { Link, router } from "expo-router";
import { useInfo } from "@/context/InfoContext";
import { checkPhoneExist } from "@/utils/api";

const SignUpPage = () => {
    const [isCheckedUse, setIsCheckedUse] = useState(false)
    const [isCheckedSocial, setIsCheckedSocial] = React.useState(false)
    const { phone, setPhone } = useInfo()

    const isFilled = phone.length > 9 && phone.length < 11 && isCheckedUse && isCheckedSocial

    const handlePhoneRegister = async (phone: string) => {
        try {
            const res = await checkPhoneExist(phone)
            if (res?.data === false) {
                router.navigate("/(auth)/registerName")
            } else {
                alert("Số điện thoại đã được đăng ký")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ justifyContent: "flex-start", }}>
                <AntDesign style={{ marginLeft: 15, marginTop: 10 }} onPress={router.back} name="arrowleft" size={24} color={"black"} />
                <Text style={styles.title}>Nhập số điện thoại</Text>
                <View style={{ marginHorizontal: 15 }}>
                    <TextInput placeholder="Nhập số điện thoại"
                        autoFocus={true}
                        style={styles.input}
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        value={phone}
                        onChangeText={setPhone}
                    />
                    <View style={styles.areaPhone}>
                        <Text>+84</Text>
                        <AntDesign name="down" size={12} color="#2c68e4" />
                    </View>
                </View>
                <CheckBox
                    style={{ marginLeft: 15, marginTop: 25, height: 50 }}
                    onClick={() =>
                        setIsCheckedUse(!isCheckedUse)
                    }
                    isChecked={isCheckedUse}
                    checkedCheckBoxColor="#009eff"
                    checkBoxColor="#c1c7c7"
                    rightTextView={
                        <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: "500" }}>
                            Tôi đồng ý với các
                            <Text style={{ color: "#0396f3" }}> điều khoản sử dụng Zalo</Text>
                        </Text>
                    }
                />
                <CheckBox
                    style={{ marginLeft: 15, height: 50 }}
                    onClick={() =>
                        setIsCheckedSocial(!isCheckedSocial)
                    }
                    isChecked={isCheckedSocial}
                    checkedCheckBoxColor="#009eff"
                    checkBoxColor="#c1c7c7"
                    rightTextView={
                        <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: "500" }}>
                            Tôi đồng ý với
                            <Text style={{ color: "#0396f3" }}> điều khoản Mạng xã hội của Zalo</Text>
                        </Text>
                    }
                />

                <AppButton
                    text="Tiếp tục"
                    backGroundColor={isFilled ? APP_COLOR.PRIMARY : "#d1d6da"}
                    color={isFilled ? "#fdfcf3" : "#a2a7ab"}
                    disabled={!isFilled}
                    onPress={() => handlePhoneRegister(phone)}
                />
            </View>
            <Link href={"/(auth)/login"} style={{ marginBottom: 30 }}>
                <Text style={{ textAlign: "center", color: "#2c2c2c", fontWeight: 500 }}>Bạn đã có tài khoản?
                    <Text style={{ color: "#026bfa" }}> Đăng nhập ngay</Text>
                </Text>
            </Link>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between"
    },
    title: {
        fontSize: 24,
        fontWeight: "500",
        margin: 30,
        textAlign: "center"
    },
    input: {
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "#1765fc",
        paddingLeft: 70,
        height: 50,
    },
    areaPhone: {
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2f7fb",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        borderWidth: 1,
        borderRightColor: "#c5e0fd",
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
        borderTopColor: "#1765fc",
        borderBottomColor: "#1765fc",
        borderLeftColor: "#1765fc",
        padding: 10
    }
})

export default SignUpPage