export interface Person {
    [key: string]: any;
    id?: number;
    name: string;
    identificationNumber: number;
    phone: string;
    email: string;
    birthdate: Date;
}
