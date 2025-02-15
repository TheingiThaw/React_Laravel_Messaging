import { EllipsisVerticalIcon } from "@heroicons/react/16/solid"

const Message = ({ messages }) => {
    return (
        <div className="p-3">
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS chat bubble component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                </div>
                <div className="chat-header">
                    Obi-Wan Kenobi
                    <time className="text-xs opacity-50">12:45</time>
                </div>
                <div className="flex items-center">
                    <div className="chat-bubble">You were the Chosen One!</div>
                    <EllipsisVerticalIcon className="w-4 h-4 text-gray-500 ms-3" />
                </div>
                <div className="chat-footer opacity-50">Delivered</div>
            </div>
            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS chat bubble component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                </div>
                <div className="chat-header">
                    Anakin
                    <time className="text-xs opacity-50">12:46</time>
                </div>
                <div className="flex items-center">
                    <EllipsisVerticalIcon className="w-4 h-4 text-gray-500 me-3" />
                    <div className="chat-bubble">I hate you!</div>
                </div>
                <div className="chat-footer opacity-50">Seen at 12:46</div>
            </div>
        </div>
    )
}

export default Message
