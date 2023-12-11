import { IconCheck, IconTrash } from '@tabler/icons-react';
import Navbar from 'components/Navbar'
import { GlobalContext } from 'context/GlobalState';
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

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

export default function WorkSpace() {

    const { workOrderData, setChangeWorkOrder, changeWorkOrder, setChangeControl, loginUserData } = useContext(GlobalContext);

    const [filteredData, setFilteredData] = useState<WorkOrderData[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = filteredData.slice(firstIndex, lastIndex);
    const page = Math.ceil(filteredData.length / recordsPerPage);
    const numbers = [...Array(page + 1).keys()].slice(1);

    const navigate = useNavigate();

    const FilterUserData = (value: string) => {
        const filter = workOrderData.filter(user =>
            user.workName.toLowerCase().includes(value.toLowerCase()) ||
            user.billed.toLowerCase().includes(value.toLowerCase()) ||
            user.date.toLowerCase().includes(value.toLowerCase()) ||
            user.notes.toLowerCase().includes(value.toLowerCase()) ||
            user.number.toLowerCase().includes(value.toLowerCase()) ||
            user.workUser.some(index => index.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredData(filter);
    };

    React.useEffect(() => {
        fetch("http://localhost:5000/workOrder")
            .then((response) => response.json())
            .then((json) => {
                setFilteredData(json)
            })
    }, [])

    const PrevFunction = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1)
        }
    };

    const NextFunction = () => {
        if (currentPage !== page) {
            setCurrentPage(currentPage + 1)
        }
    };

    const ChangePages = (id: number) => {
        setCurrentPage(id);
    };

    const handleCheckbox = (id: number) => {
        fetch(`http://localhost:5000/workOrder/${id}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true }),
        })
            .then((updateCompleted) => updateCompleted.json())
            .then((data) => {
                setFilteredData((prevData) =>
                    prevData.map((item) => (item.id === data.id ? data : item))
                );
            });
    };

    const handleDeleteWorkOrder = (id: number) => {
        fetch(`http://localhost:5000/workOrder/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                setFilteredData(filteredData.filter((index) => index.id !== id))
            })
    };

    const handleChangeWorkOrder = (value: WorkOrderData) => {
        const currentChangeWorkOrder = [...changeWorkOrder];
        const updatedChangeWorkOrder = {
            id: value.id,
            workName: value.workName,
            workNotes: value.notes,
            workUser: value.workUser,
        };

        currentChangeWorkOrder.push(updatedChangeWorkOrder);
        setChangeWorkOrder(currentChangeWorkOrder);
        setChangeControl({ changeControl: true });
        navigate(`/user/${loginUserData.id}`);
    };

    React.useEffect(() => {
        FilterUserData(searchInput);
    }, [searchInput]);

    return (
        <>
            <Navbar />

            <section className='container'>
                <div className='row'>
                    <div className='gap'>

                        <div className='table__content'>

                            <form action='' className='input__search'>
                                <label>Work Order Search : </label>
                                <input type='text' placeholder='Exp John Done' value={searchInput} onChange={(e) => setSearchInput(e.target.value)}></input>
                            </form>

                            <div className='table__container'>

                                <table className="customers">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>PRODUCT ID</th>
                                            <th>NAME</th>
                                            <th>USERS</th>
                                            <th>DATE</th>
                                            <th>NOTE</th>
                                            <th>ADMIN</th>
                                            <th>CHANGE</th>
                                            <th>DELETE</th>
                                            <th>COMPLETE</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            records.map((index) => {
                                                return (
                                                    <tr key={index.id} style={{ textDecoration: index.completed ? "line-through" : "" }}>
                                                        <td>{index.id}</td>
                                                        <td>{index.number}</td>
                                                        <td>{index.workName}</td>
                                                        <td>{(index.workUser).toString()}</td>
                                                        <td>{index.date}</td>
                                                        <td>{index.notes}</td>
                                                        <td>{index.billed}</td>
                                                        <td>
                                                            <button className={`button button--change ${index.completed ? "disabled" : ""}`} disabled={index.completed ? true : false} onClick={() => handleChangeWorkOrder(index)}>Change</button>
                                                        </td>
                                                        <td>
                                                            <button className="button button--delete" onClick={() => handleDeleteWorkOrder(index.id)} disabled={index.completed ? true : false}>
                                                                <IconTrash style={{ color: "#DF4949" }} />
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button className={`button button--checked ${index.completed ? "disabled" : ""}`} onClick={() => handleCheckbox(index.id)} disabled={index.completed ? true : false}>
                                                                <IconCheck style={{ color: "#4cbb17" }} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className='table__pagination'>
                                <button onClick={PrevFunction} className='pagination'>Prev</button>
                                {
                                    numbers.map((number, i: number) => {
                                        return (
                                            <button key={i} onClick={() => ChangePages(number)} className={`pagination__item ${currentPage === number ? "active" : ""}`}>{number}</button>
                                        )
                                    })
                                }
                                <button onClick={NextFunction} className='pagination'>Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}
