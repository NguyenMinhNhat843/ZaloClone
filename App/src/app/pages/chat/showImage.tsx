import ZoomableImage from '@/components/chat/zoomableImage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Text,
    Modal,
    Pressable,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AutoSizedImage = () => {
    const [height, setHeight] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { uri } = useLocalSearchParams();
    const imageUri = typeof uri === 'string' ? uri : uri?.[0] || '';

    useEffect(() => {
        if (!imageUri) {
            setLoading(false);
            return;
        }

        Image.getSize(
            imageUri,
            (width, height) => {
                const ratio = height / width;
                const computedHeight = screenWidth * ratio;
                setHeight(computedHeight);
                setLoading(false);
            },
            (err) => {
                console.error('❌ Lỗi khi lấy kích thước ảnh:', err);
                setLoading(false);
            }
        );
    }, [imageUri]);

    if (!imageUri) {
        return <Text>❗ Không có ảnh để hiển thị</Text>;
    }

    if (loading || !height) {
        return <ActivityIndicator />;
    }

    return (
        // <ZoomableImage uri={uri as string} />
        <>
            {/* Ảnh bình thường */}
            <Pressable onPress={() => setIsModalVisible(true)}>
                <Image
                    source={{ uri: imageUri }}
                    style={[styles.image, { width: screenWidth, height }]}
                    resizeMode="contain"
                />
            </Pressable>

            {/* Modal toàn màn hình */}
            <Modal visible={isModalVisible} transparent animationType="fade">
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setIsModalVisible(false)}
                >
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    image: {
        backgroundColor: '#000',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: screenWidth,
        height: screenHeight,
    },
});

export default AutoSizedImage;
