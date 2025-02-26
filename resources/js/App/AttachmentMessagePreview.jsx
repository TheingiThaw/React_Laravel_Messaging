import { isImage, isAudio, isVideo, isPDF, isPreviewable, formatBytes } from '@/helpers';
import { Button, Dialog, DialogPanel } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon, PaperClipIcon, XCircleIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useMemo, useState } from 'react'

const AttachmentMessagePreview = ({ attachments, index, show, close = () => { } }) => {
    console.log('attachments', attachments);

    const [currentIndex, setCurrentIndex] = useState(index);

    const attachment = useMemo(() => {
        return attachments[currentIndex];
    }, [attachments, currentIndex]);

    console.log('attachment', attachment);
    console.log('index', index);

    const previewableAttachments = useMemo(() => {
        return attachments.filter((attachment) => isPreviewable(attachment));
    }, [attachments]);

    const next = () => {
        if (currentIndex == previewableAttachments.length - 1) {
            return;
        }

        setCurrentIndex(currentIndex + 1);
    }

    const onClose = () => {
        close();
    }

    const prev = () => {
        if (currentIndex === 0) {
            return;
        }

        setCurrentIndex(currentIndex - 1);
    }

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    return (
        <>
            <Button onClick={show} className="rounded-md hidden">
                {attachments.map((attachment, i) => (
                    <span key={i} className='hidden'>{attachment.name}</span>
                ))}
            </Button>

            <Dialog open={show} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-screen h-screen max-w-md rounded-xl bg-white/5 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <div className='w-full h-full relative overflow-hidden'>
                                <button onClick={onClose} className='absolute top-2 right-0 cursor-pointer'>
                                    <XCircleIcon className='w-5 h-5 ' />
                                </button>

                                <div className="relative h-full w-full">
                                    {currentIndex > 1 && (
                                        <button
                                            onClick={prev}
                                            className='absolute rounded hover:bg-black/5 top-1/2 -translate-y-1/2 flex items-center justify-center '
                                        >
                                            <ChevronLeftIcon className='w-10' />
                                        </button>
                                    )}
                                    {currentIndex < previewableAttachments.length - 1 && (
                                        <button
                                            onClick={next}
                                            className='absolute rounded  hover:bg-black/5  top-1/2 -translate-y-1/2 flex items-center justify-center '
                                        >
                                            <ChevronRightIcon className='w-10' />
                                        </button>
                                    )}
                                    {attachment && (
                                        <div className='w-full h-full p-3 flex items-center justify-center'>
                                            {isImage(attachment) && (
                                                <img src={`/storage/${attachment.path}`} className='rounded-md bg-red-300 max-w-full max-h-full' alt={attachment.name}></img>
                                            )}

                                            {isVideo(attachment) && (
                                                <div className='flex items-center'>
                                                    <video
                                                        src={attachment.url}
                                                        controls
                                                        autoPlay
                                                    >
                                                    </video>
                                                </div>
                                            )}

                                            {isAudio(attachment) && (
                                                <div className="flex items-center justify-center relative">
                                                    <audio src={asset(attachment.path)} controls autoPlay></audio>
                                                </div>
                                            )}

                                            {isPDF(attachment) && (
                                                <iframe src={asset(attachment.path)} className='w-full h-full'></iframe>
                                            )}

                                            {!isPreviewable(attachment) && (
                                                <div className='flex items-center justify-center flex-col text-gray-100'>
                                                    <PaperClipIcon className='w-10 h-10 mb-3' />
                                                    <small className='text-center '>{attachment.name}</small>
                                                    <small className='text-xs'>{formatBytes(attachment.size)}</small>
                                                </div>
                                            )}

                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default AttachmentMessagePreview
