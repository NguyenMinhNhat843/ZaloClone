import { getAccountByPhoneAPI } from "@/utils/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const PeopleProfile = () => {
    const { phone } = useLocalSearchParams();
    const [user, setUser] = useState<IAccount | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getAccountByPhoneAPI(phone as string);
                if (response._id) {
                    setUser(response);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [])
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: user?.avatar }}
                style={{ width: 150, height: 150, borderRadius: 100, borderWidth: 4, borderColor: "#f2f2f2" }}
            />
            <Text style={styles.name}>{user?.name}</Text>
            <View style={styles.buttonGroup}>
                <Pressable style={styles.button} onPress={() => router.push({
                    pathname: '/pages/chatRoom',
                    params: {
                        conversationsId: user?._id,
                        receiverId: user?._id
                    }
                })}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1e78e8" />
                    <Text style={styles.buttonText}>Nhắn tin</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#f2f1f7",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: "hidden",
    },
    name: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: "bold",
    },
    buttonGroup: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        paddingHorizontal: 20,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#dcebff",
        padding: 10,
        borderRadius: 50,
        flex: 1,
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#0261fe"
    },
})

export default PeopleProfile;