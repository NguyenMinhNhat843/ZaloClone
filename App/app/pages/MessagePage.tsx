import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

const App = () => {
  // Dữ liệu giả lập
  const conversations = [
    {
      id: "1",
      name: "NOW_LT_KTTKPM_T7_7_9_D...",
      message: "Nguyễn Trọng Tiến: Đổi tên nhóm từ...",
      time: "3 giờ",
      avatar: "https://via.placeholder.com/50", // link ảnh đại diện giả
    },
    {
      id: "2",
      name: "SinhVien_Nganh_SE_Kh...",
      message: "Nguyễn Thị Hạnh: Các bạn nhớ đăng...",
      time: "13 giờ",
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: "3",
      name: "KLTN-HK2-2024-2025",
      message: "Thu Hà: Các bạn lưu ý",
      time: "13 giờ",
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: "4",
      name: "Lê Phước Nguyễn",
      message: "À login hiện cái trang chính",
      time: "13 giờ",
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: "5",
      name: "Xiaomi Vietnam",
      message: "Mua ngay Redmi Note 14 Series",
      time: "13 giờ",
      avatar: "https://via.placeholder.com/50",
    },
  ];

  // Render mỗi conversation
  const renderItem = ({
    item,
  }: {
    item: {
      id: string;
      name: string;
      message: string;
      time: string;
      avatar: string;
    };
  }) => (
    <TouchableOpacity style={styles.conversation}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="Tìm kiếm" style={styles.searchInput} />
      </View>

      {/* Danh sách hội thoại */}
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Màu nền đen
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#1a1a1a", // Thanh tìm kiếm màu tối
  },
  searchInput: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    fontSize: 16,
  },
  conversation: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    color: "#aaa",
    fontSize: 14,
  },
  time: {
    color: "#aaa",
    fontSize: 12,
  },
});
