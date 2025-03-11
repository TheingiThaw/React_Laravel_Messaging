import { UserGroupIcon } from '@heroicons/react/20/solid'
import React from 'react'

const GroupAvatar = () => {

    return (
        <div className="w-12 rounded-full flex align-items-center justify-center bg-neutral">
            <UserGroupIcon className='w-12 text-white' />
        </div>
    )
}

export default GroupAvatar
