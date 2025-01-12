import { Showroom } from "./showroom";

export interface Car {
    id: number;
    vin: string;
    maker: string;
    model: string;
    modelYear: number;
    price: number;
    showroom: Showroom;
    showroomId: number;
}
