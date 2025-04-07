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