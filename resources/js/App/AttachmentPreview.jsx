import { formatBytes, isPDF, isPreviewable } from '@/helpers'
import { PaperClipIcon } from '@heroicons/react/16/solid'
import React from 'react'

const AttachmentPreview = ({ file }) => {

    console.log(attachments);

    return (
        <>
            <div className="w-24 h-24 rounded-md px-2 py-3 bg-black/30">
                <div className="grid grid-cols-3">
                    {isPDF(file.file) && <img src='../../../public/image/pdf.png' className='w-8 '></img>}
                    {!isPreviewable && (
                        <div className='rounded-md flex items-center justify-center w-10 h-10'>
                            <PaperClipIcon className='text-white' />
                        </div>
                    )}
                    <div className="col-span-2 flex flex-col">
                        <p className='text-ellipsis text-nowrap'>{attachments.name}</p>
                        <small>{formatBytes(attachments.size)}</small>
                    </div>

                </div>
            </div>

        </>
    )
}

export default AttachmentPreview
