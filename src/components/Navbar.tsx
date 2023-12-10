import React, { useContext, useEffect, useState } from 'react';
import { IconFileInvoice, IconTable, IconUser, IconUserCircle, IconUsers } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";
import { IconSettings } from '@tabler/icons-react';
import { IconLogout } from '@tabler/icons-react';
import { GlobalContext } from 'context/GlobalState';

export default function Navbar() {

    const { loginUserData, adminControl, setLoginUserData, setAdminControl } = useContext(GlobalContext);
    const [menuActive, setMenuActive] = useState<boolean>(false);
    const navigate = useNavigate();

    const LogOutFunction = () => {
        fetch(`http://localhost:5000/users/${loginUserData.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: false }),
        })
            .then((updateUser) => updateUser.json())
            .then(() => {
                localStorage.clear();
                navigate("/");
                setLoginUserData({ id: "", name: "", token: "", email: "" });
                setAdminControl({ adminControl: false });
            })
    };

    const AdminControlFunction = () => {
        fetch(`http://localhost:5000/users?token=${localStorage.getItem("token")}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => response.json())
            .then((data) => {
                let status = data[0];
                if (status) {
                    setLoginUserData({ id: status.id, name: status.name, token: status.token, email: status.email });
                    

                    if (status.status === "admin") {
                        setAdminControl({ adminControl: true });
                    }
                    else {
                        setAdminControl({ adminControl: false });
                    }
                }
            })
    };

    useEffect(() => {
        AdminControlFunction();
    }, [])

    return (
        <>
            <header>
                <nav>
                    <div className='navbar__container'>
                        <div className='navbar__row'>

                            <div className='navbar__logo'>
                                <img src={require("../img/logo.png")} alt='logo'></img>
                                <h1>ENNE</h1>
                            </div>

                            <div className='navbar__logo'>
                                <h3>Welcome {loginUserData.name}</h3>
                                <div className='navbar__button' onClick={() => setMenuActive(!menuActive)}>
                                    <button className='button'>
                                        <IconUser width={"18px"} height={"18px"} />
                                    </button>

                                    <div className={`users__profil__menu__container ${menuActive ? "active" : ""}`}>
                                        <div className='users__profil__content'>
                                            <IconUserCircle />
                                            <Link to="#">Profil</Link>
                                        </div>

                                        <div className='users__profil__content'>
                                            <IconSettings />
                                            <Link to="#">Settings</Link>
                                        </div>

                                        {
                                            adminControl.adminControl ?
                                                <>
                                                    <div className='users__profil__content'>
                                                        <IconUsers />
                                                        <Link to="/userTable">Users</Link>
                                                    </div>

                                                    <div className='users__profil__content'>
                                                        <IconTable />
                                                        <Link to="/work">Work Order Table</Link>
                                                    </div>

                                                    <div className='users__profil__content'>
                                                        <IconFileInvoice />
                                                        <Link to={`/user/${loginUserData.id}`}>Work Order</Link>
                                                    </div>
                                                </>
                                                :
                                                null
                                        }

                                        <div className='users__profil__content'>
                                            <IconLogout />
                                            <Link to="#" onClick={() => LogOutFunction()}>Log Out</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}
