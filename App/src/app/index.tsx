import { Redirect } from "expo-router"
import React from "react"
import { Text, View } from "react-native"

const RootPage = () => {
    if (true)
        return (
            <Redirect href={"/(auth)/welcome"} />
        )

    return (
        <View>
            <Text>
                Hello
            </Text>
        </View>
    )
}

export default RootPage