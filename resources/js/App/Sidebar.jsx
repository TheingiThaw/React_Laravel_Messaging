import { usePage } from '@inertiajs/react';
import Conversation from './Conversation';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react';
import TextInput from '@/Components/TextInput';
import Echo from "../echo";
import { useEventBus } from '@/EventBus';

const Sidebar = () => {

    const page = usePage();
    const [conversations, setConversations] = useState([]);
    const selectedConversation = page.props.selectedConversation;
    const [sortedConversation, setSortedConversation] = useState([]);
    const [localConversation, setLocalConversation] = useState([]);
    const { on } = useEventBus();

    const [onlineUsers, setOnlineUsers] = useState([]);

    // Handle WebSocket Users
    useEffect(() => {
        Echo.join('online')
            .here((users) => setOnlineUsers(users))
            .joining((user) => console.log('joining', user))
            .leaving((user) => console.log('leaving', user))
            .error((error) => console.error(error));
    }, []);

    const isUserOnline = (userId) => {
        return onlineUsers.some((user) => user.id === userId);
    };

    // Sorting Conversations
    useEffect(() => {
        const sorted = [...localConversation].sort((a, b) => {
            if (a.blocked_at && b.blocked_at) return a.blocked_at > b.blocked_at ? -1 : 1;
            if (a.blocked_at) return 1;
            if (b.blocked_at) return -1;
            if (a.last_message_date && b.last_message_date) return b.last_message_date.localeCompare(a.last_message_date);
            if (a.last_message_date) return -1;
            if (b.last_message_date) return 1;
            return 0;
        });
        setSortedConversation(sorted);
    }, [localConversation]);

    // Handle Search
    const onSearch = (e) => {
        const search = e.target.value.toLowerCase();
        const filteredConversations = conversations.filter((conversation) =>
            conversation.name.toLowerCase().includes(search)
        );
        setLocalConversation(filteredConversations);
    };

    const messageCreate = (message) => {

        setLocalConversation(prevConversations => {
            if (!prevConversations || prevConversations.length === 0) {
                console.log('cannot loop'); // Logs when array is empty
                return [];
            }

            return prevConversations.map(prevConversation => {
                if (message &&
                    message.group_id &&
                    prevConversation.group_id &&
                    message.group_id == prevConversation.group_id
                ) {
                    return {
                        ...prevConversation,
                        last_message: message.message,
                        last_message_date: message.created_at || prevConversation.last_message_date,
                    };
                }

                if (
                    message &&
                    message.receiver_id &&
                    prevConversation.is_user &&
                    (message.sender_id == prevConversation.id || message.receiver_id == prevConversation.id.toString())
                ) {
                    return {
                        ...prevConversation,
                        last_message: message.message,
                        last_message_date: message.created_at,
                    };
                }
                return prevConversation;
            })
        })
    }

    const messageDelete = ({ prevMessage, message }) => {
        // console.log('localConversation before update:', localConversation); // Debugging
        // console.log('message:', message); // Debugging
        // console.log('delete message', prevMessage);
        setLocalConversation(prevConversations => {
            if (!prevConversations || prevConversations.length === 0) {
                console.log('cannot loop'); // Logs when array is empty
                return [];
            }

            return prevConversations.map(prevConversation => {
                if (prevMessage.last_message &&
                    prevMessage.last_message.group_id &&
                    prevConversation.group_id &&
                    prevMessage.last_message.group_id == prevConversation.group_id
                ) {
                    return {
                        ...prevConversation,
                        last_message: message.message,
                        last_message_date: message.created_at || prevConversation.last_message_date,
                    };
                }

                if (prevMessage.last_message &&
                    prevMessage.last_message.receiver_id &&
                    prevConversation.is_user &&
                    (prevMessage.last_message.sender_id == prevConversation.id || prevMessage.last_message.receiver_id == prevConversation.id)
                ) {
                    // console.log('message deleted', prevMessage.last_message);
                    return {
                        ...prevConversation,
                        last_message: message.message,
                        last_message_date: message.created_at || prevConversation.last_message_date,
                    };
                }
                return prevConversation;
            })
        })
    }

    useEffect(() => {
        const offCreated = on('message.created', messageCreate);
        const offDeleted = on('message.deleted', messageDelete);

        return () => {
            offCreated();
            offDeleted();
        };
    }, []);

    useEffect(() => {
        // console.log("page.props.auth.conversations:", page.props.auth.conversations);
        if (Array.isArray(page.props.auth.conversations)) {
            setLocalConversation(page.props.auth.conversations);
        }
    }, [page.props.auth.conversations]);


    return (
        <>
            <div className=' h-[91vh] w-full flex-1 overflow-hidden flex flex-col bg-white'>
                <div className={`transition-all w-full sm:w-[220px] md:w-[300px] flex flex-col overflow-hidden ${selectedConversation ? '-ml-[100%]' : ''}`}></div>
                <div className=' w-9/12 mx-auto text-base-content mt-5 flex justify-between'>
                    <h1 className='text-2xl font-bold'>Chat</h1>
                    <button >
                        <EllipsisVerticalIcon className='h-5 w-5' />
                    </button>
                </div>

                <div className="w-9/12 my-5 mx-auto">
                    <TextInput
                        onKeyUp={onSearch} type='text' placeholder='Search' className='w-full' />
                </div>

                <div className={`overflow-y-scroll flex-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}>
                    {sortedConversation && sortedConversation.map((conversation, index) => (
                        <Conversation
                            key={conversation.is_group ? `group_${conversation.id}` : `user_${conversation.id}`}
                            isUserOnline={conversation?.id ? isUserOnline(conversation.id) : false}
                            conversation={conversation}
                            selectedConversation={selectedConversation} />
                    ))}

                </div>
            </div>
        </>
    )
}

export default Sidebar;
