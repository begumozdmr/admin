import React, { useRef, useState, useContext } from 'react'
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from 'context/GlobalState';

type SwiperType = {
    slidePrev: () => void;
    slideNext: () => void;
};

interface RegisterInputType {
    name: string,
    email: string,
    password: string,
};

interface LoginInputType {
    email: string,
    password: string
};

export default function Home() {

    const { userData, setUserData, setInputControl, inputControl, errorMessage, ErrorFunction } = useContext(GlobalContext);

    const [activeLink, setActiveLink] = useState<number>(1)
    const swiperRef = useRef<SwiperType | null>(null);
    const navigate = useNavigate();
    let randomToken = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    let randomID = require('random-token').create('123456789');

    const handleLinkClick = (id: number) => {
        setActiveLink(id === activeLink ? 0 : id);
    };

    const [registerInput, setRegisterInput] = useState<RegisterInputType>({ name: "", email: "", password: "" });
    const [loginInput, setLoginInput] = useState<LoginInputType>({ email: "", password: "" });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRegisterInput({ ...registerInput, [event.target.name]: event.target.value })
    };

    const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setLoginInput({ ...loginInput, [event.target.name]: event.target.value })
    };

    const RegisterNewUser = () => {

        if (!registerInput.name || !registerInput.email || !registerInput.password) {
            ErrorFunction("Please do not leave blank");
            return;
        }
        else if (registerInput.password.length < 8) {
            ErrorFunction("Password length cannot be less than 8");
            return;
        }

        if (userData) {
            let newUser = {
                id: Number(randomID(4)),
                name: registerInput.name,
                email: registerInput.email,
                password: registerInput.password,
                status: "user",
                token: randomToken(32),
                date: new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + (new Date().getFullYear())
            };

            fetch("http://localhost:5000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            })
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    setUserData([...userData, json]);
                    setRegisterInput({ name: "", email: "", password: "" });
                    setInputControl({ inputControl: false });
                    swiperRef.current?.slideNext();
                    handleLinkClick(2);
                })
        }
    };

    const LoginUser = () => {
        if (!loginInput.email || !loginInput.password) {
            ErrorFunction("Please do not leave blank");
            return;
        }

        fetch(`http://localhost:5000/users?email=${loginInput.email}&password=${loginInput.password}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((json) => {
                const user = json[0];

                if (json.length === 0) {
                    ErrorFunction("User Error");
                    return;
                }

                fetch(`http://localhost:5000/users/${user.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login: true }),
                })
                    .then((updateUser) => updateUser.json())

                localStorage.setItem("token", user.token);
                navigate(`/user/${user.id}`);
            });
    }

    return (
        <>
            <section className='home__page__container'>
                <div className='home__page__content'>

                    <h1> WELCOME UMTAN</h1>

                    <div className='grid__2'>
                        <button className={`home__page__button ${activeLink === 1 ? "active" : ""}`} onClick={() => { swiperRef.current?.slidePrev(); handleLinkClick(1) }}>REGISTER</button>
                        <button className={`home__page__button home__page__button--transparent ${activeLink === 2 ? "active" : ""}`} onClick={() => { swiperRef.current?.slideNext(); handleLinkClick(2) }}>LOGIN</button>
                    </div>


                    <Swiper
                        modules={[Navigation]}
                        className="mySwiper"
                        onSwiper={(swiper: SwiperType) => {
                            swiperRef.current = swiper;
                        }}
                    >
                        <SwiperSlide>
                            <div className='form__container'>
                                <h3 className={`error__title ${inputControl.inputControl ? "active" : ""}`}>{errorMessage.errorMessage}</h3>

                                <form action=''>
                                    <label>* Name Surname : </label>
                                    <input type='text' placeholder='Exp John Doe' required name='name' value={registerInput.name} onChange={handleOnChange} className={`${inputControl.inputControl ? "error" : ""}`}></input>

                                    <label>* Email :  </label>
                                    <input type='text' placeholder='info@gmail.com' required name='email' value={registerInput.email} onChange={handleOnChange} className={`${inputControl.inputControl ? "error" : ""}`}></input>

                                    <label>* Password : </label>
                                    <input type='password' placeholder='********' required name='password' value={registerInput.password} onChange={handleOnChange} className={`${inputControl.inputControl ? "error" : ""}`}></input>
                                </form>

                                <div>
                                    <button type='submit' className='home__page__button home__page__button--blue' onClick={() => RegisterNewUser()}>Create Account</button>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className='form__container'>
                                <h3 className={`error__title ${inputControl ? "active" : ""}`}>{errorMessage.errorMessage}</h3>
                                <form action=''>
                                    <label>* Email :  </label>
                                    <input type='text' placeholder='info@gmail.com' required name='email' value={loginInput.email} onChange={handleLoginInputChange} className={`${inputControl.inputControl ? "error" : ""}`}></input>

                                    <label>* Password : </label>
                                    <input type='password' placeholder='********' required name='password' value={loginInput.password} onChange={handleLoginInputChange} className={`${inputControl.inputControl ? "error" : ""}`}></input>
                                </form>

                                <div>
                                    <button type='submit' className='home__page__button home__page__button--blue' onClick={() => LoginUser()}>Login</button>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section>
        </>
    )
}
