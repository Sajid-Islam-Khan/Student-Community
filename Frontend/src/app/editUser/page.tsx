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
    fullName: string;
    email: string;
    instituteName: string;
    employmentStatus: string;
    password: string;
    confirmPassword: string;
}

export default function EditUser() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<FormData>({ fullName: '', email: '', instituteName: '', employmentStatus: '', password: '', confirmPassword: '' });
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
    
            // Iterate over formData and append non-empty fields to formDataObject
            Object.entries(formData).forEach(([key, value]) => {
                if (value) {
                    formDataObject.append(key, value);
                }
            });
    
            // Check if password and confirmPassword match
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
    
            const response = await axios.patch(`http://localhost:3000/users/${userId}/`, formDataObject, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Updated!');
            router.push('/userprofile');
        } catch (error) {
            toast.error('Failed to update :(');
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
                                <h2>Fullname:</h2>
                                <input 
                                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-gray-300 text-black" 
                                    type="text" 
                                    id="fullName" 
                                    name="fullName" 
                                    value={formData.fullName}
                                    onChange={(e) => setFormData(prevState => ({ ...prevState, fullName: e.target.value }))}
                                    autoComplete='off'
                                />
                                <h2>Email:</h2>
                                <input 
                                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-gray-300 text-black" 
                                    type="text" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData(prevState => ({ ...prevState, email: e.target.value }))}
                                    autoComplete='off'
                                />
                                <h2>Employment Status:</h2>
                                <input 
                                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-gray-300 text-black" 
                                    type="text" 
                                    id="employmentStatus" 
                                    name="employmentStatus" 
                                    value={formData.employmentStatus}
                                    onChange={(e) => setFormData(prevState => ({ ...prevState, employmentStatus: e.target.value }))}
                                    autoComplete='off'
                                />
                                <h2>Institution:</h2>
                                <input 
                                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-gray-300 text-black" 
                                    type="text" 
                                    id="instituteName" 
                                    name="instituteName" 
                                    value={formData.instituteName}
                                    onChange={(e) => setFormData(prevState => ({ ...prevState, instituteName: e.target.value }))}
                                    autoComplete='off'
                                />
                                <h2>Password:</h2>
                                <input 
                                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-gray-300 text-black" 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    value={formData.password}
                                    onChange={(e) => setFormData(prevState => ({ ...prevState, password: e.target.value }))}
                                    autoComplete='off'
                                />
                                <h2>Confirm Password:</h2>
                                <input 
                                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-gray-300 text-black" 
                                    type="password" 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prevState => ({ ...prevState, confirmPassword: e.target.value }))}
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
