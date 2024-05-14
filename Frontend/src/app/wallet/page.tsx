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

interface Wallet {
    id: number;
    usId: number;
    cardnumber: number;
    cvv: number;
    pin: number;
    amount: number;
    balance: number;
}

const WalletPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userWallet, setUserWallet] = useState<Wallet | null>(null); // State to hold user's wallet
    const [cardnumber, setCardnumber] = useState<number>(0);
    const [cvv, setCvv] = useState<number>(0);
    const [pin, setPin] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');
                if (token) {
                    const userResponse = await axios.get<User>(
                        `http://localhost:3000/users/findUserByEmail/${email}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setUser(userResponse.data);

                    // Fetch user's wallet after user data is fetched
                    const walletResponse = await axios.get<Wallet>(
                        `http://localhost:3000/wallet/${userResponse.data.id}/wallet`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setUserWallet(walletResponse.data);
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

    const handleSendWallet = async () => {
        try {
            const token = localStorage.getItem('token');
            const senderId = user?.id;
            if (!senderId) {
                console.error('User ID not found');
                return;
            }

            const response = await axios.post(
                'http://localhost:3000/wallet/addbalance',
                {
                    usId: senderId,
                    cardnumber,
                    cvv,
                    pin,
                    amount,
                    balance: 0, // Assuming balance should be initialized to 0
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Wallet sent:', response.data);

            // After sending wallet, fetch updated wallet details
            const walletResponse = await axios.get<Wallet>(
                `http://localhost:3000/wallet/${senderId}/wallet`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUserWallet(walletResponse.data); // Update userWallet state with updated balance

        } catch (error) {
            console.error('Error sending wallet:', error);
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
                            <Link href="/givefeedback">
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
                                        <a href="/search" className="text-white-500 hover:text-blue-500">
                                            <span role="img" aria-label="Profile">Search</span>
                                        </a>
                                    </li>
                                    <li>
                                        <Link href="/givefeedback" className="text-white-500 hover:text-blue-500">
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
                    <h1 className="text-2xl font-bold mb-4">Send Wallet</h1>
                    <div className="flex flex-col space-y-4 max-w-md">
                        <p className="text-blue-500 hover:text-blue-700">Card Number :</p>
                        <input
                            type="number"
                            placeholder="Card Number"
                            value={cardnumber}
                            onChange={(e) => setCardnumber(parseInt(e.target.value))}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <p className="text-blue-500 hover:text-blue-700">CVV :</p>
                        <input
                            type="number"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(parseInt(e.target.value))}
                            className="p-2 border border-gray-300 rounded"
                        />

                        <p className="text-blue-500 hover:text-blue-700">PIN :</p>
                        <input
                            type="number"
                            placeholder="PIN"
                            value={pin}
                            onChange={(e) => setPin(parseInt(e.target.value))}
                            className="p-2 border border-gray-300 rounded"
                        />

                        <p className="text-blue-500 hover:text-blue-700">Amount :</p>
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <button
                            onClick={handleSendWallet}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Send Wallet
                        </button>
                    </div>
                    <div className="container mx-auto p-4">
                        <h1 className="text-2xl font-bold mb-4">Wallet Details</h1>
                        {userWallet ? (
                            <div>

                                <p className="text-blue-500 hover:text-blue-700">Balance: {userWallet.balance}</p>
                            </div>
                        ) : (
                            <p>Loading wallet details...</p>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default WalletPage;