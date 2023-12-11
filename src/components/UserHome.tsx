import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { GlobalContext } from 'context/GlobalState'
import AdminHome from './AdminHome';
import { IconCheck } from '@tabler/icons-react';

interface FilterTable {
  id: number,
  workName: string,
  date: string,
  completed: boolean,
  workUser: string[],
  notes: string,
  billed: string,
  number: string
}

export default function UserHome() {

  const { adminControl, workOrderData, loginUserData } = useContext(GlobalContext);
  const [filteredData, setFilteredData] = useState<FilterTable[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/workOrder")
      .then((response) => response.json())
      .then((data) => {
        const filter = data.filter(((index: { workUser: string[]; }) => index.workUser.find(user => user === loginUserData.name)));
        setFilteredData(filter);
      })

  }, [workOrderData, loginUserData])

  const handleCheckbox = (id: number) => {
    fetch(`http://localhost:5000/workOrder/${id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    })
      .then((updateCompleted) => updateCompleted.json())
      .then((data) => {
        setFilteredData((index) => index.map((item) => item.id === data.id ? data : item));
      })
  };

  return (
    <>
      <Navbar />

      <section className='container'>
        <div className='row'>
          <div className='gap'>
            {
              adminControl.adminControl ?

                <AdminHome />
                :
                <>
                  <div className='table__content'>

                    <div className='table__container'>

                      <table className="customers">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>INV ID</th>
                            <th>NAME</th>
                            <th>USERS</th>
                            <th>DATE</th>
                            <th>NOTE</th>
                            <th>ADMIN</th>
                            <th>CHECK</th>
                          </tr>
                        </thead>

                        <tbody>
                          {
                            filteredData.map((index) => {
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
                  </div>
                </>
            }
          </div>
        </div>
      </section>
    </>
  )
}
