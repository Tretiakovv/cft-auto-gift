"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGlobalContext } from "@/lib/context";
import { Button } from "../ui/button";

const monthNames = [
    "Январе",
    "Феврале",
    "Марте",
    "Апреле",
    "Мае",
    "Июне",
    "Июле",
    "Августе",
    "Сентябре",
    "Октябре",
    "Ноябре",
    "Декабре",
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

    return (
        <div className="mt-5 w-full flex items-center justify-between sele">
            <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={handlePrevMonth}
                disabled={month === 1}
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>

            <span className="text-xl font-semibold text-white">
                <span className="opacity-40">Поздравляши в </span>
                <span>{monthNames[month - 1]}</span>
            </span>

            <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={handleNextMonth}
                disabled={month === 12}
            >
                <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
    );
};
