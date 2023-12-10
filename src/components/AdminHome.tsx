import { GlobalContext } from 'context/GlobalState';
import React, { useContext, useState } from 'react'
import Load from './Load';

export default function AdminHome() {

    const { workOrderData, setWorkOrderData, userData, loginUserData } = useContext(GlobalContext);
    const [inputWorkOrder, setInputWorkOrder] = useState({ workName: "", workNotes: "", workOrder: [] as string[] });
    const [workId, setWorkId] = useState<string>("");

    let randomID = require('random-token').create('123456789');

    React.useEffect(() => {
        setWorkId(randomID(5));
    }, [])

    const handleAddWorkOrder = () => {

        let newWorkOrder = {
            id: Number(randomID(4)),
            workName: inputWorkOrder.workName,
            date: new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + (new Date().getFullYear()),
            completed: false,
            workUser: inputWorkOrder.workOrder,
            notes: inputWorkOrder.workNotes,
            billed: loginUserData.name,
            number: `INV-${workId}`
        };

        fetch("http://localhost:5000/workOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newWorkOrder)
        })
            .then((response) => response.json())
            .then((json) => {
                setWorkOrderData([...workOrderData, json])
                setInputWorkOrder({ workName: "", workNotes: "", workOrder: [] })
            })
            .finally(() => {
                setTimeout(() => {
                    <Load />
                }, 3000)
            })
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = event.target;
        setInputWorkOrder((prevInput) => ({
            ...prevInput,
            [name]: value,
        }));
    };

    const handleUserSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setInputWorkOrder((prevInput) => ({
            ...prevInput,
            workOrder: selectedOptions,
        }));
    };

    return (
        <>
            <div className='invoice__container'>
                <div className='table__container'>
                    <table className='customers customers--invoice'>

                        <tbody>
                            <tr>
                                <th>Billed To</th>
                                <td>{loginUserData.name}</td>
                            </tr>

                            <tr>
                                <th>Address</th>
                                <td>1917 Hidden Meadow Drive</td>
                            </tr>

                            <tr>
                                <th>Email</th>
                                <td>{loginUserData.email}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <div className='table__container table__container--invoice'>
                    <table className='customers customers--invoice'>

                        <tbody>
                            <tr>
                                <th>Date</th>
                                <td>{new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + (new Date().getFullYear())}</td>
                            </tr>

                            <tr>
                                <th>Number</th>
                                <td>INV-{workId}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='form__action__container'>
                <form action='' className='work__order__inputs'>

                    <label>Work Name : </label>
                    <input type='text' name='workName' value={inputWorkOrder.workName} onChange={handleInputChange}></input>

                    <label>Work User : </label>
                    <select multiple name='workOrder' value={inputWorkOrder.workOrder} onChange={handleUserSelection}>
                        {userData.map((index) => {
                            return (
                                <option key={index.id} value={index.name}>{index.name}</option>
                            )
                        })}
                    </select>

                    <label>Work Notes : </label>
                    <textarea name='workNotes' value={inputWorkOrder.workNotes} onChange={handleInputChange} />

                    <button className='button button--change' onClick={() => handleAddWorkOrder()}>Add Work Order</button>
                </form>
            </div>
        </>
    )
}
