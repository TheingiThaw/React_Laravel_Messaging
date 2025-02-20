import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { FaceSmileIcon, HandThumbUpIcon, LinkIcon, MicrophoneIcon, PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/16/solid"
import { usePage } from "@inertiajs/react";
import axios from "axios";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";


const MessageInput = ({ conversation }) => {
    const authUser = usePage().props.auth.user;
    const [newMessage, setNewMessage] = useState('');
    const [inputErrorMsg, setInputErrorMsg] = useState('');
    const [messageSending, setMessageSending] = useState(false);

    const inputValue = useRef();

    const onSendClick = () => {
        if (newMessage.trim() === '') {
            setInputErrorMsg('Message is required');

            setTimeout(() => {
                setInputErrorMsg('');
            }, 3000);

            return;
        }

        const formData = new FormData();

        console.log(formData);
        formData.append('message', newMessage);
        formData.append('sender_id', authUser.id);
        if (conversation.is_user) {
            formData.append('receiver_id', conversation.id);
        }
        else if (conversation.is_group) {
            formData.append('group_id', conversation.id);
        }

        setMessageSending(true);

        axios.post(route('chat.store'), formData, {
            onUploadProgress: (ProgressEvent) => {
                return Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100);
            },
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            //     'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            // }
        }).catch(err => {
            console.log(err.response);
            setInputErrorMsg('Message cannot be sent');
            setMessageSending(false);
        }).then(res => {
            setNewMessage('');
            setMessageSending(false);
            setInputErrorMsg('');
        })

    }

    const onChangeEvent = (ev) => {
        if (ev.key == 'enter' && !ev.shiftKey) {
            onSendClick();
        }
        else {
            setNewMessage(ev.target.value);
        }
    }

    const sendLike = () => {
        if (messageSending) {
            return;
        }

        setMessageSending(true);

        const message = {
            'message': '👍'
        };
        message['sender_id'] = authUser.id;

        if (conversation.is_user) {
            message['receiver_id'] = conversation.id;
        }
        else if (conversation.is_group) {
            message['group_id'] = conversation.id;
        }

        console.log("Sending Payload:", message);

        axios.post(route('chat.store'), message, {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        }).catch(error => {
            console.error("Error:", error.response?.data || error.message);
        })
            .then(() => {
                console.log("Response:", response.data);
                setMessageSending(false);
            });

    }

    useEffect(() => {
        if (inputValue.current) {
            inputValue.current.style.height = "auto";
            inputValue.current.style.height = `${inputValue.current.scrollHeight + 1}px`;
        }
    }, [newMessage]);

    return (
        <>
            <div className=' mx-auto grid grid-cols-6'>
                {/* Left icon side */}
                <div className="flex items-center justify-center p-2 ">
                    <div className="grid grid-cols-3 gap-5  ">
                        <button><LinkIcon className="h-6 w-6" /></button>
                        <button><MicrophoneIcon className="h-6 w-6" /></button>
                        <button className="relative">
                            <PhotoIcon className="h-6 w-6" />
                            <input type="file"
                                multiple
                                accept="image/*"
                                className="absolute left-0 right-0 top-0 bottom-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                        </button>
                    </div>
                </div>
                {/* Left icon sie */}

                <div className="col-span-4 ">
                    <div className=" relative mx-auto">
                        <textarea
                            type="text"
                            placeholder="Type a message"
                            className="input w-full p-2 pe-16  border rounded-md flex-wrap overflow-y-auto resize-none"
                            onChange={onChangeEvent}
                            onKeyPress={onChangeEvent}
                            ref={inputValue}
                            value={newMessage}
                        />
                        <button onClick={onSendClick} className="py-1 px-3 bg-green-500 absolute right-2 top-1/2 transform -translate-y-1/2 text-white rounded-md">
                            {messageSending
                                ? <span className="loading loading-spinner loading-xs"></span>
                                : <PaperAirplaneIcon className="h-6 w-6" />}

                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-center p-2 ">
                    <div className="grid grid-cols-2 gap-5 ">
                        <button className="">
                            <Popover className="relative">
                                <PopoverButton className="flex items-center">
                                    <FaceSmileIcon className="h-6 w-6" />
                                </PopoverButton>
                                <PopoverPanel className="absolute left-100 right-0 bottom-0 top-200 z-20">
                                    <EmojiPicker
                                        onEmojiClick={(emojiObject) =>
                                            setNewMessage((prevMsg) => prevMsg + emojiObject.emoji)
                                        }
                                        theme="dark"
                                    />
                                </PopoverPanel>
                            </Popover>
                        </button>

                        <button onClick={sendLike} className=" relative"><HandThumbUpIcon className="h-6 w-6 " /></button>
                    </div>
                </div>
                {inputErrorMsg && <p className="text-red-500 text-xs">{inputErrorMsg}</p>}
            </div>
        </>
    )
}

export default MessageInput
