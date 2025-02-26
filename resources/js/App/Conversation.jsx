import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import UserAvatar from './UserAvatar'
import GroupAvatar from './GroupAvatar'
import UserOptionsDropdown from './UserOptionsDropdown'
import { Link, usePage } from '@inertiajs/react'
import { formatDateShort } from '@/helpers'

const Conversation = ({ conversation, isUserOnline, selectedConversation }) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = "border-transparent";

    if (selectedConversation) {
        if (!selectedConversation.is_group &&
            !conversation.is_group &&
            selectedConversation.id === conversation.id
        ) {
            classes = "border-blue-500"
        }

        if (selectedConversation.is_group &&
            conversation.is_group &&
            selectedConversation.id === conversation.id
        ) {
            classes = "border-blue-500"
        }
    }




    return (
        <Link
            href={
                conversation.is_group
                    ? route('chat.group', conversation)
                    : route('chat.user', conversation)
            }
            preserveState
        >
            <div className={"hover:bg-slate-100 conversation-item items-center gap-2 p-2 transition-all border-1-4 cursor-pointer py-2" + classes +
                (conversation.is_user && currentUser.is_admin
                    ? "pr-2"
                    : "pr-4"
                )
            }>
                <div className={`w-10/12 mx-auto grid ${currentUser.is_admin ? 'grid-cols-5' : 'grid-cols-4'}`}>
                    <div>

                        {conversation.is_user ? <UserAvatar conversation={conversation} isUserOnline={isUserOnline} /> : ''}
                        {conversation.is_group && <GroupAvatar />}

                    </div>

                    <div className={'block col-span-3 flex-1 max-w-full overflow-hidden' + (
                        conversation.is_user && conversation.blocked_at
                            ? 'opacity-50'
                            : ''
                    )} >
                        <div className='flex gap-1 justify-between items-center'>
                            <h2 className='text-ellipsis overflow-hidden font-semibold text-nowrap'>{conversation.name}</h2>
                            <p className=' text-xs text-nowrap mt-1 text-gray-500'>{formatDateShort(new Date(conversation.last_message_date))}</p>
                        </div>
                        <p className={`text-nowrap overflow-hidden text-ellipsis ${!conversation.last_message && 'italic'}`}>{conversation.last_message ? conversation.last_message : 'Shared Attachments'}</p>
                    </div>

                    {currentUser.is_admin && conversation.is_user ? (
                        <div className='flex my-auto justify-end'>
                            <UserOptionsDropdown conversation={conversation} />
                        </div>
                    ) : ''}
                </div>
            </div>
        </Link >
    )
}

export default Conversation
