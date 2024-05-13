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
    subject: string;
    description: string;
    userId: number;
}

export default function FAQ() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<FormData>({subject: '', description: '', userId: 0 });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [faqData, setFaqData] = useState([]);

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

        async function fetchFaqData() {
            try {
              const response = await axios.get('http://localhost:3000/faq');
              setFaqData(response.data);
            } catch (error) {
              console.error('Error fetching FAQ data:', error);
            }
          };
          fetchFaqData(); 
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('id');
            const formDataObject = new FormData();
            formDataObject.append('subject', formData.subject);
            formDataObject.append('description', formData.description);
            const response = await axios.post(`http://localhost:3000/faq/${userId}`, formDataObject, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Question Sent!');
        } catch (error) {
            toast.error('Failed to send :(');
        }
    };

    const faq = [
        {
          question: "How do I create a post on my profile?",
          answer: "To create a post on your profile, navigate to your profile page and click on the 'Create Post' button. Then, write your post content and click 'Submit'."
        },
        {
          question: "How can I join a forum?",
          answer: "To join a forum, browse the list of available forums and click on the one you're interested in. Then, click the 'Join' button or follow the instructions provided."
        },
        {
          question: "What are events?",
          answer: "Events are gatherings or activities organized within the platform. You can browse events related to various interests or create your own event to invite others."
        },
        {
          question: "How do I post a job on the job board?",
          answer: "To post a job on the job board, navigate to the job board section and click on the 'Post Job' button. Fill in the required details such as job title, description, and requirements, then submit the job posting."
        },
        {
          question: "How can I add friends?",
          answer: "You can add friends by visiting their profiles and clicking on the 'Add Friend' button. Once they accept your friend request, you'll be connected on the platform."
        }
      ];
      

    return (
        <div>
            <NavBar/>
            <Toaster/>
                {/* Main content body */}
                <div className="mt-8 ml-24">
                    <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
                    {faq.map((item, index) => (
                        <div key={index} className="mb-6">
                        <h2 className="text-xl font-bold">{item.question}</h2>
                        <p>{item.answer}</p>
                        </div>
                    ))}
                </div>

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
                                <h2>Subject:</h2>
                                <input
                                    className="w-full h-12 px-3 py-25 rounded-lg border-2 border-gray-300 text-black"
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData(prevState => ({ ...prevState, subject: e.target.value }))}
                                    autoComplete='off'
                                />
                                <h2>Description:</h2>
                                <input
                                    className="w-full h-12 px-3 py-25 rounded-lg border-2 border-gray-300 text-black"
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prevState => ({ ...prevState, description: e.target.value }))}
                                    autoComplete='off'
                                />
                                <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
}
