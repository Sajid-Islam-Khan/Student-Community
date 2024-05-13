"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface User {
    fullName: string;
    userName: string;
    email: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [totalEvents, setTotalEvents] = useState(0);
    const [totalJobPosts, setTotalJobPosts] = useState(0);
    const [totalForumPosts, setTotalForumPosts] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalSubscribers, setTotalSubscribers] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');
                if (token) {
                    // Fetch user data
                    const userResponse = await axios.get('http://localhost:3000/admin/findAdminByEmail/' + email, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(userResponse.data);

                    const totalUsersResponse = await axios.get('http://localhost:3000/dashboard/totalusers', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTotalUsers(totalUsersResponse.data.totalUsers);

                    const totalFeedbacksResponse = await axios.get('http://localhost:3000/dashboard/totalfeedbacks', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTotalFeedbacks(totalFeedbacksResponse.data.totalFeedbacks);

                    const totalEventsResponse = await axios.get('http://localhost:3000/dashboard/totalevents', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTotalEvents(totalEventsResponse.data.totalEvents);

                    const totalJobPostsResponse = await axios.get('http://localhost:3000/dashboard/totaljobposts', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTotalJobPosts(totalJobPostsResponse.data.totalJobPosts);

                    const totalForumPostsResponse = await axios.get('http://localhost:3000/dashboard/totalforumposts', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTotalForumPosts(totalForumPostsResponse.data.totalForumPosts);

                    const totalPostsResponse = await axios.get('http://localhost:3000/dashboard/totalposts', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTotalPosts(totalPostsResponse.data.totalPosts);

                    const totalSubscribersResponse = await axios.get('http://localhost:3000/dashboard/total-subscribers', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTotalSubscribers(totalSubscribersResponse.data.totalSubscribers);

                    const totalRevenueResponse = await axios.get('http://localhost:3000/dashboard/total-revenue', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTotalRevenue(totalRevenueResponse.data.totalAmountAdded);
                } else {
                    router.push('/adminlogin');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/adminlogin');
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        router.push('/logintype');
    };

    const metricsData = [
        { name: "Total Number of Users", value: totalUsers },
        { name: "Total Number of Feedbacks", value: totalFeedbacks },
        { name: "Total Number of Events", value: totalEvents },
        { name: "Total Number of Job Posts", value: totalJobPosts },
        { name: "Total Number of Forums", value: totalForumPosts },
        { name: "Total Number of Posts", value: totalPosts },
        { name: "Total Subscribers", value: totalSubscribers },
        { name: "Total Revenue", value: totalRevenue }
    ];

    return (
        <>

            {user && (
                <div className="navbar bg-gray-800 flex items-center justify-between py-4 px-6">
                    <div>
                        <p className="text-xl text-white">CampusNET</p>
                        <p className="text-xl text-white">{`Hi, ${user.fullName}`}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="dropdown dropdown-end">
                            <ul tabIndex={0} className="dropdown-content bg-base-100 rounded-box w-52 shadow-lg flex gap-4">
                                <li>
                                    <Link href="/giveaboutus" className="text-white-500 hover:text-blue-500">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/feedbacks" className="text-white-500 hover:text-blue-500">
                                        Feedbacks
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className="text-white-500 hover:text-blue-500"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}


            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 justify-center bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
                <Toaster />
                {metricsData.map((metric, index) => (
                    <div key={index} className="bg-white shadow-md rounded-md p-4 w-64 h-64">
                        <h2 className="text-xl font-semibold text-gray-900">{metric.name}</h2>
                        <div className="flex justify-center">
                            <svg viewBox="0 0 100 100" className="block mx-auto w-full h-full">
                                <rect x="10" y="10" width={`${metric.value * 2}%`} height="30" fill="#3182CE" />
                                <text x={`${metric.value * 2 + 12}`} y="30" textAnchor="start" dy="0.4em" className="text-gray-900 font-semibold text-lg">{metric.value}</text>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="bg-gray-800 text-gray-300 py-6">
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-xl font-bold">CampusNET</p>
                        <p className="mt-2">123 Kuratoli, Dhaka, Bangladesh</p>
                        <p className="mt-1">CampusNet@yourcompany.com</p>
                        <p className="mt-1">+8801820153496</p>
                    </div>
                    <div>
                        <p>Follow Us:</p>
                        <div className="flex mt-2">
                            <a href="#" className="text-gray-300 hover:text-gray-400 mr-4">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 6a2 2 0 00-2-2h-4.586a2 2 0 01-1.414-.586l-1.086-1.086A2 2 0 0010.586 2H6a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2v-7l3.5-3.5L21 6zm-7 2a4 4 0 100 8 4 4 0 000-8z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-300 hover:text-gray-400 mr-4">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l1 1 1-1M3 10v4a7 7 0 007 7h1a7 7 0 007-7v-4M8 14h0"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-300 hover:text-gray-400">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10c-1.5 0-2.5.2-3.7.5 1.1-.7 2.2-1.7 2.8-3-1 .6-2 1-3.1 1.2C16.4 7.8 15 7 13.5 7c-2.2 0-4 1.8-4 4 0 .3 0 .6.1.9C7.8 12.9 5.2 11 3 11c-.4 0-.8 0-1.2.1 1.7 1.1 3.6 1.7 5.7 1.8-.3.9-.4 1.8-.4 2.7 0 5.2 2.8 5.2 5.2 0 .4 0 .8-.1 1.2 1.1 0 2.3-.2 3.4-.6-.4 1.1-1.1 2-2.1 2.7.9-.1 1.8-.4 2.7-.8.6.4 1.3.6 2 .6 2.4 0 4.3-2 4.3-4.4 0-.1 0-.3 0-.4.8-.6 1.5-1.4 2.1-2.3-.8.3-1.7.5-2.5.6.9-.5 1.6-1.2 2.2-2-.9.3-1.8.5-2.7.7.8-.5 1.6-1 2.3-1.7z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>



        </>
    );
}
