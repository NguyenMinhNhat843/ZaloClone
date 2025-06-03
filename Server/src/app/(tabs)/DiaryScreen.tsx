import { Text, View, StyleSheet, Image, TouchableOpacity, ImageBackground, Animated, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from "react";
import Header from '../../components/Header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { FlatList } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Fontisto from '@expo/vector-icons/Fontisto';
import Post from '../../components/Post';
import { useCurrentApp } from '@/context/app.context';

const listOption = [
    {
        icon: <MaterialCommunityIcons name="image-plus" size={24} color="white" />
    },
    {
        icon: <Feather name="bell" size={24} color="white" />
    },
]

const functionList = [
    { id: 1, name: 'Ảnh', icon: <Entypo name="image-inverted" size={18} color="#4dc775" /> },
    { id: 2, name: 'Video', icon: <FontAwesome name="video-camera" size={18} color="#e02dbd" /> },
    { id: 3, name: 'Album', icon: <MaterialCommunityIcons name="notebook" size={18} color="#3779ee" /> },
    { id: 4, name: 'Kỷ niệm', icon: <Entypo name="back-in-time" size={18} color="#e5761e" /> },
];

const momentList = [
    { id: 2, img: require("../../assets/images/post/1.jpg"), avatar: require("../../assets/images/avatar3.png"), name: "Trần Văn A" },
    { id: 3, img: require("../../assets/images/post/background.jpg"), avatar: require("../../assets/images/avatar3.png"), name: "Trần Thị B" },
    { id: 4, img: require("../../assets/images/post/background.jpg"), avatar: require("../../assets/images/avatar3.png"), name: "Lê Văn C" },
    { id: 5, img: require("../../assets/images/avatar3.png"), avatar: require("../../assets/images/avatar3.png"), name: "Trần Thị B" },
    { id: 6, img: require("../../assets/images/avatar3.png"), avatar: require("../../assets/images/avatar3.png"), name: "Trần Thị B" },
    { id: 7, img: require("../../assets/images/avatar3.png"), avatar: require("../../assets/images/avatar3.png"), name: "Trần Thị B" },
    { id: 8, img: require("../../assets/images/avatar3.png"), avatar: require("../../assets/images/avatar3.png"), name: "Trần Thị B" },
    { id: 9, img: require("../../assets/images/avatar3.png"), avatar: require("../../assets/images/avatar3.png"), name: "Trần Thị B" },
    { id: 10, img: require("../../assets/images/avatar3.png"), avatar: require("../../assets/images/avatar3.png"), name: "Trần Thị B" },
];

export default function DiaryScreen() {
    const user = useCurrentApp().appState?.user;

    const [currentIndex, setCurrentIndex] = useState(0);
    const scaleValue = useRef(new Animated.Value(0)).current;

    const listIcon = [
        <MaterialCommunityIcons name="pencil" size={16} color="white" />,
        <Fontisto name="camera" size={12} color="white" />,
        <Ionicons name="videocam" size={16} color="white" />,
    ];

    const [postList, setPostList] = useState([
        {
            id: 1,
            name: 'Trần Văn Cường',
            avatar: require('../../assets/images/post/background.jpg'),
            time: '8 tháng 1',
            content: 'Hello, mình là Bá Hậu',
            isLike: true,
            like: 10,
            comment: 5,
            image: [
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),
            ]
        },
        {
            id: 2,
            name: 'Lê Văn A',
            avatar: require('../../assets/images/post/background.jpg'),
            time: '21 tháng 12',
            content: 'Trời đẹp quá',
            isLike: false,
            like: 15,
            comment: 3,
            image: [
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),
            ]
        },
        {
            id: 3,
            name: 'Nguyễn Văn B',
            avatar: require('../../assets/images/post/background.jpg'),
            time: '11 tháng 1',
            content: 'Phong cảnh đẹp quá',
            isLike: false,
            like: 13,
            comment: 7,
            image: [
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),
            ]
        },
    ])


    useEffect(() => {
        const loopAnimation = Animated.loop(
            Animated.sequence([
                Animated.spring(scaleValue, {
                    toValue: 1,
                    friction: 2,
                    useNativeDriver: true,
                }),
            ])
        );

        loopAnimation.start();

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % listIcon.length);
        }, 2000);

        return () => {
            loopAnimation.stop();
            clearInterval(timer);
        };
    }, [scaleValue, listIcon.length]);

    return (
        <View style={styles.container}>
            <Header listOption={listOption} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.post}>
                    <TouchableOpacity style={styles.user}>
                        <Image style={styles.avatar} source={{ uri: user.avatar }} />
                        <Text style={styles.text}>Hôm nay bạn thấy thế nào?</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={functionList}
                        keyExtractor={item => item.id.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.functionList}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.groupFunction}>
                                {item.icon}
                                <Text style={styles.functionName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={styles.moment}>
                    <Text style={styles.momentText}>Khoảnh khắc</Text>
                    <FlatList
                        data={momentList}
                        keyExtractor={item => item.id.toString()}
                        ListHeaderComponent={(
                            <ImageBackground style={styles.momentImg} source={{ uri: user.avatar }}>
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.5)', 'transparent']}
                                    style={styles.topGradient}
                                />
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.5)', 'transparent']}
                                    style={styles.bottomGradient}
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.5)']}
                                    style={styles.leftGradient}
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.5)']}
                                    style={styles.rightGradient}
                                />
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: "center", padding: 10 }}>
                                    <LinearGradient
                                        colors={['#2198fd', '#3888ff', '#a16bff']}
                                        style={styles.createIcon}>
                                        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                                            {listIcon[currentIndex]}
                                        </Animated.View>
                                    </LinearGradient>
                                    <Text style={styles.momentName}>Tạo mới</Text>
                                </View>
                            </ImageBackground>
                        )}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <ImageBackground style={styles.momentImg} source={item.img}>
                                    <LinearGradient
                                        colors={['rgba(0,0,0,0.5)', 'transparent']}
                                        style={styles.topGradient}
                                    />
                                    <LinearGradient
                                        colors={['rgba(0,0,0,0.5)', 'transparent']}
                                        style={styles.bottomGradient}
                                    />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                                        style={styles.leftGradient}
                                    />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                                        style={styles.rightGradient}
                                    />
                                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', padding: 10 }}>
                                        <View
                                            // colors={['#2198fd', '#3888ff', '#a16bff']}
                                            style={styles.createIcon}>
                                            <Image style={styles.momentAvatar} source={item.avatar} />
                                        </View>
                                        <Text style={styles.momentName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                                    </View>
                                </ImageBackground>
                            )
                        }
                        }
                    />
                </View>
                {postList.map((item, index) => {
                    return (
                        <Post key={index} post={item} />
                    );
                })}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f3f8',
    },
    post: {
        padding: 15,
        backgroundColor: 'white',
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    text: {
        color: '#7a797e',
        marginLeft: 10,
        fontSize: 16,
    },
    functionList: {
        marginTop: 20,
    },
    groupFunction: {
        padding: 10,
        backgroundColor: '#f7f7f7',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 10,
    },
    functionName: {
        color: '#101010',
        marginLeft: 6,
        fontSize: 14
    },
    moment: {
        padding: 15,
        marginTop: 10,
        backgroundColor: 'white',
    },
    momentText: {
        color: '#262626',
        fontSize: 14,
        fontWeight: 500
    },
    momentImg: {
        width: 80,
        height: 140,
        borderRadius: 10,
        marginTop: 10,
        marginRight: 10,
        overflow: 'hidden',
    },
    createIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#9f9fa1',
        borderWidth: 3,
    },
    momentAvatar: {
        width: 30,
        height: 30,
        borderRadius: 30,
        padding: 6
    },
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 40,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    leftGradient: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 40,
    },
    rightGradient: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: 40,
    },
    momentName: {
        marginTop: 2,
        textAlign: 'center',
        color: 'white',
        fontSize: 12,
    }
});