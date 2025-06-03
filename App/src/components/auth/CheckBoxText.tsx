import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CheckBox from "react-native-check-box";

interface IProps {
    isChecked: boolean;
    setIsChecked: (value: boolean) => void;
    textPrimary: string;
    textSecondary: string;
}

const CheckBoxText = (props: IProps) => {
    const { isChecked, setIsChecked, textPrimary, textSecondary } = props;
    return (
        <View style={styles.container}>
            <CheckBox
                style={{ marginLeft: 15, height: 50, width: 50, }}
                onClick={() => {
                    console.log("click")
                    setIsChecked(!isChecked)
                }}
                isChecked={isChecked}
                checkedCheckBoxColor="#009eff"
                uncheckedCheckBoxColor="#c1d4e2"
            />
            <View style={styles.text}>
                <Text>{textPrimary}</Text>
                <Text>{textSecondary}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        flexDirection: "row",
        alignItems: "center",
    }
})

export default CheckBoxText;