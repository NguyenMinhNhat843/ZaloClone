import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

type OptionProps = {
    icon: React.ReactNode,
    name: string;
    title: string;
    option: boolean;
    onPress?: () => void;
    danger?: boolean;
    secondaryName?: string;
    style?: ViewStyle;
};
export default function Option(props: OptionProps) {
    const { icon, name, title, option, onPress, danger = false, secondaryName, style } = props;
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={onPress} style={styles.option}>
                <View style={styles.group}>
                    {icon}
                    <View style={styles.info}>
                        <Text style={[styles.name, { color: danger ? "#f64b52" : "#080808" }]}>
                            {name}
                            {secondaryName && <Text style={{ color: "#869190", fontSize: 14 }}> ({secondaryName})</Text>}
                        </Text>
                        {title === "" ? <></> : <Text style={styles.title}>{title}</Text>}
                    </View>
                </View>
                {option && <Ionicons name="chevron-forward-outline" color={'#808080'} size={16} />}
            </TouchableOpacity>
            <View style={styles.line}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    line: {
        borderColor: '#f4f3f8',
        borderBottomWidth: 1,
        marginLeft: 65
    },
    group: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        justifyContent: 'space-between',

    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    info: {
        marginLeft: 20,
    },
    name: {
        fontSize: 16,
        fontWeight: '400',
        color: '#080808',
    },
    title: {
        fontSize: 14,
        color: '#6d6d6d',
    },
});