import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { Dropdown } from 'flowbite-react';
import { useState } from 'react';

function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

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
                                <div className="relative w-24 ">
                                    <Dropdown label={<div className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <img
                                                alt="Tailwind CSS Navbar component"
                                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                        </div>
                                    </div>} inline>
                                        <Dropdown.Item>
                                            <Link href={route('profile.edit')}>Profile</Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <form method="POST" action={route('logout')}>
                                                <button type="submit" className="w-full text-left">Log Out</button>
                                            </form>
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
        </>
    );
}

// ✅ Corrected layout function
AuthenticatedLayout.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default AuthenticatedLayout;




// <div className = "navbar container mx-auto bg-base-100" >
//         <div className="flex-1">
//             <a href='index.html' className="btn btn-ghost text-xl">daisyUI</a>
//         </div>
//         <div className="flex-none">
//             <div className="dropdown dropdown-end">
//                 <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//                     <div className="w-10 rounded-full">
//                         <img
//                             alt="Tailwind CSS Navbar component"
//                             src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//                     </div>
//                 </div>
//                 <ul
//                     tabIndex={0}
//                     className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
//                     <li>
//                         <a href='#' className="justify-between">
//                             Profile
//                             <span className="badge">New</span>
//                         </a>
//                     </li>
//                     <li><a href='index.html'>Settings</a></li>
//                     <li><a href='index.html'>Logout</a></li>
//                 </ul>
//             </div>
//         </div>
// </div >
