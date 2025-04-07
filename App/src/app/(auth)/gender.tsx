import { useInfo } from "@/context/InfoContext"
import { APP_COLOR } from "@/utils/constant"
import { router } from "expo-router"
import React from "react"
import { Pressable, StyleSheet, Text } from "react-native"
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated"


const Gender = () => {
    const { setGender } = useInfo();

    const press = (value: string) => {
        setGender(value)
        router.back()
    }
    return (
        <Animated.View
            entering={FadeIn}
            style={{
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "rgba(0, 0, 0, 0.5)",

            }}
        >
            <Pressable
                onPress={() => router.back()}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View
                entering={SlideInDown}
                style={{
                    width: "100%",
                    height: "auto",
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    gap: 10,
                }}
            >
                <Text style={styles.title}>Chọn giới tính</Text>
                <Pressable
                    onPress={() => {
                        press("male")
                    }}
                    style={styles.item}>
                    <Text style={styles.itemText}>Nam</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        press("female")
                    }}
                    style={styles.item}>
                    <Text style={styles.itemText}>Nữ</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        press("private")
                    }}
                    style={styles.item}>
                    <Text style={styles.itemText}>Không chia sẻ</Text>
                </Pressable>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "400",
        marginTop: 30,
        textAlign: "center",
    },
    item: {
        marginHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: APP_COLOR.GREY,
    },
    itemText: {
        fontSize: 16,
        paddingVertical: 15,
        paddingHorizontal: 10,
    }
})

export default Gender