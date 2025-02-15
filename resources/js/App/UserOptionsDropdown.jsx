import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/16/solid'

const UserOptionsDropdown = ({ conversation }) => {
    const onBlockUnblock = (conversation) => {
        if (!conversation.is_user) {
            return;
        }

        axios.post(route('user.blockUnblock'), conversation.id)
            .then(res => console.log(res))
            .catch(err => console.error(err));
    };

    const onChangeUserRole = (conversation) => {
        if (conversation.is_group) {
            return;
        }
        axios.post(route('user.changeRole'), conversation.id)
            .then(res => console.log(res))
            .catch(err => console.error(err));
    };

    return (
        <div>
            <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-200 data-[open]:bg-gray-200 data-[focus]:outline-1 data-[focus]:outline-white">
                    <EllipsisVerticalIcon className='h-6 w-6' />
                </MenuButton>
                <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-52 origin-top-right rounded-xl border border-white/5 bg-black/80 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                    <MenuItem>
                        <button onClick={onBlockUnblock} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            {conversation.blocked_at ? 'Block User' : 'Unlock user'}
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button onClick={onChangeUserRole} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            {conversation.is_admin ? 'Make User' : 'Make Admin'}
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    )
}

export default UserOptionsDropdown
