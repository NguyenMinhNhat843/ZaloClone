import React, { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu
type InfoContextType = {
    gender: string;
    setGender: (value: string) => void;
    dateOfBirth: Date;
    setDateOfBirth: (value: Date) => void;
    name: string;
    setName: (value: string) => void;
    phone: string;
    setPhone: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    avatar: string;
    setAvatar: (value: string) => void;
};

// Tạo Context
const InfoContext = createContext<InfoContextType | undefined>(undefined);

// Tạo Provider
export const InfoProvider = ({ children }: { children: ReactNode }) => {
    const [gender, setGender] = useState<string>("");
    const [dateOfBirth, setDateOfBirth] = useState<Date>(() => {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() - 14);
        return currentDate;
    });
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");

    return (
        <InfoContext.Provider
            value={{
                gender, setGender,
                dateOfBirth, setDateOfBirth,
                name, setName,
                phone, setPhone,
                email, setEmail,
                avatar, setAvatar,
            }}>
            {children}
        </InfoContext.Provider>
    );
};

// Hook để sử dụng context
export const useInfo = () => {
    const context = useContext(InfoContext);
    if (!context) {
        throw new Error("useGender must be used within a GenderProvider");
    }
    return context;
};
