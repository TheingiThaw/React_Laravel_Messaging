import Modal from '@/Components/Modal'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextareaInput from '@/Components/TextareaInput';
import TextInput from '@/Components/TextInput';
import { useEventBus } from '@/EventBus';
import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'
import UserPicker from './UserPicker';
import InputError from '@/Components/InputError';

const GroupModal = ({ conversation, show = false, onClose = () => { } }) => {
    console.log('show', show);

    const [group, setGroup] = useState({});
    const page = usePage();
    const conversations = page.props.auth.conversations;
    console.log('conversations', conversations);
    const { on, emit } = useEventBus();

    const users = conversations.filter(c => !c.is_group);

    // console.log('users', users);

    const { data, setData, processing, put, post, patch, reset, errors } = useForm({
        id: '',
        name: '',
        description: '',
        user_ids: []
    });

    const createOrUpdateGroup = (e) => {
        e.preventDefault();

        if (group.id) {
            //update group
            patch(route('group.update', group.id), {
                onSuccess: () => {
                    closeModal();
                    emit('toast.show', `Group ${group.name} updated successfully`);
                }
            })
            return;
        }
        post(route('group.store'), {
            onSuccess: (group) => {
                console.log('group stored');
                emit('toast.show', `Group ${group.name} created successfully`);
                closeModal();
            },
            onError: (error) => {
                console.log('error occured', error)
            }
        })

    }

    const closeModal = () => {
        setGroup({});
        reset();
        onClose();
    };

    console.log('after close', data);

    // useEffect(() => {
    //     console.log('conversation', conversation);
    //     setGroup(conversation);
    //     setData(prevData => ({
    //         ...prevData,
    //         name: conversation.name,
    //         description: conversation.description,
    //         user_ids: conversation.users
    //             ? conversation.users.filter(u => u.id !== group.owner_id).map(u => u.id)
    //             : []
    //     }));
    // }, [on]);

    useEffect(() => {
        console.log('useEffect running for GroupModal.show');

        if (conversation && show) {
            console.log('Setting group data:', conversation);

            setGroup(conversation); // Ensure group updates first

            setData({
                id: conversation.id || '',
                name: conversation.name || '',
                description: conversation.description || '',
                user_ids: conversation.users
                    ? conversation.users.filter(u => u.id !== conversation.owner_id).map(u => u.id)
                    : []
            });
        } else {
            // Reset when creating a new group or after closing the modal
            setGroup({});
            reset();
        }
    }, [conversation, show]); // Depend on conversation & show state

    console.log('after close 1', data);
    useEffect(() => {
        console.log('📌 Updated data:', data);
    }, [data]);

    console.log('group.owner_id:', group.owner_id);
    console.log('data.user_ids:', data.user_ids);
    console.log('Filtered users:', users.filter(u => group.owner_id && u.id !== group.owner_id && data.user_ids.includes(u.id)));

    return (
        <Modal show={show} onClose={closeModal}>
            <div class="relative p-4 w-full max-h-full">
                <div class="relative bg-white w-full rounded-lg shadow-sm dark:bg-gray-700">
                    {/* modal header */}
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            {group.id ? `Group ${group.name}` : 'Create Group'}
                        </h3>
                    </div>
                    {/* modal body */}
                    <div class="p-4 md:p-5">
                        <form onSubmit={createOrUpdateGroup} class="space-y-4" action="#">
                            <div>
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Group Name</label>
                                <TextInput
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={!!group.id}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter group name"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <TextareaInput
                                    name="description"
                                    id="description"
                                    value={data.description}  // ✅ Controlled value
                                    onChange={(e) => setData('description', e.target.value)}  // ✅ Ensure updates
                                    placeholder="Enter group description"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                                <InputError message={errors.description} />
                            </div>

                            <UserPicker value={data.user_ids ? users.filter(u => group.owner_id != u.id && data.user_ids.includes(u.id)) : []}
                                users={users}
                                onSelect={(users) => {
                                    setData(prevData => ({
                                        ...prevData,
                                        user_ids: [...prevData.user_ids, users.id]
                                    }))
                                }} />

                            <div className='flex gap-3'>
                                <PrimaryButton type="button" onClick={closeModal}>Cancel</PrimaryButton>
                                <SecondaryButton type='submit' disabled={processing}>
                                    {group.id ? 'Update' : 'Create'}
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
