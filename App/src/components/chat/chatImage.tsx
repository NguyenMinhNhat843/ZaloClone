import React, { useState, useEffect } from "react";
import { View, Button, Image, FlatList, Dimensions, Pressable, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { APP_COLOR } from "@/utils/constant";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// width of the screen
const width = Dimensions.get("window").width;

const ChatImage = () => {
    const [photos, setPhotos] = useState<string[]>([]);
    const [isHaveImage, setIsHaveImage] = useState(false);

    // Kiểm tra xem có ảnh nào đã được chọn không
    useEffect(() => {
        setIsHaveImage(photos.length > 0);
    }, [photos]);

    // Xin quyền truy cập camera
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                alert("Ứng dụng cần quyền truy cập camera!");
            }
        })();
    }, []);

    // Xin quyền truy cập ảnh
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert("Ứng dụng cần quyền truy cập thư viện ảnh!");
            }
        })();
    }, []);

    // Mở máy ảnh và chụp ảnh
    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false, // Không cho phép chỉnh sửa ảnh
            quality: 1, // Chất lượng ảnh cao nhất
        });

        if (!result.canceled) {
            setPhotos((prevPhotos) => [...prevPhotos, result.assets[0].uri]); // Thêm ảnh vào danh sách
        }
    };

    // Mở thư viện ảnh và chọn ảnh
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'], // Chỉ cho phép chọn ảnh và video
            allowsMultipleSelection: true, // Cho phép chọn nhiều ảnh (chỉ hoạt động với SDK 49+)
            quality: 1,
            selectionLimit: 10, // Giới hạn số ảnh chọn
        });

        if (!result.canceled) {
            const newImages = result.assets.map((asset) => asset.uri);
            setPhotos((prevPhotos) => [...prevPhotos, ...newImages]);
        }
    };

    // Xóa ảnh khỏi danh sách
    const removePhoto = (uri: string) => {
        setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo !== uri));
    };

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.button} onPress={takePhoto}>
                            <Feather name="camera" size={24} color="#757575" />
                            <Text>Chụp ảnh</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={pickImage}>
                            <FontAwesome5 name="photo-video" size={24} color={APP_COLOR.PRIMARY} />
                            <Text>Chọn từ thư viện</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={() => { console.log("hehe") }} disabled={!isHaveImage}>
                            <View style={{ backgroundColor: isHaveImage ? APP_COLOR.PRIMARY : "#ccc", height: 70, width: 70, alignItems: "center", justifyContent: "center", borderRadius: 50 }}>
                                <FontAwesome name="send" size={24} color={isHaveImage ? "#fff" : "black"} />
                            </View>
                        </Pressable>
                    </View>
                }
                data={photos}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                renderItem={({ item }) => (
                    <View style={{ borderWidth: 1, borderColor: "#fff" }}>
                        <Image source={{ uri: item }} style={{ width: width / 3 - 2, height: width / 3 - 2 }} />
                        <Pressable onPress={() => removePhoto(item)} style={{ position: "absolute", top: 2, right: 2, borderRadius: 50, backgroundColor: "#fff" }}>
                            <Ionicons name="close-circle" size={24} color="red" />
                        </Pressable>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        width: width / 3,
        height: width / 3,
        gap: 5,
        borderWidth: 1,
        borderColor: "#efefef",
    },
})

export default ChatImage;