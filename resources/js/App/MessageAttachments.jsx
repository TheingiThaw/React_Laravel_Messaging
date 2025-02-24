import { isAudio, isImage, isPDF, isPreviewable } from '@/helpers';
import { ArrowDownTrayIcon, PaperClipIcon } from '@heroicons/react/16/solid';
import React from 'react';

const MessageAttachments = ({ attachments, attachmentClick }) => {
    console.log('messageAttachments', attachments);

    return (
        <>
            {attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                    {attachments.map((attachment, index) => (
                        <div
                            onClick={() => attachmentClick(attachment, index)}
                            key={attachment.id}
                            className="group flex flex-col relative"
                        >
                            <a
                                href={attachment.url}
                                download
                                className="absolute top-2 right-2 bg-black/15 hover:bg-black/50 hover:text-white z-10"
                            >
                                <ArrowDownTrayIcon className="h-6 w-6" />
                            </a>
                            {isImage(attachment) && (
                                <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="w-10 h-15 rounded-md"
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
                                <div className="absolute top-2 right-2 z-10">
                                    <a href={attachment.url} download>
                                        <PaperClipIcon className="h-6 w-6" />
                                    </a>
                                    <small className="text-center">{attachment.name}</small>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MessageAttachments;
