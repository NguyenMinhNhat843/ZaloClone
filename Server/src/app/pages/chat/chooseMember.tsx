import Input from "@/components/auth/input";
import { useCurrentApp } from "@/context/app.context";
import { useInfo } from "@/context/InfoContext";
import { getAllFriends, sendFileMessageAPI } from "@/utils/api";
import { timeStamToDate } from "@/utils/formatDataFile";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CheckBox from "react-native-check-box";

interface IMember {
    id: string,
    name: string,
    avatar: string
}

const ChooseMember = () => {
    const [member, setMember] = useState<IMember[]>([])
    const [groupName, setGroupName] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [friendList, setFriendList] = useState<IAccount[]>([])
    const user = useCurrentApp()?.appState?.user
    const { socket } = useCurrentApp()
    const { avatar, setAvatar } = useInfo();

    // useEffect(() => {
    //     const findPhone = async () => {
    //         setFriendList((prev) => {
    //             return prev.filter((friend) => {
    //                 if (phone.length > 0) {
    //                     return (friend.phone ?? "").includes(phone)
    //                 } else if (phone.length === 0) {
    //                     return friend
    //                 }
    //                 return friend
    //             })
    //         })

    //     }

    //     findPhone();
    // }, [phone])

    useEffect(() => {
        const fetchAllFriend = async () => {
            try {
                const res = await getAllFriends()
                if (res.length > 0) {
                    setFriendList(res);
                } else {
                    console.log("Không có bạn bè");
                }
            } catch (err) {
                console.log(err)
            }
        }
        setAvatar("");
        fetchAllFriend();
    }, [])

    const handleCreateGroup = async () => {
        router.push("/pages/loading")
        if (member.length >= 2 && groupName.length > 0 && avatar) {
            try {
                const upFile = await sendFileMessageAPI([avatar])
                socket.emit('createGroupChat', {
                    groupName: groupName,
                    members: member.map((item) => item.id),
                    groupAvatar: upFile.attachments[0].url,
                });
                router.back();
                router.replace("/(tabs)/ChatScreen")
            }
            catch (err) {
                router.back()
                console.log(err)
            }
        } else {
            router.back()
            Alert.alert("Thông báo", "Vui lòng nhập đủ thông tin để tạo nhóm")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>{groupName},{ },{JSON.stringify(member)}</Text>
            <View style={styles.header}>
                <AntDesign name="arrowleft" size={24} color="#121212" onPress={() => { router.back() }} />
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{ color: "#0d0d0d", fontSize: 18, fontWeight: 500 }}>Nhóm mới</Text>
                    <Text style={{ color: "#757575", fontSize: 14 }}>Đã chọn: {member.length}</Text>
                </View>
            </View>
            <View style={styles.renameGroup}>
                <Pressable style={{ height: 60, width: 60, justifyContent: "center", alignItems: "center" }} onPress={() => {
                    router.push("/pages/profile/editAvatarModal")
                }}>
                    {avatar ?
                        <Image style={{ height: 60, width: 60, borderRadius: 50 }} source={{ uri: avatar }} />
                        : <FontAwesome name="camera" size={24} color="#767676" />
                    }
                </Pressable>
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
                data={friendList.filter((friend) => friend._id !== user._id)}
                keyExtractor={(item) => item._id || ""}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setMember((prev) => {
                                if (prev.some((member) => member.id === item._id)) {
                                    return prev.filter((member) => member.id !== item._id)
                                } else if (item._id && item.name && item.avatar) {
                                    return [...prev, { id: item._id, name: item.name, avatar: item.avatar }]
                                }
                                return prev;
                            })
                        }}
                        style={styles.friendItem}>
                        <Image style={{ height: 60, width: 60, borderRadius: 50 }} source={{ uri: item.avatar }} />
                        <View style={{ gap: 5, flex: 1 }}>
                            <Text style={{ color: "#2a2a2a", fontSize: 16, fontWeight: 400 }}>{item.name}</Text>
                            <Text style={{ color: "#757575", fontSize: 13 }}>{timeStamToDate(item?.createdAt ?? "")}</Text>
                        </View>
                        <CheckBox
                            style={{ marginLeft: 15, marginTop: 25, height: 50 }}
                            onClick={() => {
                                setMember((prev) => {
                                    if (prev.some((member) => member.id === item._id)) {
                                        return prev.filter((member) => member.id !== item._id)
                                    } else if (item._id && item.name && item.avatar) {
                                        return [...prev, { id: item._id, name: item.name, avatar: item.avatar }]
                                    }
                                    return prev;
                                })
                            }}
                            isChecked={member.some((member) => member.id === item._id)}
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
                                <Image style={{ height: 60, width: 60, borderRadius: 50 }} source={{ uri: item.avatar }} />
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
                    <Pressable style={{ backgroundColor: "#009ffd", height: 60, width: 60, borderRadius: 50, alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: 10 }} onPress={() => { handleCreateGroup() }}>
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
        gap: 5,
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