import React from 'react';
import { Image, Modal, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import {
    GestureHandlerRootView,
    PinchGestureHandler,
    GestureDetector,
    Gesture,
} from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
    uri: string;
}

const ZoomableImage = ({ uri }: Props) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);
    const modalVisible = useSharedValue(false);
    const [visible, setVisible] = React.useState(false);

    const pinchGesture = Gesture.Pinch().onUpdate((e) => {
        scale.value = e.scale;
    });

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateY.value = e.translationY;
        })
        .onEnd(() => {
            if (Math.abs(translateY.value) > 120) {
                runOnJS(setVisible)(false);
                scale.value = 1;
                translateY.value = 0;
            } else {
                translateY.value = withSpring(0);
            }
        });

    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateY: translateY.value },
        ],
    }));

    const handleOpen = () => {
        setVisible(true);
        scale.value = withTiming(1);
        translateY.value = withTiming(0);
    };

    return (
        <GestureHandlerRootView>
            {/* Thumbnail ảnh */}
            <Pressable onPress={handleOpen}>
                <Image
                    source={{ uri }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                />
            </Pressable>

            {/* Modal full */}
            <Modal visible={visible} transparent animationType="fade">
                <GestureDetector gesture={composedGesture}>
                    <Pressable
                        onPress={() => setVisible(false)}
                        style={styles.backdrop}
                    >
                        <Animated.Image
                            source={{ uri }}
                            style={[styles.fullImage, animatedStyle]}
                            resizeMode="contain"
                        />
                    </Pressable>
                </GestureDetector>
            </Modal>
        </GestureHandlerRootView>
    );
};

export default ZoomableImage;

const styles = StyleSheet.create({
    thumbnail: {
        width: SCREEN_WIDTH * 0.6,
        height: SCREEN_WIDTH * 0.6,
        borderRadius: 10,
        marginVertical: 10,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
});
