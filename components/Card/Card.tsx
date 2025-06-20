import { Card, CardContent } from "../ui/card";
import { CardProps } from "./Card.types";
import { Chips } from "./Chips";
import { Description } from "./Description";
import { Header } from "./Header";
import { PersonContextProvider } from "./PersonContext";

export const PersonCard = ({ person }: CardProps) => (
    <PersonContextProvider person={person}>
        <Card className="py-0 w-full bg-white backdrop-filter backdrop-blur-lg rounded-xl border-none shadow-none text-white">
            <CardContent className="flex flex-col gap-6 p-6 text-black">
                <Header />
                <Chips />
                <Description />
            </CardContent>
        </Card>
    </PersonContextProvider>
);
