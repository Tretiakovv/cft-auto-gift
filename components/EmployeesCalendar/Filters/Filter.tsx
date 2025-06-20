import { CelebrateType } from "@/lib/context";
import { MonthSwitcher } from "./MonthSwitcher/MonthSwitcher";
import { Tabber } from "./Tabber/Tabber";
import { TabProps } from "./Tabber/Tabber.types";

const tabs: TabProps<CelebrateType>[] = [
    { name: "Все", value: "all" },
    { name: "День рождения", value: "birthday" },
    { name: "Годовщина", value: "anniversary" },
];

export const Filters = () => {
    return (
        <div className="w-full flex flex-row items-center justify-between">
            <MonthSwitcher />
            <Tabber tabs={tabs} />
        </div>
    );
};
