import BannerHome from "@/components/auth/Banner"
import AppButton from "@/components/auth/Button"
import { APP_COLOR } from "@/utils/constant"
import Entypo from "@expo/vector-icons/Entypo"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import React from "react"
import { Dimensions, Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native"


const width = Dimensions.get("window").width;
const WelcomePage = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.language}>
                <View style={styles.languageButton}>
                    <Text style={styles.languageText}>Tiếng Việt</Text>
                    <Entypo name="chevron-small-down" size={24} color="black" />
                </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <ImageBackground
                    source={require("../../assets/welcome/backgroundZalo.png")}
                    resizeMode="cover"
                    style={styles.bannerBackground}>

                </ImageBackground>
                <BannerHome />
            </View>
            <View style={{ gap: 10, marginBottom: 20 }}>
                <AppButton
                    onPress={() => router.navigate("/(auth)/login")}
                    text="Đăng nhập"
                    backGroundColor={APP_COLOR.PRIMARY}
                    color={APP_COLOR.WHITE}
                />
                <AppButton
                    onPress={() => router.navigate("/(auth)/signup")}
                    text="Tạo tài khoản mới"
                    backGroundColor={APP_COLOR.GREY}
                    color={APP_COLOR.BLACK}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: 'space-between',
    },
    language: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 15
    },
    languageButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        padding: 2,
        paddingHorizontal: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#dfdfdf"
    },
    languageText: {
        fontSize: 16,
        fontWeight: 500
    },
    bannerBackground: {
        width: width,
        height: width / 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    }
})

export default WelcomePage