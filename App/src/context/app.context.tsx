import { getAllConversationsByUserId } from "@/utils/api";
import { router, useFocusEffect } from "expo-router";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import io from "socket.io-client";

interface AppContextType {
    theme: string;
    setTheme: (v: string) => void;
    appState: IAccount | null;
    setAppState: (v: any) => void;
    conversations?: IConversations[];
    setConversations?: (v: IConversations[]) => void;
    socket?: any;
    setSocket?: (v: any) => void;
    messages?: IMessages[];
    setMessages?: (v: IMessages[]) => void;
}

const AppContext = createContext<AppContextType | null>(null)

interface IProps {
    children: React.ReactNode;
}

export const useCurrentApp = () => {
    const currentTheme = useContext(AppContext);
    if (!currentTheme) {
        throw new Error("useCurrentApp has to be used within <AppContext.Provider />");
    }
    return currentTheme;
}

const AppProvider = (props: IProps) => {
    const [theme, setTheme] = useState<string>("")
    const [appState, setAppState] = useState<IUserLogin | null>(null)
    const [conversations, setConversations] = useState<IConversations[]>([])
    const [socket, setSocket] = useState<any>(null)
    const [messages, setMessages] = useState<IMessages[]>([]);

    interface Message {
        _id: string;
        conversationId: string;
        senderId: string;
        receiverId: string
        text: string;
        createdAt: string;
        updatedAt: string;
    }

    useEffect(() => {
        if (socket && appState?.user?._id) {
            console.log('🔌 Setup socket listeners');

            socket.on('connect', () => {
                console.log(
                    '[Client] ✅ Socket connected successfully with id:',
                    socket.id,
                );
            });
            socket.on('disconnect', () => {
                console.log(
                    '[Client] ❌ Socket disconnected',
                );
            });
            socket.on('connect_error', (error: { message: any }) => {
                console.log(
                    '[Client] ❌ Connection error:', error.message,
                );
            });
            socket.emit('joinChat', { userId: appState?.user._id });

            socket.on('joinedChat', ({ userId, rooms }: { userId: string; rooms: string[] }) => {
                console.log(`[Client] Successfully joined chat for user ${userId}`);
                console.log('[Client] Current rooms:', rooms);
            });
            const handler = async (newMessage: Message) => {
                console.log('newMessage', newMessage)
                if (newMessage.senderId !== appState?.user._id) {
                    //@ts-ignore
                    if (conversations.some(item => item._id === newMessage.conversationId)) {
                        //@ts-ignore
                        setConversations((prevConversations: IConversations[]) => {
                            return prevConversations.map((conversation: IConversations) => {
                                if (conversation._id === newMessage.conversationId) {
                                    return {
                                        ...conversation,
                                        lastMessage: {
                                            _id: newMessage._id,
                                            sender: newMessage.senderId,
                                            text: newMessage.text,
                                            timestamp: newMessage.createdAt,
                                        },
                                    };
                                }
                                return conversation;
                            });
                        });
                    }
                    else {
                        const res = await getAllConversationsByUserId(appState?.user._id);
                        //@ts-ignore
                        setConversations(res);
                    }
                    console.log("messages", messages)

                }
            }
            socket.on("receiveMessage", handler);
            const createdGroup = async (group: any) => {
                if (group) {
                    await setConversations((prevConversations: IConversations[]) => {
                        return [group.group, ...prevConversations];
                    });
                }
            }
            socket.on("groupCreated", createdGroup);

            const addedGroup = async (group: any) => {
                console.log("group", appState.user.name, group)
            }
            socket.on("membersAdded", addedGroup);

            const deleteGroup = async (group: any) => {
                if (group.removedMembers.includes(appState?.user._id)) {
                    await setConversations((prevConversations: IConversations[]) => {
                        return prevConversations.filter((conversation: IConversations) => conversation._id !== group._id);
                    });
                }
            }
            socket.on("membersRemoved", deleteGroup);

            return () => {
                // socket.off("receiveMessage", handler);
                // socket.off("connect");
                // socket.off("disconnect");
                // socket.off("connect_error");
                // socket.off("joinedChat");
            };
        };
    }, [socket, appState]);

    return (
        <AppContext.Provider
            value={{
                theme, setTheme, appState, setAppState,
                conversations, setConversations, socket, setSocket,
                messages, setMessages
            }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppProvider