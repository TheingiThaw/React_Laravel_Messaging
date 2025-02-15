import { FaceSmileIcon, HandThumbUpIcon, LinkIcon, MicrophoneIcon, PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/16/solid"


const MessageInput = () => {
    return (
        <>
            <div className=' mx-auto grid grid-cols-6'>
                {/* Left icon side */}
                <div className="flex items-center justify-center p-2 ">
                    <div className="grid grid-cols-3 gap-5  ">
                        <LinkIcon className="h-6 w-6" />
                        <MicrophoneIcon className="h-6 w-6" />
                        <PhotoIcon className="h-6 w-6" />
                    </div>
                </div>
                {/* Left icon sie */}

                <div className="col-span-4 ">
                    <div className=" relative mx-auto">
                        <input
                            type="text"
                            placeholder="Type a message"
                            className="input w-full p-2 border rounded-md overflow-auto"
                        />
                        <button className="py-1 px-3 bg-green-500 absolute right-2 top-1/2 transform -translate-y-1/2 text-white rounded-md">
                            <PaperAirplaneIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-center p-2 ">
                    <div className="grid grid-cols-2 gap-5 ">
                        <FaceSmileIcon className="h-6 w-6" />
                        <HandThumbUpIcon className="h-6 w-6" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MessageInput
