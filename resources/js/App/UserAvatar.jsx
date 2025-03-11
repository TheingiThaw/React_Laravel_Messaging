import React from 'react'

const UserAvatar = ({ conversation, isUserOnline }) => {
    const onlineStatus = isUserOnline ? 'online' : 'offline';

    const senderUser = conversation.users?.find(user => user.id === conversation.sender_id);

    console.log('senderUser', senderUser);

    return (
        <div className={`avatar ${onlineStatus}`}>
            {conversation.avatar ? (
                <div className="w-12 rounded-full">
                    <img src={conversation.avatar} alt={`${conversation.name}'s avatar`} />
                </div>
            ) : (
                <div className="bg-neutral text-neutral-content w-12 rounded-full flex items-center justify-center">
                    <span className="text-xl">
                        {conversation.is_user
                            ? conversation.name?.charAt(0)
                            : senderUser?.name?.charAt(0) || '?'}
                    </span>
                </div>

            )}
        </div>

    )
}

export default UserAvatar
