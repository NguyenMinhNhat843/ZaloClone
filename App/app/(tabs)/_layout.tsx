import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0573ff",
        headerShown: false,
        // headerStyle: {
        //     backgroundColor: '#25292e',
        // },
        // headerShadowVisible: false,
        // headerTintColor: '#fff',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#fbfbfb",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: 12,
                width: 60,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={
                  focused
                    ? "chatbubble-ellipses-sharp"
                    : "chatbubble-ellipses-outline"
                }
                color={color}
                size={24}
              />
              {focused ? (
                <Text style={{ color: color, fontSize: 13 }}>Tin nhắn</Text>
              ) : (
                <></>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="PhonebookScreen"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: 12,
                width: 60,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "id-card-sharp" : "id-card-outline"}
                color={color}
                size={24}
              />
              {focused ? (
                <Text style={{ color: color, fontSize: 13 }}>Danh bạ</Text>
              ) : (
                <></>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ExploreScreen"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: 12,
                width: 60,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "grid-sharp" : "grid-outline"}
                color={color}
                size={24}
              />
              {focused ? (
                <Text style={{ color: color, fontSize: 13 }}>Khám phá</Text>
              ) : (
                <></>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="DiaryScreen"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: 12,
                width: 60,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "time-sharp" : "time-outline"}
                color={color}
                size={24}
              />
              {focused ? (
                <Text style={{ color: color, fontSize: 13 }}>Nhật ký</Text>
              ) : (
                <></>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="OptionScreen"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: 12,
                width: 60,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "person-sharp" : "person-outline"}
                color={color}
                size={24}
              />
              {focused ? (
                <Text style={{ color: color, fontSize: 13 }}>Cá nhân</Text>
              ) : (
                <></>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
