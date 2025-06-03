import React, { useRef } from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Link } from "expo-router";

type Option = {
    icon: JSX.Element;
    onPress?: () => void;
};

interface IProps {
    listOption?: Option[];
};

export default function Header(props: IProps) {
    const textInputRef = useRef<TextInput>(null);
    const { listOption } = props;
    return (
        <LinearGradient
            colors={['#2b79fc', '#12bcfa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}>
            <TouchableOpacity style={styles.search} onPress={() => textInputRef.current && textInputRef.current.focus()}>
                <Link href="/pages/PersonalPage">
                    <View style={styles.searchItem}>
                        <Ionicons name="search-outline" color={'white'} size={24} />
                        <TextInput
                            ref={textInputRef}
                            style={styles.searchText}
                            placeholderTextColor="#8dc9f4"
                            placeholder="Tìm kiếm"
                            editable={false}
                        />
                    </View>

                </Link>
            </TouchableOpacity>
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

    search: {
        flex: 1,
        justifyContent: "center",
    },

    searchItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 15,
    },

    searchText: {
        flex: 1,
        fontSize: 16,
    },

    option: {
        paddingRight: 15,
        paddingLeft: 15,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    }

});
