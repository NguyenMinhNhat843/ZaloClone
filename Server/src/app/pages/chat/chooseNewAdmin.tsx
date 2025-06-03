import Option from "@/components/Option"
import { useCurrentApp } from "@/context/app.context"
import { getAllMembersByConversationId } from "@/utils/api"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { Image } from "react-native"
import { FlatList, View } from "react-native"

const ChooseNewAdmin = () => {
    const { conversationsId, chatName, chatAvatar, receiverId } = useLocalSearchParams()
    const [member, setMember] = useState<IMember[]>([])
    const user = useCurrentApp().appState?.user

    useEffect(() => {
        const fetchAllMember = async () => {
            try {
                const res = await getAllMembersByConversationId(conversationsId as string)
                if (res.length > 0) {
                    setMember(res.filter((member) => member.userId._id !== user._id));
                } else {
                    console.log("Không có thành viên nào")
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchAllMember()
    }, [])

    return (
        <FlatList
            data={member}
            renderItem={({ item }) => {
                return (
                    <Option
                        title=""
                        icon={
                            <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.userId.avatar }} />

                        }
                        onPress={() => {
                            router.push({
                                pathname: '/pages/chat/warningModal',
                                params: {
                                    conversationsId: conversationsId,
                                    chatName: chatName,
                                    chatAvatar: chatAvatar,
                                    receiverId: receiverId,
                                    memberId: item.userId._id,
                                    memberName: item.userId.name,
                                }
                            })
                        }}
                        name={item.userId.name}
                        option={false}
                    />
                )
            }}
            keyExtractor={(item) => item.userId._id}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default ChooseNewAdmin