"use client";

import { useGlobalContext } from "@/lib/context";
import { ToggleGroup, ToggleGroupItem } from "../../../ui/toggle-group";
import { TabberProps } from "./Tabber.types";

export const Tabber = <T,>({ tabs }: TabberProps<T>) => {
    const { celebrateType, setCelebrateType } = useGlobalContext();

    return (
        <ToggleGroup
            className={"flex flex-row gap-2"}
            onValueChange={setCelebrateType}
            value={celebrateType}
            type="single"
        >
            {tabs.map(({ name, value }) => (
                <ToggleGroupItem
                    className={`w-fit h-[36px] flex-none !px-5 font-semibold rounded-[12px] ${
                        celebrateType === value
                            ? "bg-white text-black"
                            : "bg-white/20 text-white hover:text-white hover:bg-white/20"
                    }`}
                    value={value as string}
                    key={value as string}
                >
                    {name}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};
