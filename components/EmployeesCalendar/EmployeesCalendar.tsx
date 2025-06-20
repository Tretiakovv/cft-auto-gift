import { Block } from "../Block/Block";
import { EmployeesList } from "./EmployeesList/EmployeesList";
import { Filters } from "./Filters/Filter";

export const EmployeesCalendar = () => (
    <Block className="flex flex-col gap-5">
        <Filters />
        <EmployeesList />
    </Block>
);
