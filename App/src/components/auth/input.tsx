import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface InputProps {
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
    value?: string | null;
    setValue?: (text: any) => void;
    autoFocus?: boolean;
    fullBorder?: boolean;
    icon?: React.ReactNode;
    onPress?: () => void;
    onPressIcon?: () => void;
    borderColor?: string;
    editable?: boolean;
}


const Input = (props: InputProps) => {
    const { placeholder, secureTextEntry, keyboardType, value,
        setValue, autoFocus = false, fullBorder = false,
        borderColor, icon, onPressIcon, editable = true, onPress
    } = props;
    const [onFocus, setOnFocus] = useState(false);

    return (
        <Pressable onPress={onPress} style={{ position: "relative" }}>
            <TextInput
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                editable={editable}
                autoFocus={autoFocus}
                style={{
                    borderColor: borderColor ? borderColor : fullBorder ? "#1765fc" : onFocus ? "#15d0fb" : "#dfdfdf",
                    borderBottomWidth: fullBorder ? 1 : onFocus ? 2 : 1,
                    borderWidth: fullBorder ? 1 : 0,
                    marginHorizontal: 15,
                    fontSize: 18,
                    marginTop: 10,
                    fontWeight: fullBorder ? "400" : "500",
                    padding: fullBorder ? 10 : 5,
                    borderRadius: fullBorder ? 7 : 0,
                }}
                onFocus={() => setOnFocus(true)}
                onBlur={() => setOnFocus(false)}
                cursorColor={"#2495ff"}
                value={value ? value : ""}
                onChangeText={setValue}
            />
            {icon && <View style={styles.icon} onTouchEnd={onPressIcon}>
                {icon}
            </View>}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    icon: {
        position: "absolute",
        top: "35%",
        right: 30,
    }
})

export default Input; 