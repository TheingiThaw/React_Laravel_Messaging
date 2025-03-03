import { useEventBus } from '@/EventBus';
import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import GroupAvatar from './GroupAvatar';
import UserAvatar from './UserAvatar';

const Toast = () => {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on('newMessageNotification', ({ message, user, group_id }) => {
            const uuid = uuidv4();

            setToasts((oldToasts) => [...oldToasts, { message, uuid, user, group_id }]);

            console.log(user, message, group_id);

            setTimeout(() => {
                setToasts(oldToasts => oldToasts.filter(toast => toast.uuid !== uuid));
            }, 5000);
        })
    }, [on]);

    return (
        <div className="toast toast-top toast-center">
            {toasts.map((toast) => (
                <div key={toast.uuid} className="alert bg-blue-100">
                    <Link
                        href={toast.group_id ? route('chat.group', toast.group_id) : route('chat.user', toast.user)}
                    >
                        {toast.group_id ? <GroupAvatar /> : <UserAvatar conversation={toast.user} />}
                        <span className='ps-5'>{toast.message}</span>
                    </Link>

                </div>
            ))}
        </div>
    )
}

export default Toast
