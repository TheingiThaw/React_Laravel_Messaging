import { isAudio, isImage, isPDF, isPreviewable, isVideo } from '@/helpers';
import { ArrowDownTrayIcon, PaperClipIcon, PlayCircleIcon } from '@heroicons/react/16/solid';
import React from 'react';

const MessageAttachments = ({ attachments, attachmentClick }) => {
    console.log('messageAttachments', attachments);

    return (
        <>
            {attachments && attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 items-center justify-center bg-black/10 relative rounded-md">
                    {attachments.map((attachment, index) => (
                        <div
                            onClick={() => attachmentClick(attachment, index)}
                            key={attachment.id}
                            className={
                                "group flex items-center justify-center relative bg-red-300" +
                                (isAudio(attachment) ? 'w-84' : 'w-32 aspect-square')
                            }
                        >
                            {/* Download Button (Only for non-audio attachments) */}
                            {!isAudio(attachment) && (
                                <a
                                    href={attachment.url}
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    className="absolute top-1 right-2 transition-all group-hover:bg-black/50 group-hover:text-white
                            cursor-pointer flex rounded justify-center items-center z-10"
                                    style={{ maxWidth: '100%' }}
                                >
                                    <ArrowDownTrayIcon className="h-5 w-5" />
                                </a>
                            )}

                            {/* Image Preview */}
                            {isImage(attachment) && (
                                <img
                                    src={`/storage/${attachment.path}`}
                                    alt={attachment.name}
                                    className=" w-28 h-28 object-contain aspect-square"
                                />
                            )}

                            {/* Audio Preview */}
                            {isAudio(attachment) && (
                                <div className='flex justify-center items-center relative'>
                                    <audio src={attachment.url} autoPlay controls></audio>
                                </div>
                            )}

                            {/* Video Preview */}
                            {isVideo(attachment) && (
                                <div className='flex justify-center items-center relative'>
                                    <PlayCircleIcon className='w-16 h-16 z-20 opacity-100 text-white' />
                                    <div className="absolute w-full h-full top-0 left-0 z-10"></div>
                                    <video src={attachment.url}></video>
                                </div>
                            )}

                            {/* PDF Preview */}
                            {isPDF(attachment) && (
                                <div className='flex justify-center items-center relative'>
                                    <div className="absolute w-full h-full top-0 left-0 z-10"></div>
                                    <iframe
                                        src={attachment.url}
                                        className="w-full h-48"
                                    ></iframe>
                                </div>
                            )}

                            {/* Non-Previewable Attachments */}
                            {!isPreviewable(attachment) && (
                                <>
                                    <div className="absolute w-full h-full top-0 left-0 z-10"></div>
                                    <div className='flex flex-col overflow-hidden items-center justify-center bg-blue-100 w-24 h-24'>
                                        <a
                                            href={attachment.url}
                                            onClick={(ev) => ev.stopPropagation()}
                                            download
                                            className="flex flex-col items-center justify-center"
                                            style={{ maxWidth: '100%' }}
                                        >
                                            <PaperClipIcon className="h-12 w-12" />
                                            <small className="text-xs text-ellipsis overflow-hidden whitespace-nowrap max-w-[90%]">
                                                {attachment.name}
                                            </small>
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>

    );
};

export default MessageAttachments;
