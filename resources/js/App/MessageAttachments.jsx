import { isAudio, isImage, isPDF, isPreviewable } from '@/helpers';
import { ArrowDownTrayIcon, PaperClipIcon } from '@heroicons/react/16/solid';
import React from 'react';

const MessageAttachments = ({ attachments, attachmentClick }) => {
    console.log('messageAttachments', attachments);

    return (
        <>
            {attachments && attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-end gap-2 bg-black/10 relative rounded-md">
                    {attachments.map((attachment, index) => (
                        <div
                            onClick={() => attachmentClick(attachment, index)}
                            key={attachment.id}
                            className="group flex flex-col relative"
                        >
                            <a
                                href={attachment.url}
                                download
                                className="absolute right-2 rounded-md hover:bg-black/50 hover:text-white z-10"
                                style={{ maxWidth: '100%' }}
                            >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                            </a>
                            {isImage(attachment) && (
                                <img
                                    src={`/storage/${attachment.path}`}
                                    alt={attachment.name}
                                    className=" w-24 h-24 rounded-md"
                                />
                            )}
                            {isAudio(attachment) && (
                                <>
                                    <audio src={attachment.url} autoPlay controls></audio>
                                    <button />
                                </>
                            )}
                            {isPDF(attachment) && (
                                <iframe
                                    src={attachment.url}
                                    className="w-full h-48"
                                ></iframe>
                            )}
                            {!isPreviewable(attachment) && (
                                <>
                                    <div className="absolute top-2 right-2 z-10">
                                    </div>
                                    <div className='flex flex-col items-center w-full'>
                                        <a href={attachment.url} download className='relative flex items-center justify-center'>
                                            <PaperClipIcon className="h-12 w-12" />
                                        </a>
                                        <p className="text-xs text-center text-ellipsis">
                                            {attachment.name}
                                        </p>
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
