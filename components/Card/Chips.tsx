import { useCelebrate } from "@/hooks/useCelebrate";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Person } from "./Card.types";
import { usePersonContext } from "./PersonContext";

const createChips = (person: Person, hasBirthday: boolean, hasAnniversary: boolean) => [
    { name: hasBirthday ? "ДР" : null, className: "bg-[#FFE165] text-black", show: hasBirthday },
    { name: hasAnniversary ? "Годовщина" : null, className: "bg-[#FFE165] text-black", show: hasAnniversary },
    { name: person["Должность"], className: "bg-[#F4F4F4] text-gray-500" },
];

export const Chips = () => {
    const person = usePersonContext();
    const { hasAnniversary, hasBirthday } = useCelebrate(person);

    const chips = createChips(person, hasBirthday, hasAnniversary).filter((chip) => chip.show);

    return (
        <div className="max-w-full flex-wrap flex flex-row items-center gap-2">
            {chips.map(({ name, className }, index) => (
                <Badge className={cn("font-semibold text-sm", className)} key={index}>
                    {name}
                </Badge>
            ))}
        </div>
    );
};
