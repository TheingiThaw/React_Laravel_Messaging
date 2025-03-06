import { usePage } from "@inertiajs/react";
import Message from "../App/Message"
import MessageInput from "../App/MessageInput"
import ChatHeader from "@/App/ChatHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEventBus } from "@/EventBus";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/20/solid";
import MessageAttachments from "@/App/MessageAttachments";
import AttachmentMessagePreview from "@/App/AttachmentMessagePreview";

const ChatLayout = ({ messages, selectedConversation }) => {
    const messageContainerRef = useRef();
    const { on } = useEventBus();

    const [localMessage, setLocalMessage] = useState(messages);
    const loadMoreMessage = useRef(null);
    const [loadMore, setLoadMore] = useState(true);
    const [scrollBottom, setScrollBottom] = useState();
    const [previewAttachment, setPreviewAttachment] = useState({});
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);

    const attachmentClick = (attachments, index) => {
        console.log("Clicked Attachments:", attachments);
        console.log("Index:", index);

        setPreviewAttachment({
            attachments: attachments,  // Check if this is a full array or a single item
            index: index
        });
        setShowAttachmentPreview(true);
    };

    console.log('localMessage', localMessage);


    useEffect(() => {
        console.log('Preview Attachment:', previewAttachment); // Check the state when it updates
    }, [previewAttachment]);

    const createMessage = (message) => {
        if (selectedConversation
            && selectedConversation.is_group
            && selectedConversation.id == message.group_id) {
            setLocalMessage((prevMessage) => {
                if (!prevMessage.some((msg) => msg.id === message.id)) {
                    return [...prevMessage, message];
                }
                return prevMessage;
            });
        }
        if (selectedConversation
            && selectedConversation.is_user
            && (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)) {
            setLocalMessage((prevMessage) => {
                if (!prevMessage.some((msg) => msg.id === message.id)) {
                    return [...prevMessage, message];
                }
                return prevMessage;
            });
        }
    }

    const deleteMessage = ({ message }) => {
        if (selectedConversation
            && selectedConversation.is_group
            && selectedConversation.id == message.group_id) {
            setLocalMessage((prevMessage) => {
                return prevMessage.filter((msg) => msg.id !== message.id);
            });
        }
        if (selectedConversation
            && selectedConversation.is_user
            && (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)) {
            setLocalMessage((prevMessage) => {
                return prevMessage.filter((msg) => msg.id !== message.id);
            });
        }
    }

    const loadMoreMessages = useCallback(() => {
        const firstMessage = localMessage[0];
        console.log(firstMessage);
        axios.get(route('chat.loadOlder', firstMessage.id))
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
        const offDeleted = on('message.deleted', deleteMessage);

        setScrollBottom(0);
        setLoadMore(true);

        return () => {
            offCreated();
            offDeleted();
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

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => entry.isIntersecting && loadMoreMessages());
            },
            {
                rootMargin: "0px 0px 200px 0px",
            }
        );

        if (loadMoreMessage.current) {
            setTimeout(() => {
                observer.observe(loadMoreMessage.current);
            }, 300);
        }

    }, [localMessage]);

    return (
        <div className="flex-1 w-full flex flex-col items-center justify-center h-full overflow-hidden">
            {!selectedConversation ? (
                <div className=" bg-slate-300 rounded-md mx-auto flex h-full flex-col opacity-35 items-center justify-center text-center">
                    <div className="text-2xl md:text-4xl p-16 text-black/90">
                        Please Select a Conversation to See Messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-20 h-20 inline-block" />
                </div>
            ) : (
                <div className="bg-slate-100 rounded-md mx-auto h-[89vh] flex flex-col">
                    <ChatHeader selectedConversation={selectedConversation} />
                    {localMessage === undefined ? (
                        <div className="flex justify-center items-center text-center h-full">
                            <div className="text-lg text-black/90">Loading messages...</div>
                        </div>
                    ) : localMessage.length === 0 ? (
                        <div className="flex justify-center items-center text-center h-full">
                            <div className="text-lg text-black/90">No Messages Found</div>
                        </div>
                    ) : (
                        <div ref={messageContainerRef} className="flex-grow overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                            <div ref={loadMoreMessage}></div>
                            {localMessage.map((message) => (
                                <Message
                                    key={message.id}
                                    message={message}
                                    selectedConversation={selectedConversation}
                                    onAttachmentClick={(attachments, index) => attachmentClick(attachments, index)}
                                />
                            ))}
                        </div>
                    )}
                    <MessageInput conversation={selectedConversation} />
                    {previewAttachment.attachments && (
                        <AttachmentMessagePreview
                            attachments={Array.isArray(previewAttachment.attachments) ? previewAttachment.attachments : [previewAttachment.attachments]}
                            index={previewAttachment.index}
                            show={showAttachmentPreview}
                            close={() => {
                                console.log('close function called in parent');
                                setShowAttachmentPreview(false)
                            }}
                        />
                    )}
                </div>
            )}
        </div>

    )
}

export default ChatLayout
