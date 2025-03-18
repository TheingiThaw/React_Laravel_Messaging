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
import Checkbox from '@/Components/Checkbox';

const UserModal = ({ show = false, onClose = () => { } }) => {
    console.log('show', show);
    const { emit } = useEventBus();

    const { data, setData, processing, put, post, patch, reset, errors } = useForm({
        id: '',
        name: '',
        email: '',
        is_admin: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('user.store'), {
            onSuccess: (res) => {
                emit('toast.show', res.data.message);
                closeModal();
            },
            onError: (error) => {
                console.log('error occured', error)
            }
        })

    }

    const closeModal = () => {
        reset();
        onClose();
    };


    return (
        <Modal show={show} onClose={closeModal}>
            <div class="relative p-4 w-full max-h-full">
                <div class="relative bg-white w-full rounded-lg shadow-sm dark:bg-gray-700">
                    {/* modal header */}
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Create a user
                        </h3>
                    </div>
                    {/* modal body */}
                    <div class="p-4 md:p-5">
                        <form onSubmit={submit} class="space-y-4" action="#">
                            <div>
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <TextInput
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter user name"
                                    isFocused
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <TextInput
                                    name="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter user email"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Checkbox
                                    name='is_admin'
                                    checked={data.is_admin} onChange={(e) => setData('is_admin', e.target.checked)} />
                                <p>Is an admin</p>
                            </div>

                            <div className='flex gap-3'>
                                <PrimaryButton type="button" onClick={closeModal}>Cancel</PrimaryButton>
                                <SecondaryButton type='submit' disabled={processing}>
                                    Create
                                </SecondaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default UserModal
