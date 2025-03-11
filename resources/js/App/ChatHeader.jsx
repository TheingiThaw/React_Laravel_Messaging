import React from 'react';
import UserAvatar from './UserAvatar';
import GroupAvatar from './GroupAvatar';
import { usePage } from '@inertiajs/react';
import DescriptionPopover from './DescriptionPopover';
import UsersPopover from './UserPicker';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/16/solid';

const ChatHeader = ({ selectedConversation }) => {
    console.log(selectedConversation);
    const authUser = usePage().props.auth.user;

    const onDeleteGroup = () => {
        console.log('Delete Group');
    };

    return (
        <div className="flex justify-between items-center p-2 h-auto">
            <div className="flex gap-3 p-2">
                <div className="flex items-center">
                    <div className="avatar">
                        <div className="w-12">
                            {selectedConversation ? (
                                selectedConversation.is_group ? (
                                    <GroupAvatar conversation={selectedConversation} />

                                ) : (
                                    <UserAvatar conversation={selectedConversation} />
                                )
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className=" block justify-center items-center">
                    <h1>{selectedConversation?.name || 'Group'}</h1>
                    {selectedConversation?.is_group && <p className="text-xs text-slate-400">4 users</p>}
                </div>
            </div>
            {selectedConversation?.is_group && (
                <div className="flex items-center justify-center bg-black h-auto">
                    <div className="flex gap-3">
                        <DescriptionPopover className='bg-blue-300 h-auto' conversation={selectedConversation} />

                        <UsersPopover users={selectedConversation.users} />

                        {selectedConversation?.owner_id === authUser?.id && (
                            <>
                                <div className='tooltip tooltip-left'>
                                    <button>
                                        <PencilSquareIcon className='w-6' />
                                    </button>
                                </div>
                                <div className='tooltip tooltip-right'>
                                    <button onClick={onDeleteGroup}>
                                        <TrashIcon className='w-6' />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatHeader;
