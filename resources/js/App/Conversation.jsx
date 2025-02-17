import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import UserAvatar from './UserAvatar'
import GroupAvatar from './GroupAvatar'
import UserOptionsDropdown from './UserOptionsDropdown'
import { Link } from '@inertiajs/react'
import { formatDateShort } from '@/helpers'

const Conversation = ({ conversation, isUserOnline, selectedConversation }) => {
    const classes = {};


    return (
        <Link
            href={
                conversation.is_group
                    ? route('chat.group', conversation)
                    : route('chat.user', conversation)
            }
            preserveState
        >
            <div className={'hover:bg-slate-100 cursor-pointer py-2'}>
                <div className='w-11/12 mx-auto grid grid-cols-5'>
                    <div>

                        {conversation.is_user ? <UserAvatar conversation={conversation} isUserOnline={isUserOnline} /> : ''}
                        {conversation.is_group && <GroupAvatar />}

                    </div>

                    <div className='block col-span-3'>
                        <div className='flex justify-between'>
                            <h2 className='text-ellipsis overflow-hidden text-nowrap'>{conversation.name}</h2>
                            <p className=' text-xs mt-1 text-gray-500'>{formatDateShort(new Date(conversation.last_message_date))}</p>
                        </div>
                        <p className='text-nowrap overflow-hidden text-ellipsis '>{conversation.last_message ? conversation.last_message : ''}</p>
                    </div>

                    <div className='flex my-auto justify-end'>
                        <UserOptionsDropdown conversation={conversation} />
                    </div>
                </div>
            </div>
        </Link >
    )
}

export default Conversation
