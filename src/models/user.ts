import { UserLocation } from "./location";

export interface User {
    nickname: string;
    gender: string;
    age: number
    race: string;
    bodyType: string;
    height: number
    email: string;
    phone: string;
    profilePic?: string;
    password: string;
    uid: string;
    dateCreated: string;
    userType: string;
    verified?: boolean;
    location: UserLocation;
    distance?: string;
};
