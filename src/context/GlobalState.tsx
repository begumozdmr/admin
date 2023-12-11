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

interface ChangeWorkOrder {
    id: number,
    workName: string,
    workNotes: string,
    workUser: string[]
}
type SetChangeWorkOrder = (changeWorkOrder: ChangeWorkOrder[]) => void

interface ChangeControl {
    changeControl: boolean
}
type SetChangeControl = (changeControl: ChangeControl) => void

interface InputControl {
    inputControl: boolean
}
type SetInputControl = (inputControl: InputControl) => void

interface ErrorMessage {
    errorMessage: string
}
type SetErrorMessage = (errorMessage: ErrorMessage) => void

export type Type = {
    userData: UserData[];
    setUserData: SetUserData;
    loginUserData: LoginUserData;
    setLoginUserData: SetLoginUserData;
    workOrderData: WorkOrderData[];
    setWorkOrderData: SetWorkOrderData;
    adminControl: AdminControl;
    setAdminControl: SetAdminControl;
    changeWorkOrder: ChangeWorkOrder[];
    setChangeWorkOrder: SetChangeWorkOrder;
    changeControl: ChangeControl;
    setChangeControl: SetChangeControl;
    inputControl: InputControl;
    setInputControl: SetInputControl;
    errorMessage: ErrorMessage;
    setErrorMessage: SetErrorMessage;
    ErrorFunction: (name: string) => void;
};

export const GlobalContext = createContext<Type>({} as Type);

export const GlobalProvider = ({ children }: ContextProps) => {

    const [userData, setUserData] = React.useState<UserData[]>([]);
    const [workOrderData, setWorkOrderData] = React.useState<WorkOrderData[]>([]);
    const [changeWorkOrder, setChangeWorkOrder] = React.useState<ChangeWorkOrder[]>([]);
    const [loginUserData, setLoginUserData] = React.useState<LoginUserData>({ id: "", name: "", token: "", email: "" });
    const [adminControl, setAdminControl] = React.useState<AdminControl>({ adminControl: false });
    const [changeControl, setChangeControl] = React.useState<ChangeControl>({ changeControl: false });
    const [inputControl, setInputControl] = React.useState<InputControl>({ inputControl: false });
    const [errorMessage, setErrorMessage] = React.useState<ErrorMessage>({ errorMessage: "" });

    const ErrorFunction = (name: string) => {
        setInputControl({ inputControl: true });
        setErrorMessage({ errorMessage: name });
    };

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

    const data = {
        userData, setUserData,
        loginUserData, setLoginUserData,
        setWorkOrderData, workOrderData,
        adminControl, setAdminControl,
        changeWorkOrder, setChangeWorkOrder,
        changeControl, setChangeControl,
        inputControl, setInputControl,
        errorMessage, setErrorMessage,
        ErrorFunction
    }

    return (
        <GlobalContext.Provider value={data}>
            {children}
        </GlobalContext.Provider>
    )
}
