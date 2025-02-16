import React from 'react';
import UserAvatar from './UserAvatar';
import GroupAvatar from './GroupAvatar';

const ChatHeader = ({ selectedConversation }) => {
    return (
        <div className="flex gap-3 p-2">
            <div className="flex items-center">
                <div className="avatar">
                    <div className="w-12">
                        {selectedConversation ? (
                            selectedConversation.is_group ? (
                                <GroupAvatar conversation={selectedConversation} />

                            ) : (
                                <UserAvatar conversation={selectedConversation} />
                            )
                        ) : null}
                    </div>
                </div>
            </div>
            <div className=" block justify-center items-center">
                <h1>{selectedConversation?.name || 'Group'}</h1>
                {selectedConversation?.is_group && <p className="text-xs text-slate-400">4 users</p>}
            </div>
        </div>
    );
};

export default ChatHeader;
