import { formatBytes, isPDF, isPreviewable } from '@/helpers'
import { PaperClipIcon } from '@heroicons/react/16/solid'
import React from 'react'

const AttachmentPreview = ({ file }) => {

    console.log('preview', file);

    return (
        <>
            <div className="w-240 h-18 rounded-md px-2 py-3 bg-gray">
                <div className="grid grid-cols-3">
                    {isPDF(file) && <img src='/image/pdf.png' className='w-6'></img>}
                    {!isPreviewable(file) && (
                        <div className='rounded-md flex bg-black/20 items-center justify-center w-16 h-12'>
                            <PaperClipIcon className='text-white w-6 h-6' />
                        </div>
                    )}
                    <div className="col-span-2 flex flex-col">
                        <p className='text-ellipsis text-nowrap overflow-hidden'>{file.name}</p>
                        <small>{formatBytes(file.size)}</small>
                    </div>

                </div>
            </div>

        </>
    )
}

export default AttachmentPreview
