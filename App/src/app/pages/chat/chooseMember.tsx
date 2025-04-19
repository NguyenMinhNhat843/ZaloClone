import Input from "@/components/auth/input";
import { timeStamToDate } from "@/utils/formatDataFile";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CheckBox from "react-native-check-box";

const fakeData = [
    {
        "id": "1",
        "name": "Nguyễn Văn A",
        "avatar": "https://i.ibb.co/TDvW7DKg/pepe-the-frog-1272162-640.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "2",
        "name": "Nguyễn Văn B",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744790080/ZaloClone/avatars/avatar_0147123159.png",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "3",
        "name": "Nguyễn Văn C",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744939096/ZaloClone/avtars/avatar_680089e7157fa56263556d0a.jpeg.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "4",
        "name": "Nguyễn Văn D",
        "avatar": "https://i.ibb.co/TDvW7DKg/pepe-the-frog-1272162-640.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "5",
        "name": "Nguyễn Văn E",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744790080/ZaloClone/avatars/avatar_0147123159.png",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "6",
        "name": "Nguyễn Văn F",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744939096/ZaloClone/avtars/avatar_680089e7157fa56263556d0a.jpeg.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "7",
        "name": "Nguyễn Văn G",
        "avatar": "https://i.ibb.co/TDvW7DKg/pepe-the-frog-1272162-640.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "8",
        "name": "Nguyễn Văn H",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744790080/ZaloClone/avatars/avatar_0147123159.png",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "9",
        "name": "Nguyễn Văn I",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744939096/ZaloClone/avtars/avatar_680089e7157fa56263556d0a.jpeg.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "10",
        "name": "Nguyễn Văn J",
        "avatar": "https://i.ibb.co/TDvW7DKg/pepe-the-frog-1272162-640.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "11",
        "name": "Nguyễn Văn K",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744790080/ZaloClone/avatars/avatar_0147123159.png",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "12",
        "name": "Nguyễn Văn L",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744939096/ZaloClone/avtars/avatar_680089e7157fa56263556d0a.jpeg.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "13",
        "name": "Nguyễn Văn M",
        "avatar": "https://i.ibb.co/TDvW7DKg/pepe-the-frog-1272162-640.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "14",
        "name": "Nguyễn Văn N",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744790080/ZaloClone/avatars/avatar_0147123159.png",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "15",
        "name": "Nguyễn Văn O",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744939096/ZaloClone/avtars/avatar_680089e7157fa56263556d0a.jpeg.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "16",
        "name": "Nguyễn Văn P",
        "avatar": "https://i.ibb.co/TDvW7DKg/pepe-the-frog-1272162-640.jpg",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
    {
        "id": "17",
        "name": "Nguyễn Văn Q",
        "avatar": "https://res.cloudinary.com/dz1nfbpra/image/upload/v1744790080/ZaloClone/avatars/avatar_0147123159.png",
        "lastMessageTime": "2023-10-01T10:00:00Z",
    },
]

interface IMember {
    id: string,
    name: string,
    avatar: string
}

const ChooseMember = () => {
    const [member, setMember] = useState<IMember[]>([])
    const [groupName, setGroupName] = useState<string>("")
    const [phone, setPhone] = useState<string>("")

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name="arrowleft" size={24} color="#121212" onPress={() => { router.back() }} />
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{ color: "#0d0d0d", fontSize: 18, fontWeight: 500 }}>Nhóm mới</Text>
                    <Text style={{ color: "#757575", fontSize: 14 }}>Đã chọn: {member.length}</Text>
                </View>
            </View>
            <View style={styles.renameGroup}>
                <FontAwesome name="camera" size={24} color="#767676" />
                <Input
                    placeholder="Nhập tên nhóm"
                    value={groupName}
                    setValue={setGroupName}
                    style={{ flex: 1 }}
                />
            </View>
            <View style={{ backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 15 }}>
                <View style={styles.findPhone}>
                    <AntDesign name="search1" size={24} color="#85898b" />
                    <TextInput
                        placeholder="Tìm tên hoặc số điện thoại"
                        value={phone}
                        onChangeText={setPhone}
                        style={{ flex: 1, fontSize: 16, color: "#000" }}
                        keyboardType="phone-pad"
                    />
                </View>
            </View>
            <FlatList
                data={fakeData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setMember((prev) => {
                                if (prev.some((member) => member.id === item.id)) {
                                    return prev.filter((member) => member.id !== item.id)
                                } else {
                                    return [...prev, item]
                                }
                            })
                        }}
                        style={styles.friendItem}>
                        <Image style={{ height: 60, width: 60, borderRadius: 50 }} source={{ uri: item.avatar }} />
                        <View style={{ gap: 5, flex: 1 }}>
                            <Text style={{ color: "#2a2a2a", fontSize: 16, fontWeight: 400 }}>{item.name}</Text>
                            <Text style={{ color: "#757575", fontSize: 13 }}>{timeStamToDate(item.lastMessageTime)}</Text>
                        </View>
                        <CheckBox
                            style={{ marginLeft: 15, marginTop: 25, height: 50 }}
                            onClick={() =>
                                setMember((prev) => {
                                    if (prev.some((member) => member.id === item.id)) {
                                        return prev.filter((member) => member.id !== item.id)
                                    } else {
                                        return [...prev, item]
                                    }
                                })
                            }
                            isChecked={member.some((member) => member.id === item.id)}
                            checkedCheckBoxColor="#009eff"
                            checkBoxColor="#c1c7c7"
                        />
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
            {member.length > 0 && (
                <View style={styles.choosedAvatar}>
                    <FlatList
                        data={member}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    setMember((prev) => prev.filter((member) => member.id !== item.id))
                                }}
                                style={{ backgroundColor: "#fff", flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <Image style={{ height: 56, width: 60, borderRadius: 50 }} source={{ uri: item.avatar }} />
                                <View style={{ borderColor: "#fff", borderWidth: 1, borderRadius: 50, position: "absolute", top: 0, right: 0 }}>
                                    <Ionicons style={{ backgroundColor: "#5a7b94", borderRadius: 30, }} name="close-circle-sharp" size={18} color="#dde9e1" />
                                </View>
                            </Pressable>
                        )}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ padding: 10, gap: 15 }}
                        horizontal={true}
                    />
                    <Pressable style={{ backgroundColor: "#009ffd", height: 60, width: 60, borderRadius: 50, alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: 10 }} onPress={() => { }}>
                        <AntDesign name="arrowright" size={24} color="black" />
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ccc",
    },
    header: {
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        backgroundColor: "#f7f7f7"
    },
    renameGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    findPhone: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 5,
    },
    friendItem: {
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    choosedAvatar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        gap: 10,
        paddingHorizontal: 15,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    }
})

export default ChooseMember;