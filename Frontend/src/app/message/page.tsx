"use client"

//import { useState } from 'react';
//import axios from 'axios';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface User {
    id: number;
    fullName: string;
    userName: string;
    email: string;
    instituteName: string;
    employmentStatus: string;
    profilePhoto: File | null;
}

interface Message {
    id: number;
    sendersId: number;
    receiversId: number;
    text: string;
}







const MessagePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [receiverId, setReceiverId] = useState<number | null>(null);
    const [receiverName, setReceiverName] = useState<string | null>(null);
    const [text, setText] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersMap, setUsersMap] = useState<{ [userId: number]: User }>({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');
                if (token && email) {
                    const response = await axios.get<User>(`http://localhost:3000/users/findUserByEmail/${email}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(response.data);
                } else {
                    router.push('/userhomepage');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/userhomepage');
            }
        };

        fetchUserData();
    }, [router]);

    useEffect(() => {
        if (receiverId) {
            fetchReceiverName(receiverId);
            fetchMessages(user?.id || 0, receiverId);
        }
    }, [receiverId, user]);

    const fetchReceiverName = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<User>(`http://localhost:3000/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReceiverName(response.data.fullName);
        } catch (error) {
            console.error('Error fetching receiver data:', error);
            setReceiverName(null);
            toast.error('Failed to fetch receiver data');
        }
    };

    const fetchMessages = async (senderId: number, receiverId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<Message[]>(
                `http://localhost:3000/message/${senderId}/${receiverId}/messages`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch messages');
        }
    };

    const handleSendMessage = async () => {
        if (user?.id && receiverId && text.trim()) {
            try {
                const token = localStorage.getItem('token');
                await axios.post(
                    'http://localhost:3000/message/message',
                    {
                        sendersId: user.id,
                        receiversId: receiverId,
                        text: text,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                fetchMessages(user.id, receiverId); // Fetch updated messages after sending
                setText(''); // Clear message input
            } catch (error) {
                console.error('Error sending message:', error);
                toast.error('Failed to send message');
            }
        } else {
            console.error('Invalid sender ID, receiver ID, or message text');
            toast.error('Invalid sender ID, receiver ID, or message text');
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        router.push('/logintype');
    };
   

    return (

        <div className="flex min-h-screen">
    {/* Sidebar */}
    <aside className="w-64 bg-base-200 py-4 px-6">
        <div className="mb-4">
            <ul className="space-y-2">
                <li>
                    <Link href="/userhomepage">
                        <p className="text-lg font-bold">CampusNET</p>
                    </Link>
                </li>
            </ul>
        </div>
        <nav>
            <ul className="space-y-2">
                <li>
                    <Link href="/friendrequests">
                        <p className="text-blue-500 hover:text-blue-700">Friend Requests</p>
                    </Link>
                </li>
                <li>
                    <Link href="/message">
                        <p className="text-blue-500 hover:text-blue-700">Messages</p>
                    </Link>
                </li>
                <li>
                    <Link href="/events">
                        <p className="text-blue-500 hover:text-blue-700">Events</p>
                    </Link>
                </li>
                <li>
                    <Link href="/jobs">
                        <p className="text-blue-500 hover:text-blue-700">Jobs</p>
                    </Link>
                </li>
                <li>
                    <Link href="/forums">
                        <p className="text-blue-500 hover:text-blue-700">Forums</p>
                    </Link>
                </li>
                <li>
                    <Link href="/friendlist">
                        <p className="text-blue-500 hover:text-blue-700">Friends</p>
                    </Link>
                </li>
                <li>
                    <Link href="/userprofile">
                        <p className="text-blue-500 hover:text-blue-700">Feedback</p>
                    </Link>
                </li>
                <li>
                    <Link href="/aboutus">
                        <p className="text-blue-500 hover:text-blue-700">About Us</p>
                    </Link>
                </li>
            </ul>
        </nav>
    </aside>

    {/* Main content */}
    <div className="flex flex-col flex-1">
        {user && (
            <div className="navbar bg-gray-800 flex items-center justify-between py-4 px-6">
                <div>
                    <p className="text-xl text-white">{`Hi, ${user.fullName}`}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="dropdown dropdown-end">
                        <ul tabIndex={0} className="dropdown-content bg-base-100 rounded-box w-52 shadow-lg flex gap-4">
                           
                            <li>
                                <Link href="/userprofile" className="text-white-500 hover:text-blue-500">
                                    <span role="img" aria-label="Profile">MyProfile</span>
                                </Link>
                            </li>
                            <li>
                                <button className="text-white-500 hover:text-blue-500" onClick={handleLogout}>
                                    <span role="img" aria-label="Logout">Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        <Toaster />
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Send Message</h1>
            <div className="flex flex-col space-y-4 max-w-md">
                <input
                    type="number"
                    placeholder="Receiver's ID"
                    value={receiverId || ''}
                    onChange={(e) => setReceiverId(parseInt(e.target.value))}
                    className="p-2 border border-gray-300 rounded"
                />
                {receiverName && <p>Receiver: {receiverName}</p>}
                
    
                {receiverId && messages.length > 0 && (
                    <div className="border p-4 mt-4">
                        <h2 className="text-lg font-semibold mb-2">Messages</h2>
                        <div className="mt-4 space-y-2">
                            {messages.map((message) => (
                                <div key={message.id} className="flex flex-col">
                                    <strong className={user?.id === message.sendersId ? 'text-blue-500' : 'text-red-500'}>
                                        {user?.id === message.sendersId ? 'You' : receiverName}
                                    </strong>
                                    <p className="text-gray-800">{message.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                  <textarea
                    placeholder="Message text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Send Message
                </button>
            </div>
            </div>
            </div>
        </div>
    );
};

export default MessagePage;