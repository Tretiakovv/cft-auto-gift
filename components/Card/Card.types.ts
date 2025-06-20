export interface Person {
    ФИО: string;
    ДР: number;
    Годовщина: number;
    Исполнится: number;
    Должность?: string;
    Стаж: number;
    status?: string;
    avatar: string;
}

export interface CardProps {
    person: Person;
}