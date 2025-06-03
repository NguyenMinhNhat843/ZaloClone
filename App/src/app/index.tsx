import { useCurrentApp } from "@/context/app.context"
import { getAccountAPI, getAccountByIdAPI, getAllConversationsByUserId } from "@/utils/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Redirect, router, SplashScreen } from "expo-router"
import React, { useEffect } from "react"
import { Platform, Text, View } from "react-native"
import io from "socket.io-client"

const RootPage = () => {
    const { setAppState, setConversations, socket, setSocket } = useCurrentApp();

    const connectSocket = (access_token: string) => {
        if (!socket) {
            console.log(socket)
            const backend = Platform.OS === "android"
                ? process.env.EXPO_PUBLIC_ANDROID_API_URL as string
                : process.env.EXPO_PUBLIC_IOS_API_URL as string;
            console.log(backend)
            const socketIo = io(backend, {
                auth: {
                    token: access_token,
                },
            });
            // @ts-ignore
            setSocket(socketIo);

            return () => {
                // Ngắt kết nối socket khi component bị unmount
                socket.disconnect();
            };

        }
    }

    const fetchConversations = async (userId: string) => {
        try {
            const res = await getAllConversationsByUserId(userId);
            console.log("res", res);

            if (res.length > 0 && res[0]._id) {

                if (setConversations) {
                    setConversations(res); // Cập nhật state
                }
            }

        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    useEffect(() => {
        async function prepare() {
            try {
                // await AsyncStorage.removeItem("access_token")
                const access_token = await AsyncStorage.getItem("access_token")
                const res = await getAccountAPI();

                if (res._id) {
                    setAppState({
                        user: res,
                    })
                    console.log("user: " + JSON.stringify(res))
                    fetchConversations(res._id)
                    //@ts-ignore
                    connectSocket(access_token);
                    router.navigate("/(tabs)/ChatScreen")
                } else {
                    router.navigate("/(auth)/welcome")
                }
            } catch (e) {
                console.warn(e);
                router.navigate("/(auth)/welcome")
            }
            // finally {
            //     // Tell the application to render
            //     await SplashScreen.hideAsync();
            // }
        }

        prepare();
    }, []);

    return (
        <>
        </>
    )
}

export default RootPage