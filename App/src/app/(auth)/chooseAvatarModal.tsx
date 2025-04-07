import React from "react"
import { useInfo } from "@/context/InfoContext"
import { router, useLocalSearchParams } from "expo-router"
import { Alert, Pressable, StyleSheet, Text } from "react-native"
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated"
import Feather from "@expo/vector-icons/Feather"
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons"
import * as ImagePicker from 'expo-image-picker';


const choseAvatarModal = () => {
    const { setAvatar } = useInfo()

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Ứng dụng cần quyền truy cập camera!");
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false, // Không cho phép chỉnh sửa ảnh
            quality: 1, // Chất lượng ảnh cao nhất
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setAvatar(uri); // Thêm ảnh vào danh sách
        }
    };

    const pickImage = async () => {
        // Yêu cầu quyền truy cập thư viện
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "You need to allow access to your media library.");
            return;
        }

        // Mở thư viện ảnh
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Chỉ cho phép chọn ảnh
            allowsEditing: false,
            quality: 1,
            allowsMultipleSelection: false, // Chỉ chọn 1 ảnh
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setAvatar(uri);
        }
    };

    return (
        <Animated.View
            entering={FadeIn}
            style={{
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "rgba(0, 0, 0, 0.5)",

            }}
        >
            <Pressable
                onPress={() => router.back()}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View
                entering={SlideInDown}
                style={{
                    width: "100%",
                    height: "auto",
                    backgroundColor: "#fff",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    gap: 5,
                    padding: 20
                }}
            >
                <Pressable
                    style={styles.group}
                    onPress={() => {
                        takePhoto()
                        router.back()
                    }}
                >
                    <Feather name="camera" size={24} color="black" />
                    <Text>Chụp ảnh mới</Text>
                </Pressable>
                <Pressable style={styles.group}
                    onPress={() => {
                        pickImage()
                        router.back()
                    }}
                >
                    <SimpleLineIcons name="picture" size={24} color="black" />
                    <Text>Chọn ảnh trên máy</Text>
                </Pressable>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    group: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 10,
    },
})

export default choseAvatarModal