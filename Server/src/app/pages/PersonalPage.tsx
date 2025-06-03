import { Text, View, StyleSheet, ImageBackground, Image, ScrollView, SafeAreaView, TouchableOpacity, FlatList, TextInput, Animated, Pressable } from 'react-native';
import React, { useRef, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { Link, router } from 'expo-router';
import Post from '../../components/MyPost';
import { useCurrentApp } from '@/context/app.context';

const functionList = [
    { id: 1, name: 'Cài zStyle', icon: <FontAwesome5 name="paint-brush" size={20} color="#3d83f6" /> },
    { id: 2, name: 'Ảnh của tôi', icon: <Entypo name="image-inverted" size={20} color="#066af3" /> },
    { id: 3, name: 'Kho khoảnh khắc', icon: <Entypo name="box" size={20} color="#16aee0" /> },
    { id: 4, name: 'Kỷ niệm năm xưa', icon: <Entypo name="back-in-time" size={20} color="#df6500" /> },
    { id: 5, name: 'Video của tôi', icon: <FontAwesome name="video-camera" size={20} color="#2cb766" /> }
];

export default function PersonalScreen() {
    const user = useCurrentApp().appState?.user;

    const scrollY = useRef(new Animated.Value(0)).current;

    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 250 - 90], // Adjust the range as needed
        outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
        extrapolate: 'clamp',
    });

    const iconColor = scrollY.interpolate({
        inputRange: [0, 250 - 90], // Adjust the range as needed
        outputRange: ['#fff', '#454545'],
        extrapolate: 'clamp',
    });

    const animatedIconStyle = {
        color: iconColor,
    };

    const userOpacity = scrollY.interpolate({
        inputRange: [0, 250 - 90], // Adjust the range as needed
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const [postList, setPostList] = useState([
        {
            id: 1,
            time: '8 tháng 1',
            content: 'Hello, mình là Bá Hậu',
            isLike: true,
            like: 10,
            comment: 5,
            image: [
                require('../../assets/images/post/1.jpg'),
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg')
            ]
        },
        {
            id: 2,
            time: '21 tháng 12',
            content: 'Chúc mừng sinh nhật bạn',
            isLike: false,
            like: 15,
            comment: 3,
            image: [
                require('../../assets/images/post/1.jpg'),
                require('../../assets/images/post/background.jpg'),
                require('../../assets/images/post/background.jpg'),

            ]
        },
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
                <View style={styles.group}>
                    <TouchableOpacity style={styles.backButton}>
                        <Link href="/OptionScreen">
                            <Animated.Text style={animatedIconStyle}>
                                <Ionicons name="arrow-back-outline" size={20} />
                            </Animated.Text>
                        </Link>
                    </TouchableOpacity>
                    <Animated.Image style={[styles.avatar, { opacity: userOpacity }]} source={{ uri: user.avatar }} />
                    <Animated.Text style={[styles.name, { opacity: userOpacity }]}>Bá Hậu</Animated.Text>
                </View>
                <View style={styles.option}>
                    <Animated.Text style={[animatedIconStyle,]}>
                        <MaterialIcons name="disabled-visible" size={22} />
                    </Animated.Text>
                    <Pressable
                        style={{ alignItems: "center", justifyContent: "center", height: 50, width: 50 }}
                        onPress={() => router.push("/pages/profile/profilePage")}>
                        <Animated.Text style={[animatedIconStyle,]}>
                            <SimpleLineIcons name="options" size={22} />
                        </Animated.Text>
                    </Pressable>
                </View>
            </Animated.View>

            <Animated.ScrollView style={styles.page}
                contentContainerStyle={{ alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}>
                <ImageBackground style={styles.backgroundImg} source={require('../../assets/images/background.jpg')} >
                    <Image style={styles.primaryAvatar} source={{ uri: user.avatar }}></Image>
                </ImageBackground>
                <Text style={styles.primaryName}>{user.name}</Text>
                <TouchableOpacity style={styles.group}>
                    <AntDesign name="edit" size={20} color="#2369ec" />
                    <Text style={styles.editText}>Cập nhật giới thiệu bản thân</Text>
                </TouchableOpacity>
                <FlatList
                    data={functionList}
                    keyExtractor={item => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginRight: 10, marginTop: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.groupFunction}>
                            {item.icon}
                            <Text style={styles.functionName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
                <View style={styles.post}>
                    <TextInput style={styles.textInput} placeholder='Bạn đang nghĩ gì?' />
                    <View style={styles.iconPost}>
                        <Entypo name="image-inverted" size={24} color="#87c33f" />
                    </View>
                </View>
                {postList.map((item, index) => {
                    return (
                        <Post key={index} post={item} />
                    );
                })}
                <View style={{ height: 100 }}></View>
            </Animated.ScrollView>
        </SafeAreaView >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f1f7',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 10,
        position: 'absolute',
        top: 0,
        zIndex: 1
    },
    group: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 10,
        paddingLeft: 0,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginLeft: 15,
        marginRight: 15
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    page: {
        flex: 1,
        width: '100%',
    },
    backgroundImg: {
        width: '100%',
        height: 250,
        alignItems: 'center',
        backgroundColor: 'red',
    },
    primaryAvatar: {
        width: 140,
        height: 140,
        borderRadius: 75,
        position: 'absolute',
        top: 250 - 70,
        borderWidth: 5,
        borderColor: '#f4f5f5'
    },
    primaryName: {
        marginTop: 80,
        marginBottom: 20,
        fontSize: 20,
        fontWeight: '500',
    },
    editText: {
        color: '#2369ec',
        marginLeft: 10
    },
    groupFunction: {
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 16,
        paddingRight: 18,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        flexDirection: 'row'
    },
    functionName: {
        color: '#101010',
        marginLeft: 10,
        fontSize: 14
    },
    post: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 20,
    },
    textInput: {
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 5,
        height: 50,
        paddingLeft: 15,
    },
    iconPost: {
        position: 'absolute',
        right: 25,
        height: 34,
        width: 50,
        borderLeftWidth: 1,
        borderLeftColor: '#e2e2e2',
        justifyContent: 'center',
        alignItems: 'center',
    }
});