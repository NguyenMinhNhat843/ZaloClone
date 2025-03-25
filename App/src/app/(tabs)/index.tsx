import ChatItem from "@/components/chat/ChatItem";
import Header from "@/components/Header";
import React, { useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const conversations = [
  {
    conversationsId: 1,
    lastMessage: "Chào bạn",
    lastMessageOwner: "Đặng Nguyễn",
    lastMessageTime: "12 giờ",
    chatName: "Đặng Nguyễn",
    chatAvatar: require("../../assets/images/avatar1.png"),
    participants: [
      {
        name: "Đặng Nguyễn",
        avatar: require("../../assets/images/avatar1.png"),
      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      }
    ],
  },
  {
    conversationsId: 2,
    lastMessage: "Hôm nay thế nào?",
    lastMessageOwner: "Bạn",
    lastMessageTime: "3 phút",
    chatName: "Nhóm môn công nghệ phần mềm",
    chatAvatar: null,
    participants: [
      {
        name: "Đặng Nguyễn",
        avatar: require("../../assets/images/avatar1.png"),

      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      }
      ,
      {
        name: "Khôi Nguyễn",
        avatar: require("../../assets/images/avatar3.png"),
      }
    ],
  },
  {
    conversationsId: 3,
    lastMessage: "OK",
    lastMessageOwner: "Khôi Nguyễn",
    lastMessageTime: "T4",
    chatName: "Nhóm môn công nghệ mới",
    chatAvatar: require("../../assets/images/background.jpg"),
    participants: [
      {
        name: "Đặng Nguyễn",
        avatar: require("../../assets/images/avatar1.png"),

      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      },
      {
        name: "Khôi Nguyễn",
        avatar: require("../../assets/images/avatar3.png"),
      },
      {
        name: "Huy Nguyễn",
        avatar: require("../../assets/images/favicon.png"),
      }
    ],
  },
  {
    conversationsId: 4,
    lastMessage: "Đi chơi không anh em?",
    lastMessageOwner: "Bình Văn",
    lastMessageTime: "6/3",
    chatName: "Hội chơi game",
    chatAvatar: null,
    participants: [
      {
        name: "Nam Hùng",
        avatar: require("../../assets/images/avatar1.png"),

      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      },
      {
        name: "Thanh Trần",
        avatar: require("../../assets/images/avatar3.png"),
      },
      {
        name: "Bình Văn",
        avatar: require("../../assets/images/avatar1.png"),
      },
    ],
  },
  {
    conversationsId: 5,
    lastMessage: "Chào bạn",
    lastMessageOwner: "Đặng Nguyễn",
    lastMessageTime: "12 giờ",
    chatName: "Đặng Nguyễn",
    chatAvatar: require("../../assets/images/avatar1.png"),
    participants: [
      {
        name: "Đặng Nguyễn",
        avatar: require("../../assets/images/avatar1.png"),
      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      }
    ],
  },
  {
    conversationsId: 6,
    lastMessage: "Hôm nay thế nào?",
    lastMessageOwner: "Bạn",
    lastMessageTime: "3 phút",
    chatName: "Nhóm môn công nghệ phần mềm",
    chatAvatar: null,
    participants: [
      {
        name: "Đặng Nguyễn",
        avatar: require("../../assets/images/avatar1.png"),

      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      }
      ,
      {
        name: "Khôi Nguyễn",
        avatar: require("../../assets/images/avatar3.png"),
      }
    ],
  },
  {
    conversationsId: 7,
    lastMessage: "OK",
    lastMessageOwner: "Bạn",
    lastMessageTime: "T4",
    chatName: "Nhóm môn công nghệ mới",
    chatAvatar: require("../../assets/images/background.jpg"),
    participants: [
      {
        name: "Đặng Nguyễn",
        avatar: require("../../assets/images/avatar1.png"),

      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      },
      {
        name: "Khôi Nguyễn",
        avatar: require("../../assets/images/avatar3.png"),
      },
      {
        name: "Huy Nguyễn",
        avatar: require("../../assets/images/favicon.png"),
      }
    ],
  },
  {
    conversationsId: 8,
    lastMessage: "Đi chơi không anh em?",
    lastMessageOwner: "Bình Văn",
    lastMessageTime: "6/3",
    chatName: "Hội chơi game",
    chatAvatar: null,
    participants: [
      {
        name: "Nam Hùng",
        avatar: require("../../assets/images/avatar1.png"),

      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      },
      {
        name: "Thanh Trần",
        avatar: require("../../assets/images/avatar3.png"),
      },
      {
        name: "Bình Văn",
        avatar: require("../../assets/images/avatar1.png"),
      },
    ],
  },
  {
    conversationsId: 9,
    lastMessage: "Chào bạn",
    lastMessageOwner: "Đặng Nguyễn",
    lastMessageTime: "12 giờ",
    chatName: "Đặng Nguyễn",
    chatAvatar: require("../../assets/images/avatar1.png"),
    participants: [
      {
        name: "Đặng Nguyễn",
        avatar: require("../../assets/images/avatar1.png"),
      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      }
    ],
  },
  {
    conversationsId: 10,
    lastMessage: "Hôm nay thế nào?",
    lastMessageOwner: "Bạn",
    lastMessageTime: "3 phút",
    chatName: "Nhóm môn công nghệ phần mềm",
    chatAvatar: null,
    participants: [
      {
        name: "Đặng Nguyễn",
        avatar: require("../../assets/images/avatar1.png"),

      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      }
      ,
      {
        name: "Khôi Nguyễn",
        avatar: require("../../assets/images/avatar3.png"),
      }
    ],
  },
  {
    conversationsId: 11,
    lastMessage: "OK",
    lastMessageOwner: "Bạn",
    lastMessageTime: "T4",
    chatName: "Nhóm môn công nghệ mới",
    chatAvatar: require("../../assets/images/background.jpg"),
    participants: [
      {
        name: "Đặng Nguyễn",
        avatar: require("../../assets/images/avatar1.png"),

      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      },
      {
        name: "Khôi Nguyễn",
        avatar: require("../../assets/images/avatar3.png"),
      },
      {
        name: "Huy Nguyễn",
        avatar: require("../../assets/images/favicon.png"),
      }
    ],
  },
  {
    conversationsId: 12,
    lastMessage: "Đi chơi không anh em?",
    lastMessageOwner: "Bình Văn",
    lastMessageTime: "6/3",
    chatName: "Hội chơi game",
    chatAvatar: null,
    participants: [
      {
        name: "Nam Hùng",
        avatar: require("../../assets/images/avatar1.png"),

      },
      {
        name: "Bạn",
        avatar: require("../../assets/images/avatar2.png"),
      },
      {
        name: "Thanh Trần",
        avatar: require("../../assets/images/avatar3.png"),
      },
      {
        name: "Bình Văn",
        avatar: require("../../assets/images/avatar1.png"),
      },
    ],
  },
]

const Index = () => {
  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <ChatItem
            conversationsId={item.conversationsId}
            lastMessage={item.lastMessage}
            lastMessageOwner={item.lastMessageOwner}
            lastMessageTime={item.lastMessageTime}
            chatName={item.chatName}
            chatAvatar={item.chatAvatar}
            participants={item.participants}
          />
        )}
        keyExtractor={item => item.conversationsId.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f3f8",
  },
})

export default Index;
