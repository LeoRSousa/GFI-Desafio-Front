export type Investment = {
    id: string;
    name: string;
    type: "STOCK" | "FUND" | "BOND";
    value: number;
    startDate: string;
    userId: string;
};