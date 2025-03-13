import { UserGroupIcon } from '@heroicons/react/20/solid'
import React from 'react'

const GroupAvatar = () => {

    return (
        <div className="w-12 h-12 rounded-full flex align-items-center justify-center bg-neutral">
            <UserGroupIcon className=' w-6 text-white' />
            {/* w-12 */}
        </div>
    )
}

export default GroupAvatar
