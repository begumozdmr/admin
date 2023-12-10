import Home from 'components/Home';
import UserHome from 'components/UserHome';
import UserTable from 'pages/UserTable';
import WorkOrder from 'pages/WorkOrder';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

export default function Router() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/user/:id' element={<UserHome />}></Route>
                <Route path='/userTable' element={<UserTable />}></Route>
                <Route path='/work' element={<WorkOrder />}></Route>
            </Routes>
        </>
    )
}
