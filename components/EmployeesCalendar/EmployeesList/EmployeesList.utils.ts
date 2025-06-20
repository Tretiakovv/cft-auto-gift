import { Person } from "@/components/Card/Card.types";
import { CelebrateType } from "@/lib/context";
import { excelSerialDateToJSDate } from "@/lib/utils";

export const filterByCelebrateType = (
    isBirthday: boolean,
    isAnniversary: boolean,
    celebrateType: CelebrateType
): boolean => {
    if (celebrateType === "anniversary") {
        return isAnniversary;
    } else if (celebrateType === "birthday") {
        return isBirthday;
    }

    return isAnniversary || isBirthday;
};

export const getLowestDate = (person: Person, type: CelebrateType): Date | null => {
    if (type === "birthday") {
        return person.ДР ? excelSerialDateToJSDate(person.ДР) : null;
    } else if (type === "anniversary") {
        return person.Годовщина ? excelSerialDateToJSDate(person.Годовщина) : null;
    } else {
        const dr = person.ДР ? excelSerialDateToJSDate(person.ДР) : null;
        const ann = person.Годовщина ? excelSerialDateToJSDate(person.Годовщина) : null;

        if (dr && ann) return dr < ann ? dr : ann;

        return dr || ann;
    }
};

export const getLowestDay = (person: Person, type: CelebrateType): number | null => {
    if (type === "birthday") {
        return person.ДР ? excelSerialDateToJSDate(person.ДР).getDate() : null;
    } else if (type === "anniversary") {
        return person.Годовщина ? excelSerialDateToJSDate(person.Годовщина).getDate() : null;
    } else {
        const drDay = person.ДР ? excelSerialDateToJSDate(person.ДР).getDate() : null;
        const annDay = person.Годовщина ? excelSerialDateToJSDate(person.Годовщина).getDate() : null;
        if (drDay !== null && annDay !== null) return Math.min(drDay, annDay);
        return drDay !== null ? drDay : annDay;
    }
};

export const sortByCelebrateType = (fst: Person, snd: Person, celebrateType: CelebrateType): number => {
    const dayA = getLowestDay(fst, celebrateType);
    const dayB = getLowestDay(snd, celebrateType);

    if (dayA === null && dayB === null) return 0;
    if (dayA === null) return 1;
    if (dayB === null) return -1;

    return dayA - dayB;
};
