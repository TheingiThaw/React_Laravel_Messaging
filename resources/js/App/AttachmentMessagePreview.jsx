import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import React from 'react'

const AttachmentMessagePreview = ({ attachments, index, show, close = () => { } }) => {
    console.log('attachments', attachments);
    return (
        <>
            <Button
                onClick={show}
                className="rounded-md bg-black/20 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-black/30 data-[focus]:outline-1 data-[focus]:outline-white"
            >
                {attachments}
            </Button>

            <Dialog open={show} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-screen h-screen max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <div className='w-full h-full'>

                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default AttachmentMessagePreview
