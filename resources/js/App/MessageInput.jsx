import { FaceSmileIcon, HandThumbUpIcon, LinkIcon, MicrophoneIcon, PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/16/solid"
import { useState } from "react";


const MessageInput = ({ conversation }) => {
    const [newMessage, setNewMessage] = useState('');
    const [inputErrorMsg, setInputErrorMsg] = useState('');
    const [messageSending, setMessageSending] = useState(false);

    const onSendClick = () => {
        if (newMessage.trim() === '') {
            setInputErrorMsg('Message is required');

            setTimeout(() => {
                setInputErrorMsg('');
            }, 3000);
        }

        else {
            axios.post(route('chat.store'), {

            }).catch(err => {
                setInputErrorMsg('Message cannot be sent');
                setMessageSending(false);
            }).then(res => {
                setNewMessage('');
                setMessageSending(false);
                setInputErrorMsg('');
            })
        }

    }
    return (
        <>
            <div className=' mx-auto grid grid-cols-6'>
                {/* Left icon side */}
                <div className="flex items-center justify-center p-2 ">
                    <div className="grid grid-cols-3 gap-5  ">
                        <button><LinkIcon className="h-6 w-6" /></button>
                        <button><MicrophoneIcon className="h-6 w-6" /></button>
                        <button>
                            <PhotoIcon className="h-6 w-6" />
                            <input type="file"
                                multiple
                                accept="image/*"
                                className="flex absolute left-0 right-0 top-0 bottom-0 opacity-0 z-20" />
                        </button>
                    </div>
                </div>
                {/* Left icon sie */}

                <div className="col-span-4 ">
                    <div className=" relative mx-auto">
                        <input
                            type="text"
                            placeholder="Type a message"
                            className="input w-full p-2 border rounded-md overflow-auto"
                            onChange={(ev) => setNewMessage(ev.target.value)}
                        />
                        <button onClick={onSendClick} className="py-1 px-3 bg-green-500 absolute right-2 top-1/2 transform -translate-y-1/2 text-white rounded-md">
                            <PaperAirplaneIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-center p-2 ">
                    <div className="grid grid-cols-2 gap-5 ">
                        <button><FaceSmileIcon className="h-6 w-6" /></button>
                        <button><HandThumbUpIcon className="h-6 w-6" /></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MessageInput
