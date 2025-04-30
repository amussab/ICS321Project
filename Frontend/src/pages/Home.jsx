// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
    {
        title: 'System Users',
        desc: 'Whether you are a player, coach, or admin, we have you covered.',
        icon: '👤'
    },
    {
        title: 'Tournament Admin Features',
        desc: 'Manage tournaments with ease, from scheduling to results.',
        icon: '🏆',
    },
    {
        title: 'Managing Teams',
        desc: 'Create and manage teams effortlessly.',
        icon: '⚡',
    },
    {
        title: 'Browse Statistics',
        desc: 'Browse player and team statistics to make informed decisions.',
        icon: '📈'
    },
    {
        title: 'Authentication',
        desc: 'Secure login and user management.',
        icon: '🔒',
    },
    {
        title: 'Reminding Emails',
        desc: 'Get reminders for upcoming matches.',
        icon: '📧',
    },
];

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-16 px-6 text-center relative">
                {/* Navbar */}
                <nav className="absolute top-4 right-6 flex gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-white hover:underline"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-white text-purple-600 font-semibold px-4 py-2 rounded hover:bg-purple-100"
                    >
                        Start Now
                    </button>
                </nav>


                {/* Title + Subtext */}
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">Manage Your Tournament Smarter</h1>
                <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto">
                    Organize teams, track results, and communicate easily with one platform built for tournaments.
                </p>
            </header>



            {/* Features */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                    Powerful Features to Help You Succeed
                </h2>
                <p className="text-center text-gray-600 mb-10">
                    Everything you need to manage matches, players, and points — in one place.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                            <div className="text-3xl mb-3">{f.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                            <p className="text-gray-600">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            {/* Call-to-Action Section */}
            <section className="bg-gradient-to-r from-purple-600 to-purple-500 text-white text-center py-16">
                <h2 className="text-3xl font-bold mb-2">Ready to Join the Competition?</h2>
                <p className="mb-6">Discover how easy it is to manage teams and matches.</p>
                <button
                    onClick={() => navigate('/signup')}
                    className="bg-white text-purple-600 px-6 py-2 rounded font-semibold hover:bg-purple-100 transition"
                >
                    Get Started
                </button>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-10 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo + Description */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">⚽ Tournament System</h3>
                        <p>All-in-one system for managing football tournaments, teams, and match results.</p>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="font-semibold text-white mb-2">Features</h4>
                        <ul className="space-y-1">
                            <li>Match Results</li>
                            <li>Team Management</li>
                            <li>Goal Stats</li>
                            <li>Email Reminders</li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-white mb-2">Resources</h4>
                        <ul className="space-y-1">
                            <li>Documentation</li>
                            <li>Help Center</li>
                            <li>Support</li>
                            <li>Tutorials</li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-white mb-2">Company</h4>
                        <ul className="space-y-1">
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    © 2025 Tournament System. All rights reserved.
                </div>
            </footer>

        </div>
    );
}
