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