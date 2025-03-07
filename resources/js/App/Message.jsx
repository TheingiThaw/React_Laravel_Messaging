import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import { formatDateLong, formatDateShort } from "@/helpers";
import MessageAttachments from "./MessageAttachments";
import MessageDropdownOptions from "./MessageDropdownOptions";

const Message = ({ message, selectedConversation, onAttachmentClick }) => {
    const page = usePage();
    const currentUser = page.props.auth.user;

    // console.log('message-attachments', message.attachments);

    return (
        <div className="p-3">
            <div className={`chat ${message.sender_id === currentUser.id ? 'chat-end' : 'chat-start'}`}>
                <div className="chat-image avatar">
                    {message.receiver_id ? <UserAvatar conversation={selectedConversation} /> : <GroupAvatar conversation={selectedConversation} />}
                </div>
                <div className="chat-header">
                    {message.sender_id === currentUser.id ? '' : selectedConversation.name}
                    <time className="text-xs opacity-50">{formatDateLong(new Date(message.created_at))}</time>
                </div>
                <div className="flex items-center">
                    {message.sender_id === currentUser.id ? <MessageDropdownOptions message={message.id} /> : ''}
                    <div className={`chat-bubble text-black ${message.sender_id === currentUser.id ? 'bg-blue-300' : 'bg-gray-200'}`}>
                        {message.message}
                        <MessageAttachments
                            attachments={message.attachments}
                            attachmentClick={(attachment, index) => onAttachmentClick(message.attachments, index)}
                        />
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Message;
