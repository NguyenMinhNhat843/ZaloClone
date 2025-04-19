declare global {

    interface IRegister {
        _id: string;
        phone: string;
        password: string;
        name: string;
        avatar: string;
        gender: string;
        dateOfBirth: string;
        gmail: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }

    interface IUserLogin {
        user?: any;
        message?: string;
        error?: string;
        statusCode?: number;
        accessToken?: string;
        refreshToken?: string;
    }

    interface ICheckAccount {
        data?: boolean;
    }

    interface IUserUpdate {
        _id?: string;
        phone?: string;
        name?: string;
        gender?: string;
        avatar?: string;
        dateOfBirth?: string;
    }

    interface IAccount {
        _id?: string;
        user?: any;
        conversations?: Array<IConversations>;
        name?: string;
        avatar?: string;
        dateOfBirth?: string;
        status?: string;
        phone?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        createdAt?: string;
        updatedAt?: string;
        __v?: number;
        lastActive?: string;
        statusCode?: number;
        message?: string;
        error?: string;
    }

    interface ISendOTP {
        message?: string;
        status?: boolean;
    }

    interface IChangePassword {
        message?: string;
        statusCode?: number;
        error?: string;
    }

    interface IConversations {
        _id: string;
        participants: Array<>;
        type: string;
        lastMessage: {
            _id: string;
            text: string;
            sender: string;
            timestamp: string;
        }
        nameConversation: string;
        groupAvatar: string;
        createdAt: string;
        updatedAt: string;
    }

    interface IMessages {
        _id: string;
        conversationId: string;
        sender: Object
        text: string;
        seenBy: Array;
        createdAt: string;
        updatedAt: string;
    }

    type AttachmentType =
        | "image"
        | "video"
        | "word"
        | "excel"
        | "pdf"
        | "ppt"
        | "text"
        | "audio"
        | "file";

    interface IAttachment {
        url: string;
        type: AttachmentType;
        size: number; // tính theo bytes
    }

    interface IAttachmentResponse {
        attachments: IAttachment[];
    }

    interface IMessage {
        _id: string;
        conversationId: string;
        senderId: string;
        sender: {
            _id: string;
            name: string;
            avatar: string;
        }
        receiverId: string;
        text: string;
        seenBy: Array;
        createdAt: string;
        updatedAt: string;
        attachments: IAttachment[];
        deletedFor: string[];
    }
}
export { };