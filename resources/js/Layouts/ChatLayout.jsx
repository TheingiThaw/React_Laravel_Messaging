import { usePage } from "@inertiajs/react";
import Message from "../App/Message"
import MessageInput from "../App/MessageInput"
import ChatHeader from "@/App/ChatHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEventBus } from "@/EventBus";

const ChatLayout = ({ messages, selectedConversation }) => {
    const messageContainerRef = useRef();
    const { on } = useEventBus();

    const [localMessage, setLocalMessage] = useState(messages);
    const loadMoreMessage = useRef(null);
    const [loadMore, setLoadMore] = useState(true);
    const [scrollBottom, setScrollBottom] = useState();

    const createMessage = (message) => {
        if (selectedConversation
            && selectedConversation.is_group
            && selectedConversation.id == message.group_id) {
            setLocalMessage((prevMessage) => [...prevMessage, message]);
        }
        if (selectedConversation
            && selectedConversation.is_user
            && (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)) {
            setLocalMessage((prevMessage) => [...prevMessage, message]);
        }
    }

    const loadMoreMessages = useCallback(() => {
        const firstMessage = localMessage[0];
        axios.get(route('chat.loadOlder'), firstMessage)
            .catch(err => console.error(err))
            .then(({ data }) => {
                console.log(data);
                if (data.data.length == 0) {
                    setLoadMore(false);
                    return;
                }

                const scrollTop = messageContainerRef.current.scrollTop;
                const scrollHeight = messageContainerRef.current.scrollHeight;
                const clientHeight = messageContainerRef.current.clientHeight;
                const scroll_bottom = scrollHeight - clientHeight - scrollTop;
                setScrollBottom(scroll_bottom);

                setLocalMessage((prevMsg) => {
                    return [...data.data.reverse(), prevMsg];
                })
            });
    }, [localMessage]);

    useEffect(() => {
        setLocalMessage(messages);
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }

        const offCreated = on('message.created', createMessage);

        setScrollBottom(0);
        setLoadMore(true);

        return () => {
            offCreated();
        }

    }, [messages, selectedConversation]);

    useEffect(() => {
        if (messageContainerRef.current && scrollBottom != null) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight -
                messageContainerRef.current.offsetHeight -
                scrollBottom;
        }

        if (!loadMore) {
            return;
        }

    }, [localMessage]);

    return (
        <>
            {!selectedConversation ? (
                <div className="bg-slate-100 rounded-md mx-auto flex h-[89vh] flex-col opacity-35 items-center justify-center text-center">
                    <div className="text-2xl md:text-4xl p-16 text-black/90">
                        Please Select a Conversation to See Messages
                    </div>
                </div>
            ) : localMessage === undefined ? (
                <div className="flex justify-center items-center text-center h-full">
                    <div className="text-lg text-black/90">Loading messages...</div>
                </div>
            ) : localMessage.length === 0 ? (
                <div className="bg-slate-100 rounded-md mx-auto h-[89vh] flex flex-col">
                    <ChatHeader selectedConversation={selectedConversation} />
                    <div className="flex justify-center items-center text-center h-full">
                        <div className="text-lg text-black/90">No Messages Found</div>
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </div>
            ) : (
                <div className="bg-slate-100 rounded-md mx-auto h-[89vh] flex flex-col">
                    <ChatHeader selectedConversation={selectedConversation} />
                    <div ref={messageContainerRef} className="flex-grow overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <div ref={loadMoreMessage}></div>
                        {localMessage.map((message) => (
                            <Message key={message.id} message={message} selectedConversation={selectedConversation} />
                        ))}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </div>
            )}
            {/* {messages != [] && <div className="bg-slate-100 rounded-md mx-auto h-[89vh] flex flex-col">
                <ChatHeader selectedConversation={selectedConversation} />

                {messages.length === 0 && (
                    <div className="flex justify-center items-center text-center h-full">
                        <div className="text-lg text-black/90">
                            No Messages Found
                        </div>

                    </div>
                )}

                {messages.length > 0 && (
                    <div ref={messageContainerRef} className="flex-grow overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {messages.map((message) => (
                            <Message key={message.id} message={message} selectedConversation={selectedConversation} />
                        ))}

                    </div>
                )}


                <MessageInput conversation={selectedConversation} />
            </div>} */}

        </>
    )
}

export default ChatLayout
