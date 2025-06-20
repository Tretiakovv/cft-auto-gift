import { getAssetPrefix } from "@/utils/getAssetPrefix";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePersonContext } from "./PersonContext";

export const Header = () => {
    const person = usePersonContext();

    return (
        <div className="w-full flex flex-row gap-5 items-center">
            <Avatar className="size-[60px]">
                <AvatarImage className="size-[60px] object-cover" src={getAssetPrefix() + person.avatar} alt={person["ФИО"]} />
                <AvatarFallback className="size-[60px] text-black">
                    {person["ФИО"]
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </AvatarFallback>
            </Avatar>
            <h3 className="text-base leading-[130%] font-bold break-words max-w-[300px]">{person["ФИО"]}</h3>
        </div>
    );
};
