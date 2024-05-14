"use client"
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

interface jobPost {
    
    id: number;
    userName: string;
    title: string;
    description: string;
}

export default function UserHomePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userName, setusername] = useState<string>('');
    const [title, settitle] = useState<string>('');
    const [description, setdescription] = useState<string>('');
    const [jobPosts, setJobPosts] = useState<jobPost[]>([]);


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

                  
                    const jobPostResponse = await axios.get('http://localhost:3000/job-posts', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setJobPosts(jobPostResponse.data);
                } else {
                    router.push('/userhomepage');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/userhomepage');
            }
        };

        fetchUserData();
    }, [router]);

    

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        router.push('/logintype');
    };

    const handleSubmitJobpost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            if (token && user) {
                // Send feedback to backend endpoint
                await axios.post(`http://localhost:3000/job-posts`, { userName, title, description }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                // Reset feedback text after submission
                settitle('');
                setdescription('');
                // Show success message
                toast.success('Job post submitted successfully');
            } else {
                router.push('/userlogin');
            }
        } catch (error) {
            console.error('Error submitting Job post:', error);
            // Show error message
            toast.error('Failed to submit Job post');
        }
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
                            <Link href="/messages">
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
                    <div className="navbar bg-base-100 flex items-center justify-between py-4 px-6">
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
                <div className="flex-1 overflow-y-auto">
                    <div className="container mx-auto p-6">
                        {/* Feedback form */}
                        <form onSubmit={handleSubmitJobpost}>
                        <h2 className="text-xl font-semibold text-gray-900">Post Job</h2>
                        <br></br>
                        <textarea
                                value={userName}
                                onChange={(e) => setusername(e.target.value)}
                                className="w-full border p-2 mb-4 text-black" // Added text-black class
                                placeholder="Enter your name here"
                                rows={2}
                            />
                            <textarea
                                value={title}
                                onChange={(e) => settitle(e.target.value)}
                                className="w-full border p-2 mb-4 text-black" // Added text-black class
                                placeholder="Enter your Job title here"
                                rows={2}
                            />
                            <textarea
                               
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                                className="w-full border p-2 mb-4 text-black" // Added text-black class
                                placeholder="Enter Job description"
                                rows={4}
                            />

                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                Submit Job post
                            </button>
                        </form>

                    </div>
                </div>
                {/* Main content body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
                        <Toaster />
                        {jobPosts.length > 0 && (
                            <div className="bg-white shadow-md rounded-md p-4">
                                <h2 className="text-xl font-semibold text-gray-900">Job Posts</h2>
                                <ul>
                                    {jobPosts.map(request => (
                                    <li key={request.id} className="border-b border-gray-200 py-2">
                                        <div>
                                        <p>{request.userName}</p>
                                            <p>{request.title}</p>
                                            <p>{request.description}</p>
                                        </div>
                                        <div>
                                           

                                        </div>


                                    </li>
                                ))}
                                </ul>
                            </div>
                        )}
                    </div>
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
                                {/* Social media links */}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
