import Fontisto from "@expo/vector-icons/Fontisto";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ChatRecord = () => {
    return (
        <View style={styles.container}>
            <Text>Bấm hoặc bấm giữ để ghi âm</Text>
            <Pressable style={styles.recordButton}>
                <Fontisto name="mic" size={22} color="#fff" />
            </Pressable>
            <View style={styles.typeRecord}>
                <Pressable style={styles.typeButton}>
                    <Text style={styles.typeButtonText}>Gửi bản ghi âm</Text>
                </Pressable>
                <Pressable style={styles.typeButton}>
                    <Text style={styles.typeButtonText}>Gửi dạng văn bản</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    recordButton: {
        backgroundColor: '#1068fe',
        padding: 10,
        borderRadius: 50,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeRecord: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: "#f2f2f2",
        padding: 4,
        borderRadius: 50,
    },
    typeButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeButtonText: {
        color: '#080808',
        fontWeight: '500',
        fontSize: 14,
    },
})

export default ChatRecord;