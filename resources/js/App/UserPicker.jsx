import React from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/16/solid'

const UserPicker = ({ users, onSelect }) => {
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState(users || []);

    console.log('selected', selected);

    const filteredPeople =
        query === ''
            ? users
            : users.filter((person) => {
                return person.name.toLowerCase().includes(query.toLowerCase())
            })

    console.log('filtered', filteredPeople);

    // const handleSelect = (person) => {
    //     if (selected.find(u => u.id === person.id)) {
    //         setSelected(selected.filter(u => u.id !== person.id));
    //     } else {
    //         setSelected([...selected, person]);
    //     }
    // };

    const handleSelect = (person) => {
        onSelect(person);
        setSelected(prevSelected => prevSelected.find(u => u.id == person.id) ? prevSelected.filter(u => u.id !== person.id) : [...prevSelected, person]);
    };

    return (
        <div className=" h-auto w-full pt-2">

            <Combobox value={selected} onChange={(value) => handleSelect(value)} onClose={() => setQuery('')}>
                <div className="relative">
                    <ComboboxInput
                        className={clsx(
                            'w-full rounded-lg border-none bg-black/70 py-1.5 pr-8 pl-3 text-sm/6 text-white',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                        displayValue={(person) => person?.length ? `${person.length} users selected` : ''}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                    </ComboboxButton>

                </div>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        'w-[var(--input-width)] rounded-xl border border-white/5 bg-black/70 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                        'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                    )}
                >
                    {filteredPeople.map((person) => (
                        <ComboboxOption
                            key={person.id}
                            value={person}
                            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                        >
                            {selected.some(u => u.id === person.id) && (
                                <CheckIcon className="size-4 fill-white" />
                            )}
                            <div key={person.id} className="text-sm/6 text-white">{person.name}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox >
            {selected.length > 0 && (
                <div className="flex gap-3 mt-2">
                    {selected.map((u) => (
                        <div key={u.id} className="badge badge-soft badge-primary w-auto h-auto">{u.name}</div>
                    ))}
                </div>
            )}
        </div >
    )
}

export default UserPicker
