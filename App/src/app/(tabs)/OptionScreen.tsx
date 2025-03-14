import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import Option from '../../components/Option';
import Header from '../../components/Header';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';

const listOption = [
    {
        icon: <Ionicons name="settings-outline" size={26} color="white" />
    },
]

export default function OptionScreen() {
    return (
        <View style={styles.container}>
            <Header listOption={listOption} />
            <TouchableOpacity style={styles.user}>
                <Link style={{ flex: 1, }} href="/pages/PersonalPage">
                    <View style={styles.userGroup}>
                        <Image style={styles.userAvatar} source={require('../../assets/images/avatar3.png')} />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>Bá Hậu</Text>
                            <Text style={styles.title}>Xem trang cá nhân</Text>
                        </View>
                    </View>
                </Link>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="account-sync-outline" size={24} color="#4f8ee3" />
                </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.group}>
                <Option icon={<Ionicons name="color-wand-outline" size={20} color="#5881d9" />} name="zStyle - Nổi bật trên Zalo" title="Hình nền và nhạc cho cuộc gọi Zalo" option={false} />
                <Option icon={<Ionicons name="wallet-outline" size={20} color="#5881d9" />} name="Ví QR" title="Lưu trữ và xuất trình các mã QR quan trọng" option={false} />
                <Option icon={<Ionicons name="cloud-outline" size={20} color="#5881d9" />} name="Cloud của tôi" title="Lưu trữ các tin nhắn quan trọng" option={true} />
                <Option icon={<Ionicons name="cloud-upload-outline" size={20} color="#5881d9" />} name="zCloud" title="Không gian lưu trữ dữ liệu trên đám mây" option={true} />
            </View>
            <View style={styles.group}>
                <Option icon={<Ionicons name="pie-chart-outline" size={24} color="#5881d9" />} name="Dữ liệu trên máy" title="Quản lý dữ liệu Zalo của bạn" option={true} />
            </View>
            <View style={styles.group}>
                <Option icon={<MaterialCommunityIcons name="shield-star-outline" size={24} color="#5881d9" />} name="Tài khoản và bảo mật" title="" option={true} />
                <Option icon={<AntDesign name="lock1" size={24} color="#5881d9" />} name="Quyền riêng tư" title="" option={true} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f3f8',
    },
    user: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
    },
    userGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userInfo: {
        marginLeft: 15,
    },
    userName: {
        fontSize: 16,
        fontWeight: '400',
        color: '#080808'
    },
    title: {
        fontSize: 14,
        color: '#6d6d6d',
    },
    group: {
        marginTop: 10,
    }
});