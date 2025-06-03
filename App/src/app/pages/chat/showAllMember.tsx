import Option from "@/components/Option";
import { useCurrentApp } from "@/context/app.context";
import { useInfo } from "@/context/InfoContext";
import { getAllMembersByConversationId } from "@/utils/api";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const ShowAllMember = () => {
    const { conversationsId } = useLocalSearchParams();
    const { members } = useInfo();
    const user = useCurrentApp().appState?.user

    return (
        <View>
            <Option
                title=""
                icon={
                    <AntDesign
                        style={{ padding: 10, backgroundColor: "#f5f4fa", borderRadius: 50 }}
                        name="addusergroup" size={24} color="#222123" />
                }
                onPress={() => { }}
                name="Thêm thành viên"
                option={false}
            />
            <View style={{ height: 20 }}></View>
            <View style={styles.member}>
                <Text style={{ color: "#0079bf", paddingLeft: 15, marginTop: 20 }}>Thành viên ({members.length})</Text>
                <FlatList
                    data={members}
                    renderItem={({ item }) => {
                        return item.role === "admin" ? (
                            <Option
                                title="Trưởng nhóm"
                                icon={
                                    <View>
                                        <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.userId.avatar }} />
                                        <SimpleLineIcons style={{ padding: 3, borderRadius: 30, backgroundColor: "#7e828b", position: "absolute", bottom: 0, right: 0 }} name="key" size={12} color="#e2db5b" />
                                    </View>
                                }
                                onPress={() => {
                                    item.userId._id === user._id
                                        ? router.push("/pages/PersonalPage")
                                        : router.push({
                                            pathname: '/pages/chat/memberOptionModal',
                                            params: {
                                                conversationsId: conversationsId,
                                                memberId: item.userId._id,
                                                memberName: item.userId.name,
                                                memberAvatar: item.userId.avatar,
                                                myRole: members.find((item) => item.userId._id === user._id)?.role,
                                            }
                                        })
                                }}
                                name={item.userId._id === user._id ? "Bạn" : item.userId.name}
                                option={false}
                            />
                        ) : (
                            <Option
                                title="Thành viên"
                                icon={
                                    <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.userId.avatar }} />
                                }
                                onPress={() => {
                                    item.userId._id === user._id
                                        ? router.push("/pages/PersonalPage")
                                        : router.push({
                                            pathname: '/pages/chat/memberOptionModal',
                                            params: {
                                                conversationsId: conversationsId,
                                                memberId: item.userId._id,
                                                memberName: item.userId.name,
                                                memberAvatar: item.userId.avatar,
                                                myRole: members.find((item) => item.userId._id === user._id)?.role,
                                            }
                                        })
                                }}
                                name={item.userId._id === user._id ? "Bạn" : item.userId.name}
                                option={false}
                            />
                        );
                    }}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 20,
    },
    member: {
        backgroundColor: "#fff",
    }
})

export default ShowAllMember;