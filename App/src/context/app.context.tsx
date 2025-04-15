import React, { createContext, useContext, useEffect, useState } from "react";
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


    useEffect(() => {
        if (!socket) {
            const backend = Platform.OS === "android"
                ? process.env.EXPO_PUBLIC_ANDROID_API_URL as string
                : process.env.EXPO_PUBLIC_IOS_API_URL as string;
            console.log(backend)
            const socketIo = io(backend, {
                transports: ['websocket'],
                reconnection: false,
            });
            setSocket(socketIo);
            return () => {
                // Ngắt kết nối socket khi component bị unmount
                socketIo.disconnect();
            };
        }
    }, [])

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