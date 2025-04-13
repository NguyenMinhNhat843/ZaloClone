import { useCurrentApp } from "@/context/app.context"
import { getAccountAPI, getAccountByIdAPI, getAllConversationsByUserId } from "@/utils/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Redirect, router, SplashScreen } from "expo-router"
import React, { useEffect } from "react"
import { Text, View } from "react-native"

const RootPage = () => {
    // if (true)
    //     return (
    //         <Redirect href={"/(auth)/welcome"} />
    //     )
    const { appState, setAppState, setConversations, socket } = useCurrentApp();

    const fetchConversations = async (userId: string) => {
        try {
            const res = await getAllConversationsByUserId(userId);
            console.log("res", res);

            if (res.length > 0 && res[0]._id) {
                const updatedConversations = await Promise.all(
                    res.map(async (conversation: any) => {
                        const participants = await Promise.all(
                            conversation.participants.map(async (participantId: string) => {
                                const user = await getAccountByIdAPI(participantId);
                                return {
                                    _id: user._id,
                                    name: user.name,
                                    avatar: user.avatar
                                };
                            })
                        );

                        return {
                            ...conversation,
                            participants
                        };
                    })
                );

                if (setConversations) {
                    setConversations(updatedConversations); // Cập nhật state
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
                const res = await getAccountAPI();

                if (res._id) {
                    setAppState({
                        user: res,
                    })
                    console.log("user: " + res)
                    fetchConversations(res._id)
                    socket.on('connect', () => {
                        console.log(
                            '[Client] ✅ Socket connected successfully with id:',
                            socket.id,
                        );
                    });
                    socket.emit('joinChat', { userId: appState?.user._id });
                    socket.on('joinedChat', ({ userId, rooms }: { userId: string; rooms: string[] }) => {
                        console.log(`[Client] Successfully joined chat for user ${userId}`);
                        console.log('[Client] Current rooms:', rooms);
                    });
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