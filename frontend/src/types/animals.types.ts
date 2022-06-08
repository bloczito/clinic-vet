export interface Pet {
    name: string;
    race: string;
    weight: number;
    height: number;
}

export interface AddNewPet {
    name: string;
    speciesId: number;
    additionalSpecies?: string;
    race: string;
    weight: number;
    height: number;
    dateOfBirth: string;
}

export interface UserPet {
    id: number;
    name: string;
    species: string;
    additionalSpecies?: string;
    race: string;
    weight: number;
    height: number;
    dateOfBirth: string;
}

export interface PetVisits {
    id: number;
    date: string;
    doctorId: number;
    animal: {
        id: number,
        name: string
        };
    note: string;
}



export interface PetErrors {
    name: string;
    species: string;
    weight: string;
    height: string;
}

export interface Species {
    id: number;
    name: string;
}
