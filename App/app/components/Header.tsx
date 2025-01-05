import React, { useRef } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

type Option = {
    icon: JSX.Element;
};

type OptionProps = {
    listOption: Option[];
};

export default function Header(props: OptionProps) {
    const textInputRef = useRef(null);

    return (
        <LinearGradient
            colors={['#2b79fc', '#12bcfa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingLeft: 15, paddingRight: 5, paddingTop: 6, paddingBottom: 6 }}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.search} onPress={() => textInputRef.current && textInputRef.current.focus()}>
                    <Ionicons name="search-outline" color={'white'} size={24} />
                    <TextInput
                        ref={textInputRef}
                        style={styles.searchText}
                        placeholderTextColor="#8dc9f4"
                        placeholder="Tìm kiếm"></TextInput>
                </TouchableOpacity>
                {props.listOption.map((item, index) => {
                    return (
                        <TouchableOpacity style={styles.option} key={index}>
                            {item.icon}
                        </TouchableOpacity>
                    );
                })}
            </View>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    searchText: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
    },
    option: {
        paddingRight: 15,
        paddingLeft: 15,
    }
});
