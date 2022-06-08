import {Moment} from "moment";

export interface Visit {
    id: number,
    date: Moment,
    doctorId: number,
    animal: Animal,
    note: string
}

export interface DailyVisits {
    date: Moment;
    visits: Visit[];
}


export interface Animal {
    id: number;
    name: string
}
