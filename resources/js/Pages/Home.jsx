import { useEffect, useState } from 'react';
import Sidebar from '../App/Sidebar.jsx';
import ChatLayout from '../Layouts/ChatLayout.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

const Home = ({ children, messages = null, selectedConversation = null }) => {
    const [localMessage, setLocalMessage] = useState([]);

    // console.log(selectedConversation);

    useEffect(() => {
        setLocalMessage(messages ? [...messages].reverse() : []);
    }, [messages, selectedConversation]);

    return (
        <div className=" sm:flex md:grid md:grid-cols-3">
            <Sidebar />
            <div className=" md:col-span-2 ">
                <ChatLayout messages={localMessage} selectedConversation={selectedConversation} />
            </div>
        </div>
    );
};

Home.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default Home;
