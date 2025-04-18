import axios from "@/utils/axios.customize";

export const registerAPI = (phone: string, password: string,
    avatar: string, name: string, gmail: string, dateOfBirth: string, gender: string) => {
    const url = `/auth/register`;
    const fileType = avatar.split(".").pop();
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('name', name);
    formData.append('gmail', gmail);
    formData.append('password', password);
    formData.append('gender', gender)
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('avatar', {
        uri: avatar,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
    } as any);
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    return axios.post<IRegister>(url, formData, { headers })
}

export const loginAPI = (phone: string, password: string) => {
    const url = `/auth/login`
    return axios.post<IUserLogin>(url, { phone, password })
}

export const getAccountAPI = () => {
    const url = `/users/me`
    return axios.get<IAccount>(url)
}

export const getAccountByIdAPI = (id: string) => {
    const url = `/users/${id}`
    return axios.get<IAccount>(url)
}

export const getAccountByPhoneAPI = (phone: string) => {
    const url = `/users/${phone}`
    return axios.get<IAccount>(url)
}

export const checkPhoneExist = (phone: string) => {
    const url = `/users/check-phone`
    return axios.post<ICheckAccount>(url, { phone })
}

export const updateProfile = (name: string, dateOfBirth: string, gender: string, avatar: string) => {
    const url = `/users/me`
    const fileType = avatar.split(".").pop();
    const formData = new FormData();
    if (name.trim() !== "") formData.append('name', name)
    if (dateOfBirth.trim() !== "") formData.append('dateOfBirth', dateOfBirth)
    if (gender.trim() !== "") formData.append('gender', gender)
    if (avatar.trim() !== "") {
        formData.append('avatar', {
            uri: avatar,
            name: `avatar.${fileType}`,
            type: `image/${fileType}`,
        } as any);

    }
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    return axios.patch<IUserUpdate>(url, formData, { headers })
}

export const sendOTP = (email: string) => {
    const url = `/auth/send`
    return axios.post<ISendOTP>(url, { email })
}

export const verifyOTP = (email: string, otp: string) => {
    const url = `/auth/verify`
    const verifyOTP = {
        email: email,
        otp: otp
    }
    console.log("verifyOTP", verifyOTP)
    return axios.post<ISendOTP>(url, verifyOTP)
}

export const changePassword = (oldPassword: string, newPassword: string) => {
    const url = `/users/change-password`
    return axios.patch<IChangePassword>(url, { oldPassword, newPassword })
}

export const getAllConversations = () => {
    const url = `/chat/conversations`
    return axios.get<IConversations[]>(url)
}

export const getAllConversationsByUserId = (userId: string) => {
    const url = `/chat/conversations/${userId}`
    return axios.get<IConversations[]>(url)
}

export const getAllMessagesByConversationId = (conversationId: string) => {
    const url = `/chat/messages/${conversationId}`
    return axios.get<IMessages[]>(url)
}

export const sendTextMessageAPI = (senderId: string, receiverId: string, text: string) => {
    const url = `/chat/send`
    return axios.post<IMessage>(url, { senderId, receiverId, text })
}

export const sendFileMessageAPI = (fileUris: string[]) => {
    const formData = new FormData();
    const url = `/chat/upload/files`
    fileUris.forEach((uri, index) => {
        const fileType = uri.split(".").pop();
        formData.append("files", {
            uri,
            name: `file_${index}.${fileType}`,
            type: fileType?.includes("mp4") ? "video/mp4" : `image/${fileType}`,
        } as any);
        console.log("file", uri, fileType)
    });

    const headers = {
        "Content-Type": "multipart/form-data",
    };
    return axios.post<IAttachmentResponse>(url, formData, { headers })
}

export const sendDocumentMessageAPI = (uri: string, name: string, mimeType: string) => {
    const formData = new FormData();
    const url = `/chat/upload/files`
    const fileType = uri.split(".").pop();

    formData.append("files", {
        uri,
        name,
        type: 'application/octet-stream',
    } as any);

    const headers = {
        "Content-Type": "multipart/form-data",
    };
    return axios.post<IAttachmentResponse>(url, formData, { headers })
}

export const sendAudioMessageAPI = (uri: string) => {
    const formData = new FormData();
    const url = `/chat/upload/files`;
    formData.append('files', {
        uri,
        name: 'recording.3gp',
        type: 'audio/mp3',
    } as any);
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    console.log(formData)
    return axios.post<IAttachmentResponse>(url, formData, { headers })

}
