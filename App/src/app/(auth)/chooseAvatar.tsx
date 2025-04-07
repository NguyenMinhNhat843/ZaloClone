import AppButton from "@/components/auth/Button";
import { useCurrentApp } from "@/context/app.context";
import { useInfo } from "@/context/InfoContext";
import { getAccountAPI, loginAPI, registerAPI } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Avatar = () => {
    const { setAppState } = useCurrentApp()
    const { name, phone, gender, dateOfBirth, avatar, setAvatar } = useInfo();

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
                    router.replace("/(tabs)")
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


    const handleRegister = async (imageUrl: string) => {
        router.push("/(auth)/loading")
        let imgbbUrl = ""
        if (imageUrl.length > 0) {
            imgbbUrl = await uploadToImgBB(imageUrl);
        }
        console.log("imgbbUrl", imgbbUrl)
        const password = "123456"; // Mật khẩu mặc định
        try {
            console.log("imgbbUrl", imgbbUrl)
            setAvatar(imgbbUrl); // Cập nhật avatar trong context
            const res = await registerAPI(
                phone, password, imgbbUrl, name, "123", dateOfBirth.toLocaleDateString("en-CA"), gender
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

    const uploadToImgBB = async (imageUri: string) => {
        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'avatar.jpg',
        } as any);

        const apiKey = 'ebb4516a54242afaf2686d4109a38c0f';

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        const json = await response.json();
        if (json.success) {
            return json.data.url; // Trả về URL ảnh đã upload
        } else {
            throw new Error('Upload failed');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 70, gap: 10 }}>
                <Text style={styles.title}>Cập nhật ảnh đại diện</Text>
                <Text style={styles.reminder}>Đặt ảnh đại diện để mọi người dễ nhận ra bạn</Text>
                <Image style={styles.avatar} source={{ uri: avatar ? avatar : "https://res.cloudinary.com/dz1nfbpra/image/upload/v1743683852/8f1ca2029e2efceebd22fa05cca423d7_wgoko2.jpg" }} />
            </View>
            <View style={{ gap: 10, marginBottom: 30 }}>
                <AppButton
                    text={avatar.length > 0 ? "Tiếp tục" : "Cập nhật"}
                    backGroundColor="#1068fe"
                    color="#fefef6"
                    onPress={avatar.length > 0
                        ? () => {
                            console.log("avatar", avatar)

                            handleRegister(avatar)
                        }
                        : () => {
                            router.push("/(auth)/chooseAvatarModal")
                        }}
                />
                <AppButton
                    text={avatar.length > 0 ? "Chọn ảnh khác" : "Bỏ qua"}
                    backGroundColor="#ededed"
                    color="#101010"
                    onPress={avatar.length > 0
                        ? () => {
                            router.push("/(auth)/chooseAvatarModal")
                        }
                        : () => {
                            handleRegister("")
                        }}
                />
            </View>
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
        marginLeft: 15,
        marginTop: 10
    },
    reminder: {
        fontSize: 14,
        color: "#858a8e",
        marginLeft: 15,
        marginTop: 5
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20,
    },
})

export default Avatar;