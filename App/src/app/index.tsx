import { useCurrentApp } from "@/context/app.context"
import { getAccountAPI } from "@/utils/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Redirect, router, SplashScreen } from "expo-router"
import React, { useEffect } from "react"
import { Text, View } from "react-native"

const RootPage = () => {
    // if (true)
    //     return (
    //         <Redirect href={"/(auth)/welcome"} />
    //     )
    const { setAppState } = useCurrentApp();

    useEffect(() => {
        async function prepare() {
            try {
                // await AsyncStorage.removeItem("access_token")
                const res = await getAccountAPI();

                if (res._id) {
                    setAppState({
                        user: res,
                    })
                    console.log(res)
                    router.navigate("/(tabs)")
                } else {
                    router.navigate("/(auth)/welcome")
                }
            } catch (e) {
                console.warn(e);
                router.navigate("/(auth)/welcome")
            }
            // finally {
            //     // Tell the application to render
            //     await SplashScreen.hideAsync();
            // }
        }

        prepare();
    }, []);

    return (
        <>
        </>
    )
}

export default RootPage