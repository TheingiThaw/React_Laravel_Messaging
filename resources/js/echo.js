import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

// const token = localStorage.getItem('token');
// console.log('Token:', token); // Debugging

// if (!token) {
//     console.error('Token is missing!');
//     // Handle missing token logic
// }

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    auth: {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        }
    }
    // auth: {
    //     headers: {
    //         Authorization: "Bearer " + localStorage.getItem("token"),
    //         Accept: "application/json",
    //     },
    // },
    // host: `${import.meta.env.VITE_REVERB_SCHEME}://${import.meta.env.VITE_REVERB_HOST}:${import.meta.env.VITE_REVERB_PORT}`,
//     host: `${process.env.MIX_REVERB_SCHEME}://${process.env.MIX_REVERB_HOST}:${process.env.MIX_REVERB_PORT}`
});

export default window.Echo;
