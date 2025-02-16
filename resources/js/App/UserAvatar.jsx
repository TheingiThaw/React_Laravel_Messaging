import React from 'react'

const UserAvatar = ({ conversation, isUserOnline }) => {
    const onlineStatus = isUserOnline ? 'online' : 'offline';

    return (
        <div className={`avatar ${onlineStatus}`}>
            {conversation.avatar &&
                <div className="w-12 rounded-full">
                    <img src={conversation.avatar} />
                </div>}
            {!conversation.avatar &&
                <div className={`avatar ${onlineStatus} placeholder`}>
                    <div className="bg-neutral text-neutral-content w-12 rounded-full">
                        <span className="text-xl">{conversation.name && conversation.name.substring(0, 1)}</span>
                    </div>
                </div>}
        </div>

    )
}

export default UserAvatar
