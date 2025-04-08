import AppButton from "@/components/auth/Button";
import Input from "@/components/auth/input";
import { useCurrentApp } from "@/context/app.context";
import { useInfo } from "@/context/InfoContext";
import { APP_COLOR } from "@/utils/constant";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import CheckBox from "react-native-check-box";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateProfile } from "@/utils/api";

const editProfilePage = () => {
    const user = useCurrentApp().appState?.user;
    const { appState, setAppState } = useCurrentApp()
    const { avatar, setAvatar, name, setName, gender, setGender, dateOfBirth, setDateOfBirth } = useInfo()

    useEffect(() => {
        setAvatar(user.avatar)
        setName(user.name)
        setGender(user.gender)
        setDateOfBirth(user.dateOfBirth)
        console.log("hello")
    }, [])

    const [isCheckedMale, setIsCheckedMale] = useState<boolean>(
        user.gender === "male"
    )

    const [isCheckedFemale, setIsCheckedFemale] = useState<boolean>(
        user.gender === "female"
    )

    const [selectDate, setSelectDate] = useState<boolean>(false);

    const handleEditProfile = async () => {
        console.log("handleEditProfile")
        router.push("/pages/loading")
        try {
            let imgbbUrl = ""
            if (avatar !== user.avatar) {
                console.log("avatar", avatar)
                console.log("user avatar", user.avatar)
                imgbbUrl = await uploadToImgBB(avatar);
                console.log("imgbbUrl", imgbbUrl)
            }
            console.log("imgbbUrl", imgbbUrl)
            console.log("dateOfBirth", dateOfBirth.toLocaleDateString("en-CA"))
            const res = await updateProfile(name, dateOfBirth.toLocaleDateString("en-CA"), gender, imgbbUrl)
            console.log(res);
            if (res._id) {
                setAppState({
                    user: res,
                })
                router.back()
                router.replace("/pages/profile/profilePage")
            } else {
                console.log("Update failed")
                router.back()
            }
        } catch (error) {
            console.log(error)
            router.back()
        }
    }

    function getFileInfo(uri: string) {
        const fileName = uri.split('/').pop() || 'file';
        const extension = fileName.split('.').pop()?.toLowerCase();

        let mimeType = 'application/octet-stream';
        if (extension === 'png') mimeType = 'image/png';
        else if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';
        else if (extension === 'webp') mimeType = 'image/webp';

        return { fileName, mimeType };
    }

    const uploadToImgBB = async (imageUri: string) => {
        console.log("uploadToImgBB", imageUri)
        const formData = new FormData();
        const { fileName, mimeType } = getFileInfo(imageUri);
        console.log("fileName", fileName)
        console.log("mimeType", mimeType)

        formData.append('image', {
            uri: imageUri,
            type: mimeType,
            name: fileName,
        } as any);

        const apiKey = 'ebb4516a54242afaf2686d4109a38c0f';
        console.log("hello")

        const response = await fetch(`https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });
        console.log("hello 1")

        const json = await response.json();
        if (json.success) {
            return json.data.url; // Trả về URL ảnh đã upload
        } else {
            throw new Error('Upload failed');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.group}>
                <Pressable onPress={() => router.push("/pages/profile/editAvatarModal")} style={{ position: "relative" }}>
                    <Image style={styles.avatar} source={{ uri: avatar }} />
                    <View style={styles.icon}>
                        <MaterialCommunityIcons name="camera-plus" size={14} color="#717e87" />
                    </View>
                </Pressable>
                <View style={styles.field}>
                    <Input
                        placeholder=""
                        keyboardType="default"
                        value={name}
                        setValue={setName}
                        icon={<AntDesign name="edit" size={24} color="black" />}
                    />
                    <Input
                        editable={false}
                        placeholder=""
                        value={new Date(dateOfBirth).toLocaleDateString("vi-VN")}
                        onPress={() => setSelectDate(true)}
                        onPressIcon={() => setSelectDate(true)}
                        icon={<AntDesign name="edit" size={24} color="black" />}
                    />
                    {selectDate && (
                        <DateTimePicker
                            mode="date"
                            display="spinner"
                            value={new Date(dateOfBirth)}
                            onChange={(event, selectedDate) => {
                                setSelectDate(false);
                                if (selectedDate) {
                                    setDateOfBirth(selectedDate);
                                }
                            }}
                        />
                    )}
                    <View style={styles.gender}>
                        <CheckBox
                            style={{ marginLeft: 15, marginTop: 25, height: 50 }}
                            onClick={() => {
                                setGender("male")
                                setIsCheckedMale(true)
                                setIsCheckedFemale(false)
                            }
                            }
                            isChecked={isCheckedMale}
                            checkedCheckBoxColor="#009eff"
                            checkBoxColor="#c1c7c7"
                            rightTextView={
                                <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: "500" }}>
                                    Nam
                                </Text>
                            }
                        />
                        <CheckBox
                            style={{ marginLeft: 15, marginTop: 25, height: 50 }}
                            onClick={() => {
                                setGender("female")
                                setIsCheckedMale(false)
                                setIsCheckedFemale(true)
                            }
                            }
                            isChecked={isCheckedFemale}
                            checkedCheckBoxColor="#009eff"
                            checkBoxColor="#c1c7c7"
                            rightTextView={
                                <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: "500" }}>
                                    Nữ
                                </Text>
                            }
                        />
                    </View>
                </View>
            </View>
            <AppButton
                text="Lưu"
                color="#fff"
                onPress={handleEditProfile}
                backGroundColor={APP_COLOR.PRIMARY}
                style={{ marginTop: 10, }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#fff"
    },
    icon: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: 10,
        borderWidth: 1,
        borderColor: "#daddce",
    },
    group: {
        flexDirection: "row",
        paddingHorizontal: 10,
    },
    field: {
        marginLeft: 20,
        flex: 1,
    },
    gender: {
        flexDirection: "row",
        marginTop: 15,
        alignItems: "center",
    },
})

export default editProfilePage;