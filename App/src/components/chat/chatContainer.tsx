import React from "react";
import { Text, View } from "react-native";
import ChatReaction from "./chatReaction";
import ChatRecord from "./chatRecord";
import ChatImage from "./chatImage";
import ChatMore from "./chatMore";

interface IProps {
    isModalVisible: boolean;
    index: number;
    userId: string;
    receiverId: string;
    userAvatar: string;
    setMessages: (messages: IMessages[]) => void;
    conversationsId: string;
}

const ChatContainer = (props: IProps) => {
    const { isModalVisible, index, userId, receiverId, userAvatar, setMessages, conversationsId } = props;

    return (
        <View style={{ height: isModalVisible ? 244 : 0 }}>
            {(() => {
                switch (index) {
                    case 1:
                        return <ChatReaction />;
                    case 2:
                        return <ChatMore />;
                    case 3:
                        return <ChatRecord />;
                    case 4:
                        return <ChatImage
                            conversationsId={conversationsId}
                            setMessages={setMessages}
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