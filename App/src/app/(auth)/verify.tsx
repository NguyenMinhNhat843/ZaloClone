import AppButton from "@/components/auth/Button"
import { APP_COLOR } from "@/utils/constant"
import AntDesign from "@expo/vector-icons/AntDesign"
import { router, Link, useLocalSearchParams } from "expo-router"
import React, { useRef, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import OTPTextView from "react-native-otp-textinput"
import { useInfo } from "@/context/InfoContext"

const VerifyPage = () => {
    const otpRef = useRef<OTPTextView>(null);
    const [code, setCode] = useState<string>("");
    const { phone } = useInfo()

    const isFilled = code.length === 6;

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ justifyContent: "flex-start", }}>
                <AntDesign style={{ marginLeft: 15, marginTop: 10, }} onPress={router.back} name="arrowleft" size={24} color={"black"} />
                <Text style={styles.title}>Nhập mã xác thực</Text>
                <Text style={styles.reminder}>
                    Đang gửi mã OTP đến số <Text style={{ color: "#080808", fontWeight: 600 }}>{phone}</Text>.
                    Kiểm tra tin nhắn để nhận mã xác thực gồm 6 chữ số
                </Text>
                <View style={{ marginHorizontal: 60, marginBottom: 35 }}>
                    <OTPTextView
                        ref={otpRef}
                        handleTextChange={setCode}
                        autoFocus
                        inputCount={6}
                        keyboardType="number-pad"
                        inputCellLength={1}
                        tintColor={"#0069cf"}
                        textInputStyle={{
                            height: 45,
                            width: 35,
                            borderWidth: 1,
                            borderColor: "#b2b2b2",
                            borderRadius: 7,
                            borderBottomWidth: 1,
                            //@ts-ignore:next-line
                            color: "#0a0a0a",
                            fontSize: 20,
                            fontWeight: "500"
                        }}
                        fillColor={"#0069cf"}
                    />
                </View>

                <AppButton
                    text="Tiếp tục"
                    backGroundColor={isFilled ? APP_COLOR.PRIMARY : "#d1d6da"}
                    color={isFilled ? "#fdfcf3" : "#a2a7ab"}
                    disabled={!isFilled}
                    onPress={() => router.navigate("/(auth)/registerName")}
                />
                <Text style={{ textAlign: "center", marginTop: 20, fontWeight: 500 }}>Bạn không nhận được mã?
                    <Text style={{ color: "#0069cf" }}> Gửi lại</Text>
                </Text>
            </View>
            <View style={{ marginBottom: 30, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 5 }}>
                <AntDesign name="questioncircle" size={14} color="#3567f4" />
                <Text style={{ color: "#0c6df1", fontWeight: 500 }}>Tôi cần hỗ trợ thêm về mã xác thực</Text>
            </View>
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
        marginTop: 30,
        textAlign: "center"
    },
    reminder: {
        textAlign: "center",
        paddingVertical: 15,
        paddingHorizontal: 25,
        color: "#858a8e",
        fontWeight: 400
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

export default VerifyPage