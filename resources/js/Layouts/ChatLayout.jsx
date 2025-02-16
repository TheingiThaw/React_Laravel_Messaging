import { usePage } from "@inertiajs/react";
import Message from "../App/Message"
import MessageInput from "../App/MessageInput"
import ChatHeader from "@/App/ChatHeader";

const ChatLayout = ({ messages, selectedConversation }) => {

    return (
        <>
            {!selectedConversation &&
                <div className="bg-slate-100 rounded-md mx-auto flex h-[89vh] flex-col opacity-35 items-center justify-center text-center">
                    <div className="text-2xl md:text-4xl p-16 text-black/90">
                        Please Select Conversation to see messages
                    </div>
                </div>
            }
            {messages && <div className="bg-slate-100 rounded-md mx-auto h-[89vh] flex flex-col">
                <ChatHeader selectedConversation={selectedConversation} />

                {messages.length === 0 && (
                    <div className="flex justify-center items-center text-center h-full">
                        <div className="text-lg text-black/90">
                            No Messages Found
                        </div>

                    </div>
                )}

                {messages.length > 0 && (
                    <div className="flex-grow overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {messages.map((message) => (
                            <Message key={message.id} message={message} selectedConversation={selectedConversation} />
                        ))}

                    </div>
                )}


                <MessageInput />
            </div>}
        </>
    )
}

export default ChatLayout
