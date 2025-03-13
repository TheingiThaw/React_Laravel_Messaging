import React from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/16/solid'

const DescriptionPopover = ({ conversation }) => {
    return (
        <div className="flex h-auto justify-center">
            <div className="flex">
                <Popover>
                    <PopoverButton className="block text-sm/6 font-semibold text-black/60 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                        <InformationCircleIcon className='w-6 hover:text-black/90' />
                    </PopoverButton>
                    <PopoverPanel
                        transition
                        anchor="bottom"
                        className="divide-y divide-white/5 rounded-xl bg-black/90 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                    >
                        <div className="p-3">
                            <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                <p className="font-semibold text-white">{conversation.name}</p>
                                <p className="text-white/50">{conversation?.description ? conversation.description : 'No Description'}</p>

                            </a>
                        </div>
                    </PopoverPanel>
                </Popover>
            </div>
        </div>
    )
}

export default DescriptionPopover
