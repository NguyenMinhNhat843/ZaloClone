import axios from "@/utils/axios.customize";

export const registerAPI = (phone: string, password: string,
    avatar: string, name: string, gmail: string, dateOfBirth: string, gender: string) => {
    const url = `/auth/register`;
    const user = {
        phone: phone,
        name: name,
        avatar: avatar,
        password: password,
        gmail: gmail,
        gender: gender,
        dateOfBirth: dateOfBirth,
    }
    return axios.post<IRegister>(url, user)
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
    const payload: Partial<IUserUpdate> = {}

    if (name.trim() !== "") payload.name = name
    if (dateOfBirth.trim() !== "") payload.dateOfBirth = dateOfBirth
    if (gender.trim() !== "") payload.gender = gender
    if (avatar.trim() !== "") payload.avatar = avatar

    return axios.patch<IUserUpdate>(url, payload)
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