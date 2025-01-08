import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type OptionProps = {
    post: {
        id: number;
        time: string;
        content: string;
        like: number;
        comment: number;
        image: any[];
    };
};

export default function Post(props: OptionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.time}>
                <Text style={styles.timeText}>{props.post.time}</Text>
            </View>
            <View style={styles.content}>
                <Text>{props.post.content}</Text>
                <View style={styles.imageList}>
                    {props.post.image.map((item, index) => {
                        return (
                            <Image key={index} style={styles.image} source={item} />
                        );
                    })}
                </View>
                <View style={styles.group}>
                    <View style={styles.interact}>
                        <TouchableOpacity style={styles.like}>
                            <FontAwesome name="heart-o" size={20} color="#575757" />
                            <Text style={styles.likeText}>Thích</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.comment}>
                            <MaterialCommunityIcons name="comment-processing-outline" size={22} color="#575757" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.option}>
                        <TouchableOpacity style={{ marginRight: 20 }}>
                            <Fontisto s name="locked" size={20} color="#8f8f8f" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Entypo name="dots-three-horizontal" size={20} color="#959595" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: "100%",
        paddingBottom: 0,
    },
    time: {
        backgroundColor: "#e0e3ea",
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        alignSelf: "flex-start",
        borderRadius: 5,
    },
    timeText: {
        color: "#232323",
        fontSize: 15,
        fontWeight: "500",
    },
    content: {
        backgroundColor: "#fff",
        marginTop: 10,
        padding: 15,
        borderRadius: 5,
        flex: 1
    },
    imageList: {
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "red",
        marginTop: 10,
        width: "100%",
    },
    image: {
        width: "33.33%",
        height: 100,
    },
    group: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 15,
    },
    interact: {
        flexDirection: 'row',
    },
    like: {
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
        padding: 10,
        borderRadius: 50,
    },
    likeText: {
        marginLeft: 5,
    },
    comment: {
        backgroundColor: '#f7f7f7',
        marginLeft: 10,
        padding: 10,
        borderRadius: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
