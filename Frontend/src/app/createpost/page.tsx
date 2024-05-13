"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';
import NavBar from '@/components/navbar';

interface User {
    id: number;
    userName: string;
    fullName: string;
}

interface FormData {
    caption: string;
    userId: number;
}

export default function CreatePost() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<FormData>({ caption: '', userId: 0 });
    const [errors, setErrors] = useState<Partial<FormData>>({});
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
                    setFormData(prevState => ({ ...prevState, userId: userResponse.data.id }));
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('id');
            const formDataObject = new FormData();
            formDataObject.append('caption', formData.caption);
            const response = await axios.post(`http://localhost:3000/posts/${userId}/createpost`, formDataObject, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Post Created!');
            router.push('/userprofile');
        } catch (error) {
            console.error('Error during signup:', error);
            toast.error('Failed to post :(');
            router.push('/userprofile');
        }
    };

    return (
        <div>
            <NavBar/>
                {/* Main content body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex min-h-screen justify-center items-top">
                        <div className="max-w-md w-full rounded-lg overflow-hidden shadow-lg bg-black">
                            {user && (
                                <div className="p-4 text-center">
                                    <h2 className="text-xl font-semibold mt-4 text-white">{user.fullName}</h2>
                                </div>
                            )}

                            {/* Render user posts */}
                            <form onSubmit={handleSubmit}>
                                <h2>Caption:</h2>
                                <input
                                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-gray-300 text-black"
                                    type="text"
                                    id="caption"
                                    name="caption"
                                    value={formData.caption}
                                    onChange={(e) => setFormData(prevState => ({ ...prevState, caption: e.target.value }))}
                                    autoComplete='off'
                                />
                                <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Post</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
}
