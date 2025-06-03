import React, { useRef } from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Link, router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

type Option = {
    icon: JSX.Element;
    onPress?: () => void;
};

interface IProps {
    listOption?: Option[];
    name?: string;
    back?: () => void;
};

const HeaderCustom = (props: IProps) => {
    const { listOption, name, back } = props;
    return (
        <LinearGradient
            colors={['#2b79fc', '#12bcfa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 20 }}>
                <Feather name="arrow-left" size={24} color="#f8fee9" style={{}}
                    onPress={() => {
                        back ? back() : router.back()
                    }} />
                <Text style={{ fontSize: 18, color: "#f6fef9", fontWeight: 500 }}>{name}</Text>
            </View>
            {listOption?.map((item, index) => {
                return (
                    <TouchableOpacity style={styles.option} key={index} onPress={item.onPress}>
                        {item.icon}
                    </TouchableOpacity>
                );
            })}

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 15,
        paddingRight: 5,
        paddingTop: 6,
        paddingBottom: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    option: {
        paddingRight: 15,
        paddingLeft: 15,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    }

});

export default HeaderCustom