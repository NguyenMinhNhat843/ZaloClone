import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface IProps {
    text: string,
    backGroundColor: string,
    color: string,
    disabled?: boolean,
    onPress?: () => void,
    style?: ViewStyle,
    icon?: JSX.Element,
}

const AppButton = (props: IProps) => {
    const { text, backGroundColor, color, onPress, disabled, style, icon } = props;
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                disabled={disabled}
                onPress={onPress}
                style={[styles.button, { backgroundColor: backGroundColor }]}>
                {icon && icon}
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
        borderRadius: 50,
        flexDirection: 'row',
        gap: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default AppButton;