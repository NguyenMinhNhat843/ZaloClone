import React, { useRef, useState, forwardRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

interface IProps {
    uri: string;
    onLongPress: () => void;
    onPress?: () => void;
    time: string;
}

// 👇 forwardRef để nhận ref đúng cách
const VideoPlayer = forwardRef<View, IProps>(({ uri, onLongPress, onPress, time }, ref) => {
    const videoRef = useRef<Video>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <Pressable
            key={uri}
            onLongPress={onLongPress} ref={ref} style={styles.container}
            onPress={async () => {
                if (!videoRef.current) return;
                const status = await videoRef.current.getStatusAsync();
                // @ts-ignore
                if (status.isPlaying) {
                    await videoRef.current.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await videoRef.current.playAsync();
                    setIsPlaying(true);
                }
            }}
        >
            <Video
                ref={videoRef}
                source={{ uri }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls={true}
                onLoadStart={() => setIsLoading(true)}
                onReadyForDisplay={() => setIsLoading(false)}
                isLooping={false}
            />
            {isLoading && (
                <ActivityIndicator style={styles.loading} color="#999" />
            )}
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '80%',
        aspectRatio: 1,
        backgroundColor: '#000',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loading: {
        position: 'absolute',
        top: '45%',
        alignSelf: 'center',
    },
});

export default VideoPlayer;
