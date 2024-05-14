"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';

interface FormData {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    instituteName: string;
    employmentStatus: string;
    legalAgreement: string;
    profilePhoto: File | '';
}

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        instituteName: '',
        employmentStatus: '',
        legalAgreement: '',
        profilePhoto: '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length === 0) {
            // Check if passwords match
            if (formData.password !== formData.confirmPassword) {
                setErrors({ confirmPassword: 'Passwords do not match' });
                return;
            }

            try {
                const formDataObject = new FormData();
                formDataObject.append('fullName', formData.fullName);
                formDataObject.append('userName', formData.userName);
                formDataObject.append('email', formData.email);
                formDataObject.append('password', formData.password);
                formDataObject.append('confirmPassword', formData.confirmPassword);
                formDataObject.append('instituteName', formData.instituteName);
                formDataObject.append('employmentStatus', formData.employmentStatus);
                formDataObject.append('legalAgreement', formData.legalAgreement);
                formDataObject.append('profilePhoto', formData.profilePhoto || '');

                console.log(formDataObject);
                const response = await axios.post('http://localhost:3000/users/auth/register', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                toast.success('Signup successful!');
                router.push('/signup');

            } catch (error) {
                console.error('Error during signup:', error);
                toast.error('Signup failed. Please try again.');
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === 'profilePhoto') {
            setFormData({ ...formData, [name]: files ? files[0] : '' });
            setErrors({ ...errors, [name]: '' });
        } else {
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = (formData: FormData): Partial<FormData> => {
        const errors: Partial<FormData> = {};

        if (!formData.fullName) {
            errors.fullName = 'Full name length must be between 8 and 100 characters';
        }

        if (!formData.userName) {
            errors.userName = 'Username length must be between 4 and 100 characters';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Invalid email address';
        }

        if (!formData.password) {
            errors.password = 'Passwords must be at least 8 characters, should include atleast one uppercase and one lowercase letter and a special character and a digit';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        }

        if (!formData.instituteName) {
            errors.instituteName = 'Institute Name is required';
        }

        if (!formData.employmentStatus) {
            errors.employmentStatus = 'Employment Status is required';
        }

        if (!formData.legalAgreement) {
            errors.legalAgreement = 'Legal Agreement is required(Answer "yes" or "no")';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    return (

        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/">
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
            <div className="flex-1">
                <div className="max-w-md mx-auto mt-8">


                    <div className="max-w-md mx-auto mt-8">
                        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                        <Toaster />
                        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-gray-700 font-bold mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.fullName && <p className="text-red-500 text-xs italic">{errors.fullName}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="userName" className="block text-gray-700 font-bold mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.userName && <p className="text-red-500 text-xs italic">{errors.userName}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="instituteName" className="block text-gray-700 font-bold mb-2">
                                    Institute Name
                                </label>
                                <input
                                    type="text"
                                    id="instituteName"
                                    name="instituteName"
                                    value={formData.instituteName}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.instituteName && <p className="text-red-500 text-xs italic">{errors.instituteName}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="employmentStatus" className="block text-gray-700 font-bold mb-2">
                                    Employment Status
                                </label>
                                <input
                                    type="text"
                                    id="employmentStatus"
                                    name="employmentStatus"
                                    value={formData.employmentStatus}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.employmentStatus && <p className="text-red-500 text-xs italic">{errors.employmentStatus}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="legalAgreement" className="block text-gray-700 font-bold mb-2">
                                    Legal Agreement
                                </label>
                                <input
                                    type="text"
                                    id="legalAgreement"
                                    name="legalAgreement"
                                    value={formData.legalAgreement}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.legalAgreement && <p className="text-red-500 text-xs italic">{errors.legalAgreement}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="profilePhoto" className="block text-gray-700 font-bold mb-2">
                                    Profile Photo
                                </label>
                                <input
                                    type="file"
                                    id="profilePhoto"
                                    name="profilePhoto"
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.profilePhoto && typeof errors.profilePhoto === 'string' && (
                                    <p className="text-red-500 text-xs italic">{errors.profilePhoto}</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </div>

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
