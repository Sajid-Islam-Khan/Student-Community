import axios from "axios";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
    id: number;
    fullName: string;
}

const NavBar = () =>{

    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
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
                } else {
                    router.push('/userlogin');
                }
        };

        fetchUserData();
    }, [router]);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        router.push('/logintype');
    };

    
    return(
        <div>
            {/* Sidebar */}
            <div className="fixed left-2 top-2 w-64 h-full">
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
                            <Link href="/message">
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
                        <li>
                            <Link href="/wallet">
                                <p className="text-blue-500 hover:text-blue-700">Wallet</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 ml-64">
                {user && (
                    <div className="navbar bg-gray-800 flex items-center justify-between py-4 px-6">
                        <div>
                            <p className="text-xl text-white">{`Hi, ${user.fullName}`}</p>
                        </div>
                        <div className="flex gap-2 items-center">
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
            </div>
        </div>
    )
}

export default NavBar;