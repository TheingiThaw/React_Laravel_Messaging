
import ApplicationLogo from '@/Components/ApplicationLogo';
import Echo from '@/echo';
import { Link, router, usePage } from '@inertiajs/react';
import { Dropdown } from 'flowbite-react';
import { useState } from 'react';
import { useEventBus } from '@/EventBus';
import Toast from '@/App/Toast';
import NewMessageNotification from '@/App/NewMessageNotification';
import { UserPlusIcon } from '@heroicons/react/16/solid';
import UserModal from '@/App/UserModal';
import SecondaryButton from '@/Components/SecondaryButton';

function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const user = page.props.auth.user;

    // console.log('token', document.querySelector('meta[name="csrf-token"]').content);

    const [showUserModal, setShowUserModal] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const conversations = page.props.auth.conversations;
    const { emit } = useEventBus();

    conversations.forEach(conversation => {
        let channel = 'message.group.' + conversation.id;

        // console.log('channel', channel);

        if (conversation.is_user) {
            channel = `message.user.${[
                parseInt(user.id),
                parseInt(conversation.id)
            ].sort((a, b) => a - b).join('_')}`;
        }

        Echo.private(channel)
            .listen('SocketMessage', (e) => {
                console.log("Received event:", e); // Debug the event

                const message = e.message;

                emit('message.created', message, () => {
                    console.log('message emitted');
                });


                if (message.sender_id == user.id) {
                    return;
                }

                emit('newMessageNotification', {
                    'user': message.sender,
                    'group_id': message.group_id,
                    'message': message.message ||
                        `Shared ${message.attachments.length === 1 ? ' an attachment' : message.attachments.length + ' attachments'}`
                });

                return () => {
                    channel.stopListening('SocketMessage');
                };

            })

        if (conversation.is_group) {
            Echo.private(`group.deleted.${conversation.id}`)
                .listen('DeleteGroup', (e) => {
                    console.log('group deleted');
                    emit('group.deleted', { id: e.id, name: e.name });
                })
                .error((error) => {
                    console.log('Broadcast Auth Error:', error);
                });

            return () => {
                Echo.leave(`group.deleted.${conversation.id}`);
            };
        }
    });

    const handleLogout = async () => {
        try {

            axios.post(route('logout'), {}, {
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
                }
            })

            router.visit(route('login'));
        } catch (err) {
            console.error('error', err);
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between ">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/">
                                        <ApplicationLogo className=" h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                    </Link>
                                </div>
                            </div>

                            <div className="hidden sm:ms-6  sm:flex sm:items-center ">
                                <div className="flex relative ">
                                    {
                                        user.is_admin &&
                                        (<SecondaryButton className='text-sm' onClick={() => setShowUserModal(true)}>
                                            <UserPlusIcon className='w-5 h-5 mr-2' />
                                            Add New User
                                        </SecondaryButton>)
                                    }

                                    <Dropdown label={<div className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <img
                                                alt={user.avatar ? `${user.name} avatar` : 'Tailwind CSS Navbar component'}
                                                src={user.avatar ? `${user.avatar}` : 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'} />
                                        </div>
                                    </div>} inline>
                                        <Dropdown.Item>
                                            <Link href={route('profile.edit')}>Profile</Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            {/* <form method="POST" action={route('logout')}>
                                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').content} />
                                                <button type="submit" className="w-full text-left">Log Out</button>
                                            </form> */}
                                            <button onClick={handleLogout} className="w-full text-left">Log Out</button>
                                        </Dropdown.Item>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        {!showingNavigationDropdown ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* {showingNavigationDropdown && (
                        <div className="sm:hidden">
                            <div className="space-y-1 pb-3 pt-2">
                                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </ResponsiveNavLink>
                            </div>

                            <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                    <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </div>
                    )} */}
                </nav>

                <main>{children}</main>
            </div>
            <Toast />
            <NewMessageNotification />
            <UserModal show={showUserModal} onClose={() => setShowUserModal(false)} />
        </>
    );
}

AuthenticatedLayout.layout = (page) => <AuthenticatedLayout header={Message}>{page}</AuthenticatedLayout>;

export default AuthenticatedLayout;
