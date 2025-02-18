import { useEffect, useState } from 'react';
import Sidebar from '../App/Sidebar.jsx';
import ChatLayout from '../Layouts/ChatLayout.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

const Home = ({ children, messages = null, selectedConversation = null }) => {
    const [localMessage, setLocalMessage] = useState([]);

    useEffect(() => {
        setLocalMessage(messages ? messages.data.reverse() : []);
    }, [messages, selectedConversation]);

    return (
        <div className="grid grid-cols-3">
            <Sidebar />
            <div className="col-span-2">
                <ChatLayout messages={localMessage} selectedConversation={selectedConversation} />
            </div>
        </div>
    );
};

Home.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default Home;
