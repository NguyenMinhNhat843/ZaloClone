import axios from "axios";

export const registerAPI = (phone: string, password: string) => {

    const url = `${process.env.EXPO_PUBLIC_ANDROID_API_URL}/auth/register`;
    return axios.post<IBackendRes<IRegister>>(url, { phone, password })
}

export const loginAPI = (phone: string, password: string) => {

    const url = `${process.env.EXPO_PUBLIC_ANDROID_API_URL}/auth/login`;
    const user = {
        phone: phone,
        password: password,
    }
    console.log(user)
    return axios.post<IBackendRes<IUserLogin>>(url, { user: user })
}