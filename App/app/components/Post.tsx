import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { LinearGradient } from "expo-linear-gradient";


type OptionProps = {
    post: {
        id: number;
        name: string;
        avatar: any;
        time: string;
        content: string;
        isLike: boolean;
        like: number;
        comment: number;
        image: any[];
    };
};

export default function Post(props: OptionProps) {
    const [isLike, setIsLike] = useState(props.post.isLike);
    const [like, setLike] = useState(props.post.like);

    return (
        <View style={styles.container}>
            <View style={styles.user}>
                <View style={styles.info}>
                    <Image source={props.post.avatar} style={styles.avatar} />
                    <View style={styles.text}>
                        <Text style={styles.name}>{props.post.name}</Text>
                        <Text style={styles.time}>{props.post.time}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="dots-horizontal" size={24} color="#747474" />
                </TouchableOpacity>
            </View>
            <Text style={styles.content}>{props.post.content}</Text>
            <LinearGradient
                colors={['white', '#6a6767']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.background}>
                {props.post.image.map((item, index) => {
                    if (index % 2 === 0) {
                        return (
                            <View key={index} style={{ width: "48%" }}>
                                <Image key={index} source={item} style={styles.imageList} />
                            </View>
                        )
                    }
                    else {
                        return (
                            <View key={index} style={{ width: "48%", marginTop: 50 }}>
                                <Image key={index} source={item} style={[styles.imageList]} />
                            </View>
                        )
                    }
                })}
            </LinearGradient>
            <View style={styles.group}>
                <View style={styles.like}>
                    <TouchableOpacity
                        style={styles.likeFunc}
                        onPress={() => {
                            setIsLike(!isLike);
                            if (isLike) {
                                setLike(like - 1);
                            }
                            else {
                                setLike(like + 1);
                            }
                        }}>
                        <Ionicons name={isLike ? "heart-sharp" : "heart-outline"} size={24} color={isLike ? "red" : "#747474"} />
                        <Text style={{ marginLeft: 4, color: isLike === true ? "#6c0302" : "#4e4e4e" }}>Thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.likeNumber}>
                        <Ionicons name="heart-sharp" size={20} color="red" />
                        <Text style={styles.numberText}>{like}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.comment}>
                    <Ionicons name="chatbox-ellipses-outline" size={22} color="#747474" />
                    <Text style={styles.numberText}>{props.post.comment}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginTop: 10,
    },
    user: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    info: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        marginLeft: 10,
        justifyContent: "center",
    },
    name: {
        fontWeight: "bold",
    },
    time: {
        color: "#919294",
    },
    content: {
        paddingHorizontal: 20,
        fontSize: 16,
    },
    background: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignContent: "center",
        backgroundColor: "red",
        padding: 20,
        marginTop: 15,
    },
    imageList: {
        width: "100%",
        height: 200,
        borderRadius: 10,
    },
    group: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    like: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
        borderRadius: 50,
    },
    likeFunc: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        paddingLeft: 15,
    },
    likeNumber: {
        flexDirection: "row",
        marginLeft: 10,
        paddingLeft: 10,
        borderColor: "#e2e2e2",
        borderLeftWidth: 1,
        paddingVertical: 5,
        paddingRight: 15,
    },
    numberText: {
        marginLeft: 5,
        color: "#515151",
    },
    comment: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 50,
        marginLeft: 10,
    },
})