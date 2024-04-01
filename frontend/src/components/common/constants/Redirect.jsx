"use client";

import { logoutAccount, updateUser } from '@/store/user.slice';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux';

const Redirect = ({ to, update, logout }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    console.log("logout",logout)

    React.useEffect(() => {
        if (update) {
            dispatch(updateUser(update));
        }
        if (logout) {
            dispatch(logoutAccount());
        }
        if (to) {
            router.push(to);
        }
    }, [to, update, logout])

    return <></>;
}

export default Redirect