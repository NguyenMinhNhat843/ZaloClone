import { APP_COLOR } from "@/utils/constant";
import * as React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
    ICarouselInstance,
    Pagination,
} from "react-native-reanimated-carousel";

function BannerHome() {
    const width = Dimensions.get("window").width;
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            /**
             * Calculate the difference between the current index and the target index
             * to ensure that the carousel scrolls to the nearest index
             */
            count: index - progress.value,
            animated: true,
        });
    };

    const data = [
        {
            id: 1,
            source: require("@/assets/welcome/image01.png"),
            title: "Gọi video ổn định",
            content: "Trò chuyện thật đã với chất lượng video ổn định mọi lúc, mọi nơi"
        },
        {
            id: 2,
            source: require("@/assets/welcome/final_sharpened_backgroundZalo.png"),
            title: "Chat nhóm tiện ích",
            content: "Nơi cùng nhau trao đổi, giữ liên lạc với gia đình, bạn bè, đồng nghiệp...",
        },
        {
            id: 3,
            source: require("@/assets/welcome/final_sharpened_backgroundZalo.png"),
            title: "Gửi ảnh nhanh chóng",
            content: "Trao đổi hình ảnh chất lượng cao với bạn bè và người thân thật nhanh và dễ dàng",
        },
        {
            id: 4,
            source: require("@/assets/welcome/final_sharpened_backgroundZalo.png"),
            title: "Nhật ký bạn bè",
            content: "Nơi cập nhật hoạt động mới nhất của những người bạn quan tâm",
        },
    ];

    return (
        <View style={{ flex: 1, position: "absolute", top: 0, zIndex: 2 }}>
            <Carousel
                ref={ref}
                width={width}
                height={width * 1.5}
                data={data}
                onProgressChange={progress}
                renderItem={({ item, index }) => (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}>
                        <Text style={{ color: APP_COLOR.PRIMARY, fontSize: 40, fontWeight: "bold", fontFamily: "" }}>Zalo</Text>
                        <Image
                            source={item.source}
                            style={{ width: width / 1.8, height: width / 2, resizeMode: "cover" }}
                            key={index}
                        />
                        <View style={{ alignItems: "center", width: width / 1.2, gap: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: 800 }}>{item.title}</Text>
                            <Text style={{ textAlign: "center", fontWeight: 500 }}>{item.content}</Text>
                        </View>
                    </View>
                )}
            />

            <Pagination.Basic
                progress={progress}
                size={10}
                data={data}
                activeDotStyle={{ backgroundColor: APP_COLOR.PRIMARY, borderRadius: 50, height: 10, width: 10 }}
                dotStyle={{ backgroundColor: "#d7d7d7", borderRadius: 50, height: 10, width: 10 }}
                containerStyle={{ gap: 5 }}
                onPress={onPressPagination}
            />
        </View>
    );
}

export default BannerHome;