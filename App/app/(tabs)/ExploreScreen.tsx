import { Text, View, StyleSheet } from 'react-native';
import React from "react";
import Header from '../components/Header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const listOption = [
    {
        icon: <MaterialCommunityIcons name="image-plus" size={24} color="white" />
    },
]

export default function ExploreScreen() {
    return (
        <View style={styles.container}>
            <Header listOption={listOption} />
            <Text style={styles.text}>Explore screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f3f8',
    },
    text: {
        color: '#fff',
    },
});