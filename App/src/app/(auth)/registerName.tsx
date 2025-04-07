import AppButton from "@/components/auth/Button";
import Input from "@/components/auth/input";
import { useInfo } from "@/context/InfoContext";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import React, { useState } from "react"
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const RegisterNamePage = () => {
    const { name, setName } = useInfo()
    const isFilled = name.length >= 2 && name.length <= 40 && !/\d/.test(name);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ justifyContent: "flex-start", }}>
                <Text style={styles.title}>Nhập tên Zalo</Text>
                <Text style={styles.reminder}>
                    Hãy dùng tên thật để mọi người nhận ra bạn
                </Text>
                <Input
                    placeholder="Nguyễn Văn A"
                    keyboardType="default"
                    value={name}
                    setValue={setName}
                    autoFocus={true}
                    fullBorder={true}
                />

                <View style={{ marginLeft: 20, marginTop: 10 }}>
                    <Text style={styles.nameRule}>•  Dài từ 2 đến 40 ký tự</Text>
                    <Text style={styles.nameRule}>•  Không chứa số</Text>
                    <Text style={styles.nameRule}>•  Cần tuân thủ <Text style={{ color: "#0396f3" }}>quy định đặt tên Zalo</Text></Text>
                </View>
            </View>
            {/* <View style={{ marginBottom: 30, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 5 }}>
                <AntDesign name="questioncircle" size={14} color="#3567f4" />
                <Text style={{ color: "#0c6df1", fontWeight: 500 }}>Tôi cần hỗ trợ thêm về mã xác thực</Text>
            </View> */}
            <AppButton
                text="Tiếp tục"
                backGroundColor={isFilled ? APP_COLOR.PRIMARY : "#d1d6da"}
                color={isFilled ? "#fdfcf3" : "#a2a7ab"}
                disabled={!isFilled}
                onPress={() => router.navigate("/(auth)/registerPersonalInfo")}
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

export default RegisterNamePage;