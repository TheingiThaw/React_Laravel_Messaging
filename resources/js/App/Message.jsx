import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";

const Message = ({ message, selectedConversation }) => {
    const page = usePage();
    const currentUser = page.props.auth.user;

    console.log(message);
    console.log(selectedConversation);

    return (
        <div className="p-3">
            <div className={`chat ${message.sender_id === currentUser.id ? 'chat-end' : 'chat-start'}`}>
                <div className="chat-image avatar">
                    {message.receiver_id ? <UserAvatar conversation={selectedConversation} /> : <GroupAvatar conversation={selectedConversation} />}
                </div>
                <div className="chat-header">
                    {message.sender_id === currentUser.id ? '' : selectedConversation.name}
                    <time className="text-xs opacity-50">12:45</time>
                </div>
                {message.sender_id !== currentUser.id && (
                    <div className="flex items-center justify-start">
                        <div className="chat-bubble bg-gray-200 text-black">{message.message}</div>
                        <EllipsisVerticalIcon className="w-4 h-4 text-gray-500 ml-3" />
                    </div>
                )}
                {message.sender_id === currentUser.id && (
                    <div className="flex items-center justify-end">
                        <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
                        <div className="chat-bubble bg-blue-500 text-white">{message.message}</div>
                    </div>
                )}
                {message.sender_id !== currentUser.id && <div className="chat-footer opacity-50">Delivered</div>}
                {message.sender_id === currentUser.id && <div className="chat-footer opacity-50">Seen at 12:46</div>}
            </div>
        </div>
    )
}

export default Message;
