import { UserLocation } from "./location";

export interface User {
    nickname: string;
    gender: string;
    age: string;
    race: string; 
    bodyType: string;
    height: string;
    email: string;
    phone: string;
    password: string;
    uid: string;
    dateCreated: string;
    userType: string;
    location: UserLocation
};
