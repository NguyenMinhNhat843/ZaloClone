import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IProps {
    text: string,
    backGroundColor: string,
    color: string,
    onPress?: () => void
}

const AppButton = (props: IProps) => {
    const { text, backGroundColor, color, onPress } = props;
    return (
        <View style={[styles.container]}>
            <TouchableOpacity
                onPress={onPress}
                style={[styles.button, { backgroundColor: backGroundColor }]}>
                <Text style={[styles.buttonText, { color: color }]}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default AppButton;