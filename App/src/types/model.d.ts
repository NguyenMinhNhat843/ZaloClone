declare global {

    interface IRegister {
        id: string;
    }

    interface IUserLogin {
        message?: string;
        error?: string;
        statusCode?: number;
        accessToken?: string;
        refreshToken?: string;
    }

    interface IAccount {
        _id?: string;
        user?: any;
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

}
export { };