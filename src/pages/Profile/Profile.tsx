import React from 'react'
import avatar from '../../assets/images/image-2.png'
import { AiOutlineLogout } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logout } from '../../store/auth-reducer';
import { Navigate } from 'react-router-dom';
import { BsCamera } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';

const Profile = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
    const onClickHandler = () => {
        dispatch(logout())
    }

    console.log(isLoggedIn);
    

    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }

    return (
        <div className="profile">
            <div className="container">
                <div className="auth-form">
                    <h1 className="title b-title bt26 semibold align-center">Personal Information</h1>
                    <div className="avatar-wrapper">
                        <div className="avatar">
                            <img src={avatar} alt="" />
                        </div>
                        <div className="icon">
                            <BsCamera />
                        </div>
                    </div>
                    <div className="name-wrapper">
                        <div className="name b-title bt20 medium">Ivan</div>
                        <div className="icon edit-name">
                            <CiEdit />
                        </div>
                    </div>
                    <div className="email b-title bt14 color6 align-center">j&johnson@gmail.com</div>
                    <button className='styled-btn styled-btn-2' onClick={onClickHandler}><AiOutlineLogout />Log out</button>
                </div>
            </div>
        </div>
    )
}

export default Profile