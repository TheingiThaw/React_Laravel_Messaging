import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/16/solid'
import axios from 'axios';
import { useEventBus } from '@/EventBus';

const MessageDropdownOptions = ({ message }) => {

    const { emit } = useEventBus();

    const deleteMessage = () => {
        console.log('message', message);

        if (!message) {
            console.error("Message or message ID is undefined!");
            return;
        }

        axios.delete(route('chat.delete', { id: message }))
            .then((res) => {
                console.log('delete', res.data, message);
                emit('message.deleted', { message, prevMessage: res.data });
            })
            .catch((err) => console.error(err));
    }

    return (
        <div>
            <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-200 data-[open]:bg-gray-200 data-[focus]:outline-1 data-[focus]:outline-white">
                    <EllipsisVerticalIcon className='h-4 w-4' />
                </MenuButton>
                <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-52 origin-top-right rounded-xl border border-white/5 bg-black/80 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                    <MenuItem>
                        <button onClick={deleteMessage} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            Delete Message
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    )
}

export default MessageDropdownOptions
