export interface TabProps<T = unknown> {
    name: string;
    value: T;
}

export type TabberProps<T> = {
    tabs: TabProps<T>[];
};
