import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import BouncyCheckbox from "react-native-bouncy-checkbox";

const SignUpPage = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Nhập số điện thoại</Text>
            <BouncyCheckbox
                size={25}
                fillColor="red"
                unFillColor="#FFFFFF"
                text="Tôi đồng ý với các điều khoản sử dụng Zalo"
                iconStyle={{ borderColor: "red" }}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{}}

                onPress={(isChecked: boolean) => { console.log(isChecked) }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
})

export default SignUpPage