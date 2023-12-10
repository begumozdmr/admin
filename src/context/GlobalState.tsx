import React, { createContext, useEffect } from 'react'

export type ContextProps = {
    children: React.ReactNode;
};

interface UserData {
    id: number,
    name: string,
    email: string,
    password: string,
    status: string,
    token: string,
    date: string,
    login: boolean
}
type SetUserData = (userData: UserData[]) => void;

interface WorkOrderData {
    id: number,
    workName: string,
    date: string,
    completed: boolean,
    workUser: string[],
    notes: string,
    billed: string,
    number: string
}
type SetWorkOrderData = (workOrderData: WorkOrderData[]) => void;

interface LoginUserData {
    id: string,
    name: string,
    token: string,
    email: string
}
type SetLoginUserData = (loginUserData: LoginUserData) => void

interface AdminControl {
    adminControl: boolean
}
type SetAdminControl = (adminControl: AdminControl) => void

export type Type = {
    userData: UserData[];
    setUserData: SetUserData;
    loginUserData: LoginUserData;
    setLoginUserData: SetLoginUserData;
    workOrderData: WorkOrderData[];
    setWorkOrderData: SetWorkOrderData;
    adminControl: AdminControl;
    setAdminControl: SetAdminControl;
};

export const GlobalContext = createContext<Type>({} as Type);

export const GlobalProvider = ({ children }: ContextProps) => {

    const [userData, setUserData] = React.useState<UserData[]>([]);
    const [workOrderData, setWorkOrderData] = React.useState<WorkOrderData[]>([]);
    const [loginUserData, setLoginUserData] = React.useState<LoginUserData>({ id: "", name: "", token: "", email: "" });
    const [adminControl, setAdminControl] = React.useState<AdminControl>({ adminControl: false });
    
    useEffect(() => {

        fetch("http://localhost:5000/users")
            .then((response) => response.json())
            .then((json) => {
                setUserData(json);
            });

        fetch("http://localhost:5000/workOrder")
            .then((response) => response.json())
            .then((json) => {
                setWorkOrderData(json)
            })

    }, []);

    const data = { userData, setUserData, loginUserData, setLoginUserData, setWorkOrderData, workOrderData, adminControl, setAdminControl }

    return (
        <GlobalContext.Provider value={data}>
            {children}
        </GlobalContext.Provider>
    )
}
