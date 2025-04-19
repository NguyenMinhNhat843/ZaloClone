import Option from "@/components/Option";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const ShowAllMember = () => {
    return (
        <View>
            <Option
                title=""
                icon={
                    <AntDesign
                        style={{ padding: 10, backgroundColor: "#f5f4fa", borderRadius: 50 }}
                        name="addusergroup" size={24} color="#222123" />
                }
                onPress={() => { }}
                name="Thêm thành viên"
                option={false}
            />
            <View style={{ height: 20 }}></View>
            <View style={styles.member}>
                <Text style={{ color: "#0079bf", paddingLeft: 15, marginTop: 20 }}>Thành viên (3)</Text>
                <Option
                    title="Trưởng nhóm"
                    icon={
                        <View style={{ paddingRight: 5 }}>
                            <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={require('@/assets/images/avatar3.png')} />
                            <SimpleLineIcons style={{ padding: 3, borderRadius: 30, backgroundColor: "#7e828b", position: "absolute", bottom: 0, right: 0 }} name="key" size={12} color="#e2db5b" />
                        </View>
                    }
                    onPress={() => { router.push("/pages/chat/memberOptionModal") }}
                    name="Bạn"
                    option={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 20,
    },
    member: {
        backgroundColor: "#fff",
    }
})

export default ShowAllMember;