import React, { useState } from "react";
import { TextInput } from "react-native";

interface InputProps {
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
    value?: string;
    setValue?: (text: string) => void;
    autoFocus?: boolean;
}


const Input = (props: InputProps) => {
    const { placeholder, secureTextEntry, keyboardType, value,
        setValue, autoFocus = false
    } = props;
    const [onFocus, setOnFocus] = useState(false);

    return (
        <TextInput
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoFocus={autoFocus}
            style={{
                borderColor: onFocus ? "#15d0fb" : "#dfdfdf",
                borderBottomWidth: onFocus ? 2 : 1,
                marginHorizontal: 15,
                fontSize: 18,
                marginTop: 10,
                fontWeight: "500",
            }}
            onFocus={() => setOnFocus(true)}
            onBlur={() => setOnFocus(false)}
            cursorColor={"#2495ff"}
            value={value}
            onChangeText={setValue}
        />
    )
}

export default Input; 