import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import Option from '../components/Option';
import Header from '../components/Header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
                <View style={styles.userGroup}>
                    <Image style={styles.userAvatar} source={require('../../assets/images/avatar3.png')} />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Bá Hậu</Text>
                        <Text style={styles.title}>Xem trang cá nhân</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="account-sync-outline" size={24} color="#4f8ee3" />
                </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.group}>
                <Option icon="color-wand-outline" name="zStyle - Nổi bật trên Zalo" title="Hình nền và nhạc cho cuộc gọi Zalo" option={false} />
                <Option icon="wallet-outline" name="Ví QR" title="Lưu trữ và xuất trình các mã QR quan trọng" option={false} />
                <Option icon="cloud-outline" name="Cloud của tôi" title="Lưu trữ các tin nhắn quan trọng" option={true} />
                <Option icon="cloud-upload-outline" name="zCloud" title="Không gian lưu trữ dữ liệu trên đám mây" option={true} />
            </View>
            <View style={styles.group}>
                <Option icon="pie-chart-outline" name="Dữ liệu trên máy" title="Quản lý dữ liệu Zalo của bạn" option={true} />
            </View>
            <View style={styles.group}>
                <Option icon="lock-closed-outline" name="Tài khoản và bảo mật" title="" option={true} />
                <Option icon="shield-checkmark-outline" name="Quyền riêng tư" title="" option={true} />
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