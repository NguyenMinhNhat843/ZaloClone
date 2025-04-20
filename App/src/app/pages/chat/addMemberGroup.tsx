import ChooseMemberList from "@/components/chat/chooseMemberList"
import { useCurrentApp } from "@/context/app.context"
import { useInfo } from "@/context/InfoContext"
import { getAllFriends } from "@/utils/api"
import AntDesign from "@expo/vector-icons/AntDesign"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

interface IMember {
    id: string,
    name: string,
    avatar: string
}

const AddMemberGroup = () => {
    const [member, setMember] = useState<IMember[]>([])
    const [friendList, setFriendList] = useState<IAccount[]>([])
    const { members, setMembers } = useInfo();
    const { conversationsId, receiverId, type, chatName, numOfMembers, chatAvatar } = useLocalSearchParams();
    const { socket } = useCurrentApp();
    useEffect(() => {
        const fetchAllFriend = async () => {
            try {
                const res = await getAllFriends()
                if (res.length > 0) {
                    setFriendList(res.filter((friend) => !members.some((member) => member.userId._id === friend._id)));
                } else {
                    console.log("Không có bạn bè");
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchAllFriend();
    }, [])

    return (
        <View style={styles.container}>
            <Text>{JSON.stringify(member)}</Text>
            <View style={styles.header}>
                <AntDesign name="arrowleft" size={24} color="#121212" onPress={() => { router.back() }} />
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{ color: "#0d0d0d", fontSize: 18, fontWeight: 500 }}>Thêm vào nhóm</Text>
                    <Text style={{ color: "#757575", fontSize: 14 }}>Đã chọn: {member.length}</Text>
                </View>
            </View>
            <ChooseMemberList
                friendList={friendList}
                member={member}
                setMember={setMember}
                handleAddToGroup={() => {
                    socket.emit('addMembersToGroup', {
                        groupId: conversationsId,
                        members: member.map((item) => item.id),
                    });
                    router.replace({
                        pathname: '/pages/chatRoom',
                        params: {
                            conversationsId: conversationsId,
                            receiverId: receiverId,
                            type: type,
                            chatName: chatName,
                            chatAvatar: chatAvatar,
                        }
                    })
                }}
            />
        </View>
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

export default AddMemberGroup