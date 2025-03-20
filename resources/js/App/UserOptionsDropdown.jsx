import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/16/solid'
import { useEventBus } from '@/EventBus';

const UserOptionsDropdown = ({ conversation }) => {

    const { emit } = useEventBus();
    const onBlockUnblock = (conversation) => {
        // console.log('clicked', conversation);
        if (!conversation.is_user) {
            return;
        }

        axios.post(route('user.blockUnblock', { user: conversation.id }))
            .then((res) => {
                emit('toast.show', res.data.message);
            })
            .catch(err => console.error(err));
        // console.log('clicked');
    };

    const onChangeUserRole = (conversation) => {
        // console.log('clicked', conversation.id);
        if (conversation.is_group) {
            return;
        }
        axios.post(route('user.changeRole', { user: conversation.id }))
            .then(res => {
                emit('toast.show', res.data.message);
            })
            .catch(err => console.error(err));

        // console.log('clicked');
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
                    className="w-52 origin-top-right rounded-xl border border-white/5 bg-black/90 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                    <MenuItem>
                        <button onClick={() => onBlockUnblock(conversation)} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            {conversation.is_blocked ? 'Unlock User' : 'Block user'}
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button onClick={() => { console.log('clicked'); onChangeUserRole(conversation) }} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            {conversation.is_admin ? 'Make User' : 'Make Admin'}
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div >
    )
}

export default UserOptionsDropdown
