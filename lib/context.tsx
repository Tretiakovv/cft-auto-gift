"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export type CelebrateType = "birthday" | "anniversary" | "all";

type GlobalContextType = {
    month: number;
    celebrateType: CelebrateType;
    setCelebrateType: (type: CelebrateType) => void;
    setMonth: (month: number) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [celebrateType, setCelebrateType] = useState<CelebrateType>("all");

    return (
        <GlobalContext.Provider value={{ month, celebrateType, setMonth, setCelebrateType }}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalContext() {
    const context = useContext(GlobalContext);

    if (context === undefined) {
        throw new Error("useMonth must be used within a GlobalContextProvider");
    }

    return context;
}
