import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const Loading = () => {
    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <ActivityIndicator size="large" />
                <Text>Đang xử lý ...</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    background: {
        backgroundColor: "#fff",
        borderRadius: 20,
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: 20,
    }
})

export default Loading;