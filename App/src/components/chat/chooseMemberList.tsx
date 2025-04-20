import { timeStamToDate } from "@/utils/formatDataFile";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CheckBox from "react-native-check-box";

interface IProps {
    friendList: IAccount[];
    member: IMember[];
    setMember: React.Dispatch<React.SetStateAction<IMember[]>>;
    handleAddToGroup: () => void;
}

interface IMember {
    id: string,
    name: string,
    avatar: string
}

const ChooseMemberList = (props: IProps) => {
    const { friendList, member, setMember, handleAddToGroup } = props;

    return (
        <>
            <FlatList
                data={friendList}
                keyExtractor={(item) => item._id || ""}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setMember((prev) => {
                                if (prev.some((member) => member.id === item._id)) {
                                    return prev.filter((member) => member.id !== item._id)
                                } else if (item._id && item.name && item.avatar) {
                                    return [...prev, { id: item._id, name: item.name, avatar: item.avatar }]
                                }
                                return prev;
                            })
                        }}
                        style={styles.friendItem}>
                        <Image style={{ height: 60, width: 60, borderRadius: 50 }} source={{ uri: item.avatar }} />
                        <View style={{ gap: 5, flex: 1 }}>
                            <Text style={{ color: "#2a2a2a", fontSize: 16, fontWeight: 400 }}>{item.name}</Text>
                            <Text style={{ color: "#757575", fontSize: 13 }}>{timeStamToDate(item?.createdAt ?? "")}</Text>
                        </View>
                        <CheckBox
                            style={{ marginLeft: 15, marginTop: 25, height: 50 }}
                            onClick={() => {
                                setMember((prev) => {
                                    if (prev.some((member) => member.id === item._id)) {
                                        return prev.filter((member) => member.id !== item._id)
                                    } else if (item._id && item.name && item.avatar) {
                                        return [...prev, { id: item._id, name: item.name, avatar: item.avatar }]
                                    }
                                    return prev;
                                })
                            }}
                            isChecked={member.some((member) => member.id === item._id)}
                            checkedCheckBoxColor="#009eff"
                            checkBoxColor="#c1c7c7"
                        />
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
            {member.length > 0 && (
                <View style={styles.choosedAvatar}>
                    <FlatList
                        data={member}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    setMember((prev) => prev.filter((member) => member.id !== item.id))
                                }}
                                style={{ backgroundColor: "#fff", flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <Image style={{ height: 60, width: 60, borderRadius: 50 }} source={{ uri: item.avatar }} />
                                <View style={{ borderColor: "#fff", borderWidth: 1, borderRadius: 50, position: "absolute", top: 0, right: 0 }}>
                                    <Ionicons style={{ backgroundColor: "#5a7b94", borderRadius: 30, }} name="close-circle-sharp" size={18} color="#dde9e1" />
                                </View>
                            </Pressable>
                        )}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ padding: 10, gap: 15 }}
                        horizontal={true}
                    />
                    <Pressable style={{ backgroundColor: "#009ffd", height: 60, width: 60, borderRadius: 50, alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: 10 }} onPress={() => { handleAddToGroup() }}>
                        <AntDesign name="arrowright" size={24} color="black" />
                    </Pressable>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ccc",
    },
    header: {
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        backgroundColor: "#f7f7f7"
    },
    renameGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    findPhone: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 5,
    },
    friendItem: {
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    choosedAvatar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        gap: 10,
        paddingHorizontal: 15,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})

export default ChooseMemberList;