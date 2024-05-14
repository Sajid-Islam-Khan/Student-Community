"use client"

//import { useState } from 'react';
//import axios from 'axios';
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

interface Event {
  id: number;
  userId: number;
  title: string;
  description: string;
}

const EventPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [user, setUser] = useState<User | null>(null);
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if (token && email) {
          const userResponse = await axios.get<User>(
            `http://localhost:3000/users/findUserByEmail/${email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(userResponse.data);
          fetchEvents(userResponse.data.id); // Fetch events for this user
        } else {
          router.push('/userhomepage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/userhomepage');
      }
    };

    fetchUserData();
  }, [router]);

  const fetchEvents = async (userId: number) => {
    try {
      const response = await axios.get<Event[]>(`http://localhost:3000/event/?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (token && user) {
        await axios.post(
          'http://localhost:3000/event/event',
          { ...formData, userId: user.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,

            },
          }
        );

        toast.success('Event created successfully');
        setFormData({ title: '', description: '' });
        fetchEvents(user.id); // Fetch events after creating a new event


      } else {
        console.error('Token not found or user not authenticated');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleEditEvent = async (eventId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.put(
          `http://localhost:3000/event/${eventId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEditEventId(null);
        setFormData({ title: '', description: '' });
        fetchEvents(user?.id || 0); // Fetch events after editing
      } else {
        console.error('Token not found');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`http://localhost:3000/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchEvents(user?.id || 0); // Fetch events after deleting
      } else {
        console.error('Token not found');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleStartEdit = (eventId: number, title: string, description: string) => {
    setEditEventId(eventId);
    setFormData({ title, description });
  };

  const handleCancelEdit = () => {
    setEditEventId(null);
    setFormData({ title: '', description: '' });
  };

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
            <div className="navbar bg-gray-800 flex items-center justify-between py-4 px-6">
                <div>
                    <p className="text-xl text-white">{`Hi, ${user.fullName}`}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="dropdown dropdown-end">
                        <ul tabIndex={0} className="dropdown-content bg-base-100 rounded-box w-52 shadow-lg flex gap-4">
                           
                            <li>
                                <Link href="/userprofile" className="text-white-500 hover:text-blue-500">
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Management System</h1>

      {user && (
        <>
          {/* Event Form */}
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Create Event</h2>
            <form onSubmit={handleCreateEvent} className="flex flex-col gap-2">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded text-black"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded text-black"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Create Event
              </button>
            </form>
          </div>

          {/* Event List */}
          <div>
            <h2 className="text-lg font-bold mb-2">All Events</h2>
            {events.map((event) => (
              <div key={event.id} className="border border-gray-300 p-4 rounded mb-2">
                {editEventId === event.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditEvent(event.id);
                    }}
                    className="flex flex-col gap-2"
                  >
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 rounded"
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 rounded"
                    />
                    <div>
                      <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                    <p>{event.description}</p>
                    {user.id === event.userId && (
                      <div className="flex mt-2">
                        <button
                          onClick={() => handleStartEdit(event.id, event.title, event.description)}
                          className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}


      {/* Display events created by the logged-in user */}
      {user && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Events Created by You</h2>
          {events
            .filter((event) => event.userId === user.id)
            .map((event) => (
              <div key={event.id} className="border border-gray-300 p-4 rounded mb-2">
                <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                <p>{event.description}</p>
                <div className="flex mt-2">
                  <button
                    onClick={() => handleStartEdit(event.id, event.title, event.description)}
                    className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default EventPage;