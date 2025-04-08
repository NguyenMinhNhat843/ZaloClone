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
}
export { };