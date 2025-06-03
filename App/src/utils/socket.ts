import { Platform } from 'react-native';
import io, { Socket } from 'socket.io-client';

const backend = Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_ANDROID_API_URL as string
    : process.env.EXPO_PUBLIC_IOS_API_URL as string;

const socket = io(backend, {
    transports: ['websocket'],
    reconnection: false,
});

export const connectSocket = () => {
    socket.on('connect', () => {
        console.log(
            '[Client] ✅ Socket connected successfully with id:',
            socket.id,
        );
    });
}

export const joinChat = (id: string) => {
    console.log({ userId: id });
    socket.emit('joinChat', { userId: id });
}

export default socket;
