import React, { useEffect, useRef, useState, forwardRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Audio } from 'expo-av';

interface IProps {
    uri: string;
    onLongPress: () => void;
    onPress?: () => void;
    time: string;
}

// 👇 Bọc bằng forwardRef
const AudioRender = forwardRef<any, IProps>(({ uri, onLongPress, onPress, time }, ref) => {
    const soundRef = useRef<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [positionMillis, setPositionMillis] = useState(0);
    const [durationMillis, setDurationMillis] = useState(0);

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const loadAndPlay = async () => {
        const { sound, status } = await Audio.Sound.createAsync(
            { uri },
            {},
            onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        await sound.setIsLoopingAsync(false);
        await sound.playAsync();
        setIsPlaying(true);
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (!status.isLoaded) return;

        setPositionMillis(status.positionMillis);
        setDurationMillis(status.durationMillis || 0);

        if (status.didJustFinish) {
            setIsPlaying(false);
            soundRef.current?.setPositionAsync(0);
        } else {
            setIsPlaying(status.isPlaying);
        }
    };

    const togglePlayback = async () => {
        if (!soundRef.current) {
            await loadAndPlay();
        } else {
            const status = await soundRef.current.getStatusAsync();
            // @ts-ignore
            if (status.isPlaying) {
                await soundRef.current.pauseAsync();
            } else {
                await soundRef.current.playAsync();
            }
        }
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <Pressable key={uri} onLongPress={onLongPress} ref={ref} style={styles.container}>
            <View style={{
                backgroundColor: '#d4f1ff',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                borderRadius: 10,
                padding: 10,
            }}>
                <Pressable onPress={togglePlayback} style={styles.button}>
                    <Text style={styles.icon}>{isPlaying ? '⏸️' : '▶️'}</Text>
                </Pressable>
                <Text style={styles.time}>
                    {formatTime(positionMillis)} / {formatTime(durationMillis)}
                </Text>
            </View>
            <Text style={{ fontSize: 12, color: "#959b9f", }}>{time}</Text>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        gap: 5,
    },
    button: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 999,
        elevation: 2,
    },
    icon: {
        fontSize: 18,
    },
    time: {
        fontSize: 14,
        color: '#555',
    },
});

export default AudioRender;