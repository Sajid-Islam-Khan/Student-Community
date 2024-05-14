"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
//import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import NavBar from '@/components/navbar';

interface User {
    id: number;
    fullName: string;
    userName: string;
    profilePhoto: string | null;
}

interface Forum {
    id: number;
    title: string;
    description: string;
}

interface Comment {
    id: number;
    content: string;
    userId: number;
    forumId: number;
}

interface FormData {
    content: string;
    userId: number;
    forumId: number;
}

export default function Post( {params} : {params:{id: number}} ) {
    const router = useRouter();
    const forumid = params.id;
    const [user, setUser] = useState<User | null>(null);
    const [forum, setForum] = useState<Forum| null>(null);
    const [postComments, setComments] = useState<Comment[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({ content: '', userId: 0, forumId: 0});
    

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
                    const forumResponse = await axios.get(`http://localhost:3000/forum/${forumid}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setForum(forumResponse.data);

                    
                } else {
                    router.push('/userprofile');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/userprofile');
            }
            getComments();
        };
        fetchData();
            }, [router]);

    const getComments = async () => {
        const token = localStorage.getItem('token');
        const commentResponse = await axios.get(`http://localhost:3000/comments/forum/${forumid}/comments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        setComments(commentResponse.data);
        console.log('comment fetched');
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('id');
            const formDataObject = new FormData();
            formDataObject.append('content', formData.content);
            const response = await axios.post(`http://localhost:3000/comments/create/${userId}/forum/${forumid}`, formDataObject, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Comment Created!');
            location.reload();
        } catch (error) {
            toast.error('Failed to comment :(');
        }
    };

    return (
        <div>
            <NavBar />
            <Toaster/>
                {/* Main content body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex min-h-screen justify-center items-top">
                        <div className="max-w-md w-full rounded-lg overflow-hidden shadow-lg bg-black">

                            {/* Render user posts */}
                            <div className="px-4 py-2">
                                {forum &&(
                                    // <div key={post.id} className="border-b border-gray-600 py-2">
                                    <div key={forum.id}>
                                    <h2 className="text-xl font-semibold bg-gray-200 rounded-lg p-4 my-4 text-black">{forum.title}</h2>
                                    <p className="text-l bg-gray-200 rounded-lg p-4 my-4 text-black">{forum.description}</p>
                                    </div>
                                )}     
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Comments</h3>
                                {
                                    postComments.length > 0 ? (
                                        postComments.map((comment) => (
                                            <div key={comment.id}>
                                                <p className="bg-gray-700 rounded-lg p-4 my-2 text-white">{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-white">No comments yet.</p>
                                    )
                                }
                                <form onSubmit={handleSubmit}>
                                    <input 
                                        className="w-full h-12 px-3 py-2 rounded-lg border-2 border-gray-300 text-black" 
                                        type='text'
                                        id='comment'
                                        name='comment'
                                        value={formData.content}
                                        onChange={(e) => setFormData(prevState => ({ ...prevState, content: e.target.value }))}
                                        autoComplete="off"
                                    />
                                    <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Comment</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

        </div>
        

                
                    );
}
