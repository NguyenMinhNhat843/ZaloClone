import { APP_COLOR } from "@/utils/constant";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const FindAccount = () => {
    const [phone, setPhone] = React.useState("0385345330")

    const isFilled = phone.length > 9 && phone.length < 12

    return (
        <View>
            <AntDesign style={{ marginLeft: 15, marginTop: 10 }} onPress={router.back} name="arrowleft" size={24} color={"black"} />
            <Text style={styles.title}>Tìm kiếm bạn bè</Text>
            <View style={styles.inputGroup}>
                <View style={{ flex: 1 }}>
                    <TextInput placeholder="Nhập số điện thoại"
                        style={styles.input}
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        value={phone}
                        onChangeText={setPhone}
                        placeholderTextColor={"#aaa9af"}
                    />
                    <View style={styles.areaPhone}>
                        <Text>+84</Text>
                        <AntDesign name="down" size={12} color="#2c68e4" />
                    </View>
                </View>
                <Pressable
                    onPress={() => {
                        router.push({
                            pathname: '/pages/profile/peopleProfile',
                            params: { phone: phone }
                        })
                    }}
                    disabled={!isFilled}
                    style={[styles.button, { backgroundColor: isFilled ? APP_COLOR.PRIMARY : "#d1d6da" }]}>
                    <AntDesign name="arrowright" size={24} color={isFilled ? "#fff" : "#c4c4c4"} />
                </Pressable>
            </View>
        </View>
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
    inputGroup: {
        marginHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    input: {
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "#b4b4b4",
        paddingLeft: 70,
        height: 50,
        backgroundColor: "#fff",
    },
    areaPhone: {
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7f7f7",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        borderWidth: 1,
        borderRightColor: "#dfdfdf",
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
        borderTopColor: "#b4b4b4",
        borderBottomColor: "#b4b4b4",
        borderLeftColor: "#b4b4b4",
        padding: 10
    },
    button: {
        padding: 10,
        borderRadius: 50,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
    }
})

export default FindAccount;