import { useCelebrate } from "@/hooks/useCelebrate";
import { cn, formatDate } from "../../lib/utils";
import { Person } from "./Card.types";
import { usePersonContext } from "./PersonContext";

const createRows = (person: Person, hasBithday: boolean, hasAnniversary: boolean) => [
    {
        title: "День рождения",
        content: formatDate(person["ДР"]),
        show: hasBithday,
    },
    {
        title: "Годовщина",
        content: formatDate(person["Годовщина"]),
        show: hasAnniversary,
    },
    {
        title: "Исполняется",
        content: `${person["Исполнится"]} лет`,
        show: hasBithday,
    },
    {
        title: "Стаж",
        content: `${person["Стаж"]} лет`,
        show: hasAnniversary,
    },
];

export const Description = () => {
    const person = usePersonContext();
    const { hasAnniversary, hasBirthday } = useCelebrate(person);
    const rows = createRows(person, hasBirthday, hasAnniversary).filter((row) => row.show);

    return (
        <div className="flex flex-col gap-3">
            {rows.map((row, index, arr) => (
                <div className={cn("w-full flex flex-row items-baseline justify-between")} key={index}>
                    <div className="font-semibold">{row.title}</div>
                    <div>{row.content}</div>
                </div>
            ))}
        </div>
    );
};
