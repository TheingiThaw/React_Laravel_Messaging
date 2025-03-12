import React from 'react';
import UserAvatar from './UserAvatar';
import GroupAvatar from './GroupAvatar';
import { usePage } from '@inertiajs/react';
import DescriptionPopover from './DescriptionPopover';
import UsersPopover from './UserPopover';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useEventBus } from '@/EventBus';

const ChatHeader = ({ selectedConversation }) => {
    // console.log(selectedConversation);
    const authUser = usePage().props.auth.user;
    const { emit } = useEventBus();

    const onDeleteGroup = () => {
        if (!window.confirm('Are you sure you want to delete this group?')) {
            return;
        }
        axios.delete(route('group.destroy', selectedConversation.id))
            .then(() => {
                emit('toast.show', { message: `Group ${selectedConversation.name} deleted successfully` });
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="flex justify-between items-center p-2 h-auto border-bottom border-gray-800">
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
                <div className="flex items-center justify-center h-auto">
                    <div className="flex gap-3">
                        <DescriptionPopover conversation={selectedConversation} />

                        <UsersPopover className="bg-red-400" conversation={selectedConversation} />

                        {selectedConversation?.owner_id === authUser?.id && (
                            <>
                                <div className='tooltip tooltip-left' data-tooltip="Edit Group">
                                    <button
                                        onClick={(ev) => {
                                            emit('GroupModal.show', selectedConversation)
                                        }}
                                        className='text-black/60 hover:text-black/90'>
                                        <PencilSquareIcon className='w-6' />
                                    </button>
                                </div>
                                <div className='tooltip tooltip-right' data-tooltip="Delete Group">
                                    <button onClick={onDeleteGroup}
                                        className='text-black/60 hover:text-black/90'>
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
