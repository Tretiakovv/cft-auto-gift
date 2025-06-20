"use client";

import { useGlobalContext } from "@/lib/context";
import { ArrowButton } from "./ArrowButton";

const monthNames = [
    "январе",
    "феврале",
    "марте",
    "апреле",
    "мае",
    "июне",
    "июле",
    "августе",
    "сентябре",
    "октябре",
    "ноябре",
    "декабре",
];

export const MonthSwitcher = () => {
    const { month, setMonth } = useGlobalContext();

    const handlePrevMonth = () => {
        if (month > 1) {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month < 12) {
            setMonth(month + 1);
        }
    };

    // TODO: Изменить hover-эффекты и UI стреклок
    return (
        <div className="min-w-[600px] flex items-center justify-between">
            <ArrowButton position="left" onClick={handlePrevMonth} disabled={month === 1} />
            <span className="text-[36px] font-semibold text-white">
                <span className="opacity-40">Поздравляши в </span>
                <span>{monthNames[month - 1]}</span>
            </span>
            <ArrowButton position="right" onClick={handleNextMonth} disabled={month === 12} />
        </div>
    );
};
