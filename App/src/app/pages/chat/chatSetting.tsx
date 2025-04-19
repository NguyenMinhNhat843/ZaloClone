import Option from "@/components/Option"
import AntDesign from "@expo/vector-icons/AntDesign"
import Feather from "@expo/vector-icons/Feather"
import Fontisto from "@expo/vector-icons/Fontisto"
import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { router } from "expo-router"
import React from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const chatSetting = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.info}>
                <View>
                    <Image style={styles.avatar} source={require('@/assets/images/avatar3.png')} />
                    <Ionicons style={styles.changeAvatar} name="camera-outline" size={14} color="#222126" />
                </View>
                <View style={styles.nameChat}>
                    <Text style={{ color: "#202020", fontSize: 18, fontWeight: 500 }}>Nhóm 8 KNLVN</Text>
                    <AntDesign style={{ backgroundColor: "#f3f2f7", padding: 5, borderRadius: 20 }} name="edit" size={24} color="black" />
                </View>
                <View style={styles.quickOptionGroup}>
                    <View style={styles.quickOption}>
                        <AntDesign style={styles.iconOption} name="search1" size={24} color="black" />
                        <Text style={{ textAlign: "center" }}>Tìm tin nhắn</Text>
                    </View>
                    <View style={styles.quickOption}>
                        <AntDesign style={styles.iconOption} name="addusergroup" size={24} color="black" />
                        <Text style={{ textAlign: "center" }}>Thêm thành viên</Text>
                    </View>
                    <View style={styles.quickOption}>
                        <MaterialCommunityIcons style={styles.iconOption} name="brush-variant" size={24} color="black" />
                        <Text style={{ textAlign: "center" }}>Đổi hình nền</Text>
                    </View>
                    <View style={styles.quickOption}>
                        <Fontisto style={styles.iconOption} name="bell" size={24} color="black" />
                        <Text style={{ textAlign: "center" }}>Tắt thông báo</Text>
                    </View>
                </View>
            </View>
            <View style={{ height: 10 }}></View>
            <Option
                title=""
                icon={<MaterialCommunityIcons name="account-group-outline" size={24} color="#868b8f" />}
                onPress={() => { router.push('/pages/chat/showAllMember') }}
                name="Xem thành viên"
                secondaryName="5"
                option={false}
            />
            <View style={{ height: 10 }}></View>
            <Option
                title=""
                icon={<MaterialCommunityIcons name="account-key-outline" size={24} color="#868b8f" />}
                onPress={() => { }}
                name="Chuyển quyền trưởng nhóm"
                option={false}
            />
            <Option
                title=""
                icon={<Feather name="log-out" size={24} color="#f64b52" />}
                onPress={() => { }}
                name="Rời nhóm"
                option={false}
                danger={true}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    info: {
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#fff',
        paddingVertical: 20,
    },
    avatar: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    changeAvatar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#f6f6f6',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#fff',
        padding: 5,
    },
    nameChat: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    quickOptionGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        gap: 20,
        paddingHorizontal: 20,
    },
    quickOption: {
        width: 70,
        alignItems: 'center',
        gap: 15,
    },
    iconOption: {
        backgroundColor: '#f7f7f7',
        padding: 10,
        borderRadius: 50,
    }
})

export default chatSetting