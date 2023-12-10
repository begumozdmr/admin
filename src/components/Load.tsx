import React from 'react'

export default function Load() {
    return (
        <section>
            <div className='load__container'>
                <img src={require("../img/logo.png")} alt='logo'></img>
            </div>
        </section>
    )
}
