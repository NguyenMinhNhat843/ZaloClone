import { useCurrentApp } from "@/context/app.context"
import { APP_COLOR } from "@/utils/constant"
import { Link, router } from "expo-router"
import React from "react"
import { Image, ImageURISource, Pressable, StyleSheet, Text, View } from "react-native"

interface IProps {
    conversationsId: string,
    lastMessage: string,
    lastMessageOwner: string,
    lastMessageTime: string,
    chatName: string,
    chatAvatar: string
    participants: string[]
}

const avatarSize = 50

const ChatItem = (props: IProps) => {
    const { conversationsId, lastMessage, lastMessageOwner,
        lastMessageTime, chatName, chatAvatar,
        participants } = props
    const user = useCurrentApp().appState?.user
    return (
        <Pressable
            onPress={() => router.push({
                pathname: '/pages/chatRoom',
                params: {
                    conversationsId: conversationsId,
                    receiverId: participants.filter((item) => item !== user._id),
                }
            }
            )}>
            <View style={styles.container}>
                <View style={styles.avatar}>
                    {chatAvatar
                        ? <Image style={styles.avatarImage} source={{ uri: chatAvatar }} />
                        : <View>
                            <Image style={styles.avatarImage} source={require('../../assets/images/avatar3.png')} />
                        </View>
                    }
                </View>
                <View style={styles.chat}>
                    <View style={styles.chatInfo}>
                        <Text numberOfLines={1} style={styles.chatName}>{chatName}</Text>
                        <Text numberOfLines={1} style={styles.lastMessage}>{lastMessageOwner}{lastMessage}</Text>
                    </View>
                    <Text style={styles.lastMessageTime}>{lastMessageTime}</Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 20,
        paddingLeft: 10,
        backgroundColor: '#fff',
    },
    avatar: {
        padding: 10,
        paddingRight: 0
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    chat: {
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 1,
        borderColor: "#efe8e8",
        padding: 10,
        paddingLeft: 0
    },
    chatInfo: {
        flex: 1,
        gap: 5
    },
    chatName: {
        fontSize: 15,
        fontWeight: '400'
    },
    lastMessage: {
        color: '#86898c',
    },
    lastMessageTime: {
        fontSize: 12,
        textAlign: 'right',
        marginRight: 10,
    }
})

export default ChatItem