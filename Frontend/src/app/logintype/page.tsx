import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white py-4 w-full">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/">
                        <p className="text-xl font-bold">CampusNET</p>
                    </Link>
                    <div className="flex">
                        <Link href="/signup">
                            <p className="text-white hover:text-blue-500 mr-4">Sign Up</p>
                        </Link>
                        <Link href="/adminlogin">
                            <p className="text-white hover:text-blue-500 mr-4">Admin</p>
                        </Link>
                        <Link href="/userlogin">
                            <p className="text-white hover:text-blue-500">User</p>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex flex-col items-center justify-center flex-1">
                <h1 className="text-4xl font-bold mb-8">Choose an Option:</h1>
                <div className="mt-8">
                    <Link href="/adminlogin">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Admin</button>
                    </Link>
                    <Link href="/userlogin">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">User</button>
                    </Link>
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
