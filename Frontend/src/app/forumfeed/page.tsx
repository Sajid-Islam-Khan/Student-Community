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

interface Forum {
    id: number;
    title: string;
    description: string;
}

export default function UserProfile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [forums, setForum] = useState<Forum[]>([]);
    

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
                    //fetch forum data
                    const forumResponse = await axios.get('http://localhost:3000/forum', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setForum(forumResponse.data);
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
            

    const handleCreateButton = () => {
        router.push('/createforum');
    }

    return (
        <div>
            <NavBar/>
            <Toaster/>
                {/* Main content body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex min-h-screen justify-center items-top">
                        <div className="max-w-md w-full rounded-lg overflow-hidden shadow-lg bg-black">
                            <div>
                                <button name='createPost' onClick={handleCreateButton} className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded mt-4 ">Create Post</button>
                            </div>

                            <div className="px-4 py-2">
                                <h3 className="text-lg font-semibold text-white">Forums</h3>
                                {forums.map((forum) => (
                                    // <div key={post.id} className="border-b border-gray-600 py-2">
                                    <div key={forum.id} className="bg-gray-700 rounded-lg p-4 my-2">
                                        <a href={`/post/${forum.id}`} className="text-white">{forum.title}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}
