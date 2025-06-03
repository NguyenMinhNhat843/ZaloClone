import Option from "@/components/Option"
import { useCurrentApp } from "@/context/app.context"
import { useInfo } from "@/context/InfoContext"
import { getAllMembersByConversationId } from "@/utils/api"
import AntDesign from "@expo/vector-icons/AntDesign"
import Feather from "@expo/vector-icons/Feather"
import Fontisto from "@expo/vector-icons/Fontisto"
import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const chatSetting = () => {
    const { conversationsId, type, chatName, chatAvatar, receiverId } = useLocalSearchParams();
    const { avatar, setAvatar, members, setMembers } = useInfo();
    const user = useCurrentApp().appState?.user
    const { socket } = useCurrentApp()

    useEffect(() => {
        const featchAllMember = async () => {
            try {
                const res = await getAllMembersByConversationId(conversationsId as string);
                if (res.length > 0) {
                    setMembers(res.sort((a, b) => {
                        if (a.role === 'admin' && b.role !== 'admin') return -1;
                        if (a.role !== 'admin' && b.role === 'admin') return 1;
                        return 0;
                    }));
                } else {
                    console.log("No members found in this conversation.");
                }
            } catch (err) {
                console.log(err);
            }
        }
        if (type === "group") {
            featchAllMember();
        }
    }, [])

    useEffect(() => {
        const updateAvatar = async () => {
            try {
                socket.emit('updateGroupInfo', {
                    groupId: conversationsId,
                    groupAvatar: avatar,
                });
            } catch (err) {
                console.log(err)
            }
        }
        updateAvatar();
    }, [avatar])

    return (
        <SafeAreaView style={styles.container}>
            <Text>{conversationsId},{type},{chatName},{chatAvatar}</Text>
            <View style={styles.info}>
                {type === "group"
                    ? (<Pressable onPress={() => { router.push("/pages/profile/editAvatarModal") }}>
                        <Image style={styles.avatar} source={{ uri: chatAvatar as string }} />
                        <Ionicons style={styles.changeAvatar} name="camera-outline" size={14} color="#222126" />
                    </Pressable>)
                    : (<View>
                        <Image style={styles.avatar} source={{ uri: chatAvatar as string }} />
                    </View>)
                }
                <View style={styles.nameChat}>
                    <Text style={{ color: "#202020", fontSize: 18, fontWeight: 500 }}>{chatName}</Text>
                    <AntDesign style={{ backgroundColor: "#f3f2f7", padding: 5, borderRadius: 20 }} name="edit" size={24} color="black" />
                </View>
                <View style={styles.quickOptionGroup}>
                    <View style={styles.quickOption}>
                        <AntDesign style={styles.iconOption} name="search1" size={24} color="black" />
                        <Text style={{ textAlign: "center" }}>Tìm tin nhắn</Text>
                    </View>
                    {
                        type === "group"
                            ? (
                                <Pressable
                                    onPress={() => {
                                        router.push({
                                            pathname: '/pages/chat/addMemberGroup',
                                            params: {
                                                conversationsId: conversationsId,
                                                receiverId: receiverId,
                                                type: type,
                                                chatName: chatName,
                                                chatAvatar: chatAvatar,
                                            }
                                        })
                                    }}
                                    style={styles.quickOption}>
                                    <AntDesign style={styles.iconOption} name="addusergroup" size={24} color="black" />
                                    <Text style={{ textAlign: "center" }}>Thêm thành viên</Text>
                                </Pressable>)
                            : (
                                <View style={styles.quickOption}>
                                    <AntDesign style={styles.iconOption} name="user" size={24} color="black" />
                                    <Text style={{ textAlign: "center" }}>Xem trang cá nhân</Text>
                                </View>
                            )
                    }
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
            {type === "group" ? (
                <>
                    <Option
                        title=""
                        icon={<MaterialCommunityIcons name="account-group-outline" size={24} color="#868b8f" />}
                        onPress={() => {
                            router.push({
                                pathname: '/pages/chat/showAllMember',
                                params: {
                                    conversationsId: conversationsId,
                                }
                            })
                        }}
                        name="Xem thành viên"
                        secondaryName={`${members.length}`}
                        option={false}
                    />
                    <View style={{ height: 10 }}></View>
                    {members.find((item) => item.userId._id === user._id && item.role === "admin")
                        ? <Option
                            title=""
                            icon={<MaterialCommunityIcons name="account-key-outline" size={24} color="#868b8f" />}
                            onPress={() => {
                                router.push({
                                    pathname: '/pages/chat/warningModal',
                                    params: {
                                        conversationsId: conversationsId,
                                        chatName: chatName,
                                        chatAvatar: chatAvatar,
                                        receiverId: receiverId,
                                    }
                                })
                            }}
                            name="Chuyển quyền trưởng nhóm"
                            option={false}
                        />
                        : (<></>)
                    }
                    <Option
                        title=""
                        icon={<Feather name="log-out" size={24} color="#f64b52" />}
                        onPress={() => { }}
                        name="Rời nhóm"
                        option={false}
                        danger={true}
                    />
                </>
            ) : (
                <Text>Individual chat-specific content goes here</Text>
            )}
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