import { FaceSmileIcon, HandThumbUpIcon, LinkIcon, MicrophoneIcon, PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/16/solid"
import axios from "axios";
import { useEffect, useRef, useState } from "react";


const MessageInput = ({ conversation }) => {
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
            }
        }).catch(err => {
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

        useEffect(() => {
            if (inputValue.current) {
                inputValue.current.style.height = "auto";
                inputValue.current.style.height = `${inputValue.current.scrollHeight + 1}px`;
            }
        }, [newMessage]);
    }

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
                        <button><FaceSmileIcon className="h-6 w-6" /></button>
                        <button><HandThumbUpIcon className="h-6 w-6" /></button>
                    </div>
                </div>
                {inputErrorMsg && <p className="text-red-500 text-xs">{inputErrorMsg}</p>}
            </div>
        </>
    )
}

export default MessageInput
