import React from "react";
import { Text, View } from "react-native";
import ChatReaction from "./chatReaction";
import ChatRecord from "./chatRecord";
import ChatImage from "./chatImage";
import ChatMore from "./chatMore";
import { useCurrentApp } from "@/context/app.context";

interface IProps {
    isModalVisible: boolean;
    index: number;
    userId: string;
    receiverId: string;
    userAvatar: string;
    conversationsId: string;
}

const ChatContainer = (props: IProps) => {
    const { isModalVisible, index, userId, receiverId, userAvatar, conversationsId } = props;
    const { setMessages } = useCurrentApp()
    return (
        <View style={{ height: isModalVisible ? 244 : 0 }}>
            {(() => {
                switch (index) {
                    case 1:
                        return <ChatReaction />;
                    case 2:
                        return <ChatMore
                            conversationsId={conversationsId}
                            receiverId={receiverId}
                            userId={userId}
                            userAvatar={userAvatar}
                        />;
                    case 3:
                        return <ChatRecord
                            conversationsId={conversationsId}
                            receiverId={receiverId}
                            userId={userId}
                            userAvatar={userAvatar}
                        />;
                    case 4:
                        return <ChatImage
                            conversationsId={conversationsId}
                            receiverId={receiverId}
                            userId={userId}
                            userAvatar={userAvatar} />;
                    default:
                        return <Text>Default</Text>;
                }
            })()}
        </View>
    )
}

export default ChatContainer;