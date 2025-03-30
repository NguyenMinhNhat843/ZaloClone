import React, { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu
type InfoContextType = {
    gender: string;
    setGender: (value: string) => void;
    dateOfBirth: Date;
    setDateOfBirth: (value: Date) => void;
};

// Tạo Context
const InfoContext = createContext<InfoContextType | undefined>(undefined);

// Tạo Provider
export const InfoProvider = ({ children }: { children: ReactNode }) => {
    const [gender, setGender] = useState<string>("");

    return (
        <InfoContext.Provider value={{ gender, setGender, dateOfBirth: new Date(), setDateOfBirth: () => { } }}>
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
