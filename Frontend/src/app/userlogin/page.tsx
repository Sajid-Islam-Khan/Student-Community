"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';

interface FormData {
    email: string;
    password: string;
}

export default function Signin() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert('Please fill out all fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/users/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);

            const token = response.data;
            console.log(token.access_token);
            localStorage.setItem('token', token.access_token);
            localStorage.setItem('id', token.id);
            localStorage.setItem('email', formData.email);


            toast.success('Sign in successful');
            router.push('/userhomepage');
        } catch (error) {
            console.error('Error signing in:', error);
            toast.error('Sign in failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-black">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white py-4 w-full">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/logintype">
                        <p className="text-xl font-bold">CampusNET</p>
                    </Link>
                    <div className="flex">
                        <Link href="/adminlogin">
                            <p className="text-white hover:text-blue-500 mr-4">Admin</p>
                        </Link>
                        <Link href="/userlogin">
                            <p className="text-white hover:text-blue-500">User</p>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex-1 min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <Toaster />
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">User Sign In</h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input id="email" name="email" type="text" autoComplete="email" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" value={formData.email} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input id="password" name="password" type="password" autoComplete="current-password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" value={formData.password} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 py-6 w-full mt-auto">
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
    );
}
