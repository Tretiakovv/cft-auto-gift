import { createContext, ReactNode, useContext } from "react";
import type { Person } from "./Card.types";

export const PersonContext = createContext<Person | undefined>(undefined);

export function PersonContextProvider({ person, children }: { person: Person; children: ReactNode }) {
    return <PersonContext.Provider value={person}>{children}</PersonContext.Provider>;
}

export function usePersonContext() {
    const context = useContext(PersonContext);
    if (context === undefined) {
        throw new Error("usePersonContext must be used within a PersonContextProvider");
    }
    return context;
}
