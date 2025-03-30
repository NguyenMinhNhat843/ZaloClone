declare global {
    interface IBackendRes<T> {
        data?: T;
    }

    interface IRegister {
        id: string;
    }

    interface IUserLogin {
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            phone: string;
        };
        accessToken: string;
    }
}
export { };