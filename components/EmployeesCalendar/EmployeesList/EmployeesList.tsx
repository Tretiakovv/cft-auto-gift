import { useGlobalContext } from "@/lib/context";
import { data } from "../../../data/sample";
import { getMonthFromSerialDate } from "../../../lib/utils";
import { PersonCard } from "../../Card/Card";
import { filterByCelebrateType, sortByCelebrateType } from "./EmployeesList.utils";

interface Person {
    ФИО: string;
    ДР: number;
    Годовщина: number;
    Исполнится: number;
    Должность?: string;
    Стаж: number;
    status?: string;
    avatar: string;
}

export function EmployeesList() {
    const { month, celebrateType } = useGlobalContext();

    const actualMonth = month - 1;

    const filteredEmployees = data.filter((person: Person) => {
        const birthdayMonth = getMonthFromSerialDate(person["ДР"]);
        const anniversaryMonth = getMonthFromSerialDate(person["Годовщина"]);

        return filterByCelebrateType(
            birthdayMonth === actualMonth,
            anniversaryMonth === actualMonth,
            celebrateType
        );
    });

    const sortedEmployees = filteredEmployees.sort((fst, snd) => {
        return sortByCelebrateType(fst, snd, celebrateType);
    });

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedEmployees.map((person: Person) => (
                <PersonCard key={person["ФИО"]} person={person} />
            ))}
        </div>
    );
}
