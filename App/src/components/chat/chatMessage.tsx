import React from "react"
import { View, Pressable, Keyboard, Image, Text, StyleSheet } from "react-native"

interface IProps {
    message: IMessage,
    userId: string,
    onPress: () => void
}

const ChatMessage = (props: IProps) => {
    const { message, onPress, userId } = props
    return (message.sender._id === userId
        ?
        message.attachments.length > 0
            ? <View style={{ alignItems: "flex-end", marginRight: 10 }}>
                {message.attachments.map((attachment: any) => {
                    return (
                        <Pressable
                            onPress={() => {
                                console.log("attachment", attachment.url)
                            }}>
                            <Image
                                source={{ uri: attachment.url }}
                                style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 5 }} />
                        </Pressable>
                    )
                })}
            </View>
            : <Pressable onPress={() => {
                onPress();
            }} style={{ alignItems: "flex-end", marginRight: 10 }}>
                <View style={[styles.message, {
                    backgroundColor: "#d4f1ff",
                    maxWidth: "80%"
                }]}>
                    <Text>{message.text}</Text>
                </View>
            </Pressable>

        :
        message.attachments.length > 0
            ? <View style={[styles.messageGroup, { alignItems: "flex-start" }]}>
                <Pressable onPress={() => { console.log("helo") }}>
                    <Image style={styles.avatar} source={{ uri: message.sender.avatar }} />
                </Pressable>
                <View style={[{ alignItems: "flex-start", maxWidth: "80%" }]}>
                    {message.attachments.map((attachment: any) => {
                        return (
                            <Pressable
                                onPress={() => {
                                    console.log("attachment", attachment.url)
                                }}>
                                <Image
                                    source={{ uri: attachment.url }}
                                    style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 5 }} />
                            </Pressable>
                        )
                    })}
                </View>
            </View>
            : <Pressable
                onPress={() => {
                    onPress();
                }}
                style={styles.messageGroup}>
                <Pressable onPress={() => { console.log("helo") }}>
                    <Image style={styles.avatar} source={{ uri: message.sender.avatar }} />
                </Pressable>
                <View style={[{ alignItems: "flex-start", maxWidth: "80%" }]}>
                    <View style={[styles.message, {
                        backgroundColor: "#ffffff"
                    }]}>
                        <Text>{message.text}</Text>
                    </View>
                </View>
            </Pressable>

    )
}

const styles = StyleSheet.create({
    messageGroup: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 6,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    message: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
    },
});

export default ChatMessage