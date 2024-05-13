"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import NavBar from '@/components/navbar';

interface User {
    id: number;
    fullName: string;
    userName: string;
    email: string;
    instituteName: string;
    employmentStatus: string;
    profilePhoto: string | null;
}

interface Post {
    id: number;
    caption: string;
    likes: number;
    dislikes: number;
    //postPhoto: string;
}

export default function UserProfile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    

    useEffect(() => {
        const fetchData = async () => {
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
                    //fetch post data
                    const postsResponse = await axios.get(`http://localhost:3000/posts/${userResponse.data.id}/posts`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUserPosts(postsResponse.data);
                } else {
                    router.push('/userlogin');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/userlogin');
            }
        };
        fetchData();
            }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        router.push('/logintype');
    };

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Send search query to backend endpoint
                const searchResponse = await axios.get(`http://localhost:3000/search?query=${searchQuery}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Handle search response
                console.log('Search results:', searchResponse.data);
            } else {
                router.push('/userlogin');
            }
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const handleEditButton = () => {
        router.push('/editUser');
    }

    const handleBadgeButton = () => {
        router.push('/');
    }

    const handleCreateButton = () => {
        router.push('/createpost');
    }

    return (
        <div>
            <NavBar/>
                {/* Main content body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex min-h-screen justify-center items-top">
                        <div className="max-w-md w-full rounded-lg overflow-hidden shadow-lg bg-black">
                            {user && (
                                <div className="p-4 text-center">
                                    {user.profilePhoto && (
                                        <img src={user.profilePhoto} alt="Profile" className="w-32 h-32 mx-auto rounded-full" />
                                    )}
                                    <h2 className="text-xl font-semibold mt-4 text-white">{user.fullName}</h2>
                                    <h3 className='text-white'>{user.employmentStatus} at {user.instituteName}</h3>
                                    <button name='edituser' onClick={handleEditButton} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Edit</button>
                                    <button name='badge' onClick={handleBadgeButton} className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded mt-4">Badge</button>
                                </div>
                            )}
                            <div>
                                <button name='createPost' onClick={handleCreateButton} className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded mt-4 ">Create Post</button>
                            </div>

                            {/* Render user posts */}
                            <div className="px-4 py-2">
                                <h3 className="text-lg font-semibold text-white">User Posts</h3>
                                {userPosts.map((post) => (
                                    // <div key={post.id} className="border-b border-gray-600 py-2">
                                    <div key={post.id} className="bg-gray-700 rounded-lg p-4 my-2">
                                        <a href={`/post/${post.id}`} className="text-white">{post.caption}</a>
                                        {/* <p className="text-sm text-gray-400">{post.content}</p> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}
