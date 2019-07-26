export interface Student{
    uid: string;
    name: string;
    email: string;
    class: string;
    rollno: string;
}

export interface AuthUser{
    name: string;
    email: string;
    password: string;
}

export interface Teacher{
    uid: string;
    name: string;
    email: string;
    designation: string;
}

export interface Librarian{
    uid:string;
    name: string;
    email: string;
}

export interface RequestObj{
    name: string;
    email: string;
    password: string;
    profile: string;
    class: string;
    rollno: string;
    designation: string;
}
