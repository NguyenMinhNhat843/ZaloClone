import AppButton from "@/components/auth/Button"
import Input from "@/components/auth/input"
import { useInfo } from "@/context/InfoContext"
import { APP_COLOR } from "@/utils/constant"
import AntDesign from "@expo/vector-icons/AntDesign"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { router } from "expo-router"
import React, { useState } from "react"
import { SafeAreaView, StyleSheet, Text, View } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker";
const registerPersonalInfo = () => {
    const { gender, dateOfBirth, setDateOfBirth } = useInfo();
    const [selectDate, setSelectDate] = useState<boolean>(false);

    const isInitialDate = dateOfBirth.getFullYear() === new Date().getFullYear() - 14 && dateOfBirth.getMonth() === new Date().getMonth() && dateOfBirth.getDate() === new Date().getDate()

    // Check if date > 14 years ago
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
    const isDateValid = dateOfBirth <= minDate;
    const isFilled = isDateValid && gender.length > 0

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ gap: 15 }}>
                <AntDesign style={{ marginLeft: 15, marginTop: 10 }} onPress={router.back} name="arrowleft" size={24} color={"black"} />
                <Text style={styles.title}>Thêm thông tin cá nhân</Text>
                {selectDate && (
                    <DateTimePicker
                        mode="date"
                        display="spinner"
                        value={dateOfBirth}
                        onChange={(event, selectedDate) => {
                            setSelectDate(false);
                            if (selectedDate) {
                                setDateOfBirth(selectedDate);
                            }
                        }}
                    />
                )}
                <Input
                    placeholder="Sinh nhật"
                    fullBorder={true}
                    borderColor="#858a8e"
                    editable={false}
                    value={isInitialDate ? null : dateOfBirth.toLocaleDateString()}
                    onPress={() => setSelectDate(true)}
                    onPressIcon={() => setSelectDate(true)}
                    icon={<MaterialCommunityIcons name="calendar-month-outline" size={24} color={"#858a8e"} />}
                />
                <Text style={styles.nameRule}>•  Bạn phải lớn hơn 14 tuổi</Text>
                <Input
                    placeholder="Giới tính"
                    fullBorder={true}
                    borderColor="#858a8e"
                    editable={false}
                    value={gender === "male" ? "Nam" : gender === "female" ? "Nữ" : ""}
                    onPress={() =>
                        router.navigate({
                            pathname: "/(auth)/gender",
                        })}
                    icon={<FontAwesome name="angle-down" size={24} color="#858a8e" />}
                />
            </View>
            <AppButton
                text="Tiếp tục"
                backGroundColor={isFilled ? APP_COLOR.PRIMARY : "#d1d6da"}
                color={isFilled ? "#fdfcf3" : "#a2a7ab"}
                disabled={!isFilled}
                style={{ marginBottom: 30 }}
                onPress={() => {
                    if (isFilled) {
                        router.replace("/(auth)/chooseAvatar")
                    }
                }}
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
        marginTop: 30,
        textAlign: "center",
    },
    nameRule: {
        fontSize: 15,
        fontWeight: "400",
        color: "#858a8e",
        marginLeft: 20,
    },
})

export default registerPersonalInfo