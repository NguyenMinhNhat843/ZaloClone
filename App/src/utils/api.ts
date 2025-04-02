import axios from "@/utils/axios.customize";

export const registerAPI = (phone: string, password: string) => {

    const url = `/auth/register`;
    return axios.post<IRegister>(url, { phone, password })
}

export const loginAPI = (phone: string, password: string) => {
    const url = `/auth/login`
    return axios.post<IUserLogin>(url, { phone, password })
}

export const getAccountAPI = () => {
    const url = `/users/me`
    return axios.get<IAccount>(url)
}