
import { usePage } from '@inertiajs/react';
import Sidebar from '../App/Sidebar.jsx';
import ChatLayout from '../Layouts/ChatLayout.jsx';
import { useEffect, useState } from 'react';



const Home = ({ children, messages, selectedConversation }) => {

    const [localMessage, setLocalMessage] = useState([]);

    useEffect(() => {
        setLocalMessage(messages);
    }, [messages, selectedConversation]);

    console.log('home messages', messages);
    return (
        <>

            <div className="grid grid-cols-3">
                <Sidebar />
                <div className="col-span-2">
                    <ChatLayout messages={messages} selectedConversation={selectedConversation} />
                </div>
            </div>

            <div>
                {children}
            </div>
        </>
    )
}

export default Home
