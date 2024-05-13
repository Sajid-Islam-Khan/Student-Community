"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
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

interface JobPost {
    id: number;
    userId: number;
    title: string;
    description: string;
    jobcircular: string;
}

interface Posts {
    id: number;
    userId: number;
    caption: string;
    likes: number;
    dislikes: number;
    postPhoto: string;
}

interface Forum {
    id: number;
    userId: number;
    title: string;
    description: string;
}

interface Event {
    id: number;
    userId: number;
    title: string;
    description: string;
}

interface Comment {
    id: number;
    userId: number;
    postId: number;
    content: string;
}


export default function UserHomePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [friendPosts, setFriendPosts] = useState<{
        jobPosts: JobPost[];
        posts: Posts[];
        forums: Forum[];
        events: Event[];
        comments: Comment[];
    } | null>(null);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');
                if (token) {
                    // Fetch user data
                    const userResponse = await axios.get('http://localhost:3000/users/findUserByEmail/' + email, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(userResponse.data);
                } else {
                    router.push('/userlogin');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/userlogin');
            }
        };

        fetchUserData();
    }, [router]);

    useEffect(() => {
        const fetchFriendPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token && user) {
                    const response = await axios.get<{
                        jobPosts: JobPost[];
                        posts: Posts[];
                        forums: Forum[];
                        events: Event[];
                        comments: Comment[];
                    }>(`http://localhost:3000/newsfeed/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setFriendPosts(response.data);
                } else {
                    router.push('/userhomepage');
                }
            } catch (error) {
                console.error('Error fetching friend posts:', error);
            }
        };

        if (user) {
            fetchFriendPosts();
        }
    }, [user]);


    const handleSeePost = (post: any) => {
        const postId = post.id;
        router.push(`http://localhost:3001/post/${postId}`);
    }



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

            {/* Main content */}
            <div className="flex flex-col flex-1">
                {user && (
                    <div className="navbar bg-gray-800 flex items-center justify-between py-4 px-6">
                        <div>
                            <p className="text-xl text-white">{`Hi, ${user.fullName}`}</p>
                        </div>
                        <div className="flex gap-2 items-center">
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

                {/* Main content body */}
                <div className="flex-1 overflow-y-auto px-4 py-8">
                    {/* Display friend posts */}
                    {friendPosts && (
                        <div>
                            {/* Display job posts */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Job Posts</h2>
                                {friendPosts.jobPosts.map(jobPost => (
                                    <div key={jobPost.id} className="border border-gray-200 p-4 rounded-lg mb-4">
                                        <p className="font-semibold text-lg mb-2">{jobPost.title}</p>
                                        <p className="text-white-700">{jobPost.description}</p>
                                        <p className="text-blue-500 hover:underline mt-2">Job Circular: {jobPost.jobcircular}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Display forum posts */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Forum Posts</h2>
                                {friendPosts.forums.map(forum => (
                                    <div key={forum.id} className="border border-gray-200 p-4 rounded-lg mb-4">
                                        <p className="font-semibold text-lg mb-2">{forum.title}</p>
                                        <p className="text-white-700">{forum.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Display events */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Events</h2>
                                {friendPosts.events.map(event => (
                                    <div key={event.id} className="border border-gray-200 p-4 rounded-lg mb-4">
                                        <p className="font-semibold text-lg mb-2">{event.title}</p>
                                        <p className="text-white-700">{event.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Display posts */}
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Posts</h2>
                                {friendPosts.posts.map(post => (
                                    <div key={post.id} className="border border-gray-200 p-4 rounded-lg mb-4">
                                        <p className="font-semibold text-lg mb-2">{post.caption}</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-white-700">Likes: {post.likes}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-white-700">Dislikes: {post.dislikes}</p>
                                        </div>

                                        <li>
                                            <button onClick={() => handleSeePost(post)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">See Post</button>
                                        </li>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>



                {/* Footer */}
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
            </div>
        </div>
    );
}
