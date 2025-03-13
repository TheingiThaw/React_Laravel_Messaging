import Modal from '@/Components/Modal'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextareaInput from '@/Components/TextareaInput';
import TextInput from '@/Components/TextInput';
import { useEventBus } from '@/EventBus';
import { Description } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'
import UserPicker from './UserPicker';

const GroupModal = ({ show, onClose = () => { } }) => {
    if (!show) return null;

    const [group, setGroup] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const page = usePage();
    const conversations = page.props.auth.conversations;
    console.log(conversations);
    const { on, emit } = useEventBus();

    const users = conversations.filter(c => !c.is_group);

    console.log(users);

    const { data, setData, put, post, reset, errors } = useForm({
        id: '',
        name: '',
        description: '',
        user_ids: []
    });

    const createOrUpdateGroup = (e) => {
        e.preventDefault();

        if (group.id) {
            //update group
            put(route('group.update', group.id), {
                onSuccess: () => {
                    closeModal();
                    emit('toast.show', { message: `Group ${group.name} updated successfully` });
                }
            })
            return;
        }
        post(route('group.store'), {
            //     setData({

            //         'name': e.target.name.value,
            //     'description': e.target.description.value,
            //     'user_ids': conversation.users.filter(u => u.id != conversation.owner_id).map(u => u.id),
            // });
            onSuccess: () => {
                emit('toast.show', { message: `Group ${group.name} created successfully` });
                closeModal();
            }
        })

    }

    const closeModal = () => {
        setShowGroupModal(false);
        reset();
        onClose();
    };

    useEffect(() => {
        return on('GroupModal.show', (group) => {
            setData({
                name: group.name,
                description: group.description,
                user_ids: group.users.filter(u => u.id != group.owner_id).map(u => u.id)
            })
            setShowGroupModal(true);
            setGroup(group);
        });
    }, [on]);

    console.log('data', data);
    console.log('group', group);


    return (
        <Modal show={show} onClose={() => setShowGroupModal(false)}>
            <div class="relative p-4 w-full max-w-md max-h-full">
                <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    {/* modal header */}
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            {conversations.group_id ? `Group ${group.name}` : 'Create Group'}
                        </h3>
                    </div>
                    {/* modal body */}
                    <div class="p-4 md:p-5">
                        <form onSubmit={createOrUpdateGroup} class="space-y-4" action="#">
                            <div>
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Group Name</label>
                                <TextInput name="name" id="name" value={group.id && group.name} disabled={!!group.id} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                                {errors.name && <p class="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <TextareaInput name="description" id="description" value={group.id && group.description} placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                {errors.description && <p class="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <UserPicker users={users.filter(u => group.owner_id != u.id && data.user_ids.includes(u.id)) || []}
                                onSelect={(users) => setData(prevData => ({
                                    ...prevData,
                                    user_ids: [...prevData.user_ids, users.id]
                                }))} />

                            <div className='flex gap-3'>
                                <PrimaryButton onClick={() => closeModal()}>Cancel</PrimaryButton>
                                <SecondaryButton type='submit'>
                                    {conversations.group_id ? 'Update' : 'Create'}
                                </SecondaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default GroupModal
