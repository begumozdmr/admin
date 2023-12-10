import Navbar from 'components/Navbar';
import { GlobalContext } from 'context/GlobalState';
import React, { useContext, useState } from 'react'

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

export default function UserTable() {

    const { userData } = useContext(GlobalContext);
    const [filteredData, setFilteredData] = useState<UserData[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage = 9;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = filteredData.slice(firstIndex, lastIndex);
    const page = Math.ceil(filteredData.length / recordsPerPage);
    const numbers = [...Array(page + 1).keys()].slice(1);

    const [searchInput, setSearchInput] = useState<string>("");

    const FilterUserData = (value: string) => {
        const filter = userData.filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase()) ||
            user.date.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filter);
    }

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

    const handleClickDeleteUser = (id: number) => {
        fetch(`http://localhost:5000/users/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                setFilteredData(filteredData.filter((index) => index.id !== id))
            })
    };

    React.useEffect(() => {
        fetch("http://localhost:5000/users")
            .then((response) => response.json())
            .then((json) => {
                setFilteredData(json);
            });
    }, []);

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
                                <label>User Search : </label>
                                <input type='text' placeholder='Exp John Done' value={searchInput} onChange={(e) => setSearchInput(e.target.value)}></input>
                            </form>

                            <div className='table__container'>

                                <table className="customers">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>NAME</th>
                                            <th>EMAIL</th>
                                            <th>DATE</th>
                                            <th>DELETE</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            records.map((index) => {
                                                return (
                                                    <tr key={index.id}>
                                                        <td>{index.id}</td>
                                                        <td>{index.name}</td>
                                                        <td>{index.email}</td>
                                                        <td>{index.date}</td>
                                                        <td>
                                                            <button className='button button--delete' onClick={() => handleClickDeleteUser(index.id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

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
                </div>
            </section>
        </>
    )
}
