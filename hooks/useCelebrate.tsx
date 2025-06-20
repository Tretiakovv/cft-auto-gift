import { Person } from "@/components/Card/Card.types";
import { useGlobalContext } from "@/lib/context";
import { getMonthFromSerialDate } from "@/lib/utils";

export const useCelebrate = (person: Person) => {
    const { month } = useGlobalContext();

    const hasBirthday = getMonthFromSerialDate(person["ДР"]) === month - 1;
    const hasAnniversary = getMonthFromSerialDate(person["Годовщина"]) === month - 1;

    return { hasBirthday, hasAnniversary };
};
