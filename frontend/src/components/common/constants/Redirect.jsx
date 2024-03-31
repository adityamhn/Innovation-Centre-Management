"use client";

import { updateUser } from '@/store/user.slice';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux';

const Redirect = ({ to, update }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (update) {
            dispatch(updateUser(update));
        }
        if (to) {
            router.push(to);
        }
    }, [to, update])

    return <></>;
}

export default Redirect