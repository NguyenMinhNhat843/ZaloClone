import { Text, View, StyleSheet } from 'react-native';
import React from "react";
import Header from '../components/Header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Option from '../components/Option';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const listOption = [
    {
        icon: <MaterialCommunityIcons name="qrcode-scan" size={24} color="#f1f2f4" />
    },
]

export default function ExploreScreen() {
    return (
        <View style={styles.container}>
            <Header listOption={listOption} />
            <View>
                <Option icon={<Ionicons name="logo-google-playstore" size={24} color="#f19e32" />} name="Zalo Video" title="" option={false} />
                <Option icon={<Ionicons name="game-controller-outline" size={24} color="#97d12f" />} name="Game Center" title="" option={true} />
            </View>
            <View style={styles.group}>
                <Option icon={<EvilIcons name="calendar" size={28} color="#db8d00" />} name="Dịch vụ đời sống" title="Nạp tiền điện thoại, Dò vé số, Lịch bóng đá, ..." option={true} />
                <Option icon={<MaterialCommunityIcons name="dots-grid" size={26} color="#f55f4a" />} name="Tiện ích tài chính" title="" option={false} />
                <Option icon={<FontAwesome6 name="school-flag" size={20} color="#4676fd" />} name="Dich vụ công" title="" option={false} />
            </View>
            <View style={styles.group}>
                <Option icon={<Feather name="layers" size={24} color="#0496f4" />} name="Mini App" title="" option={true} />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f3f8',
    },
    text: {
        color: 'black',
    },
    group: {
        marginTop: 10,
    }
});