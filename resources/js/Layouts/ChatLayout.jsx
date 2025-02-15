import { usePage } from "@inertiajs/react";
import Message from "../App/Message"
import MessageInput from "../App/MessageInput"

const ChatLayout = ({ messages, selectedConversation }) => {
    console.log('messages: ', messages);
    console.log('selectedConversation', selectedConversation);
    return (
        <>
            {!messages &&
                <div className="bg-slate-100 rounded-md mx-auto flex h-[89vh] flex-col opacity-35 items-center justify-center text-center">
                    <div className="text-2xl md:text-4xl p-16 text-black/90">
                        Please Select Conversation to see messages
                    </div>
                </div>
            }
            {messages && <div className="bg-slate-100 rounded-md mx-auto h-[89vh] flex flex-col">
                <div className="flex gap-3 p-2">
                    <div className=" flex items-center">
                        <div className="avatar">
                            <div className="w-8 rounded-full">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <h1>User Name</h1>
                    </div>
                </div>


                {localMessages.length === 0 && (
                    <div className="flex justify-center items-center text-center h-full">
                        <div className="text-lg text-black/90">
                            No Messages Found
                        </div>

                    </div>
                )}
                {localMessages.length > 0 && (
                    <div className="flex-grow overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                    </div>
                )}


                <MessageInput />
            </div>}
        </>
    )
}

export default ChatLayout
