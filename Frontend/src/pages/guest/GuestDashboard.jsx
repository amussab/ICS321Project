import React, { useState, useEffect } from 'react';

export default function GuestDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [guestName, setGuestName] = useState('');

  const tournaments = ['Qadsia Cup 2024', 'Riyadh Open', 'KFUPM League'];

  useEffect(() => {
    const kfupmID = localStorage.getItem('kfupmID');
    const storedUser = localStorage.getItem(kfupmID);

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setGuestName(user.name);
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Guest Dashboard</h1>
        <button
          onClick={toggleMenu}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100"
        >
          {menuOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </header>

      {/* Main Content */}
      <main className={`p-6 transition-opacity duration-300 ${menuOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <h2 className="text-xl font-semibold mb-4">Welcome, {guestName || 'Guest'}!</h2>
        <p className="text-gray-600 mb-4">Select a tournament to begin exploring.</p>

        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="px-4 py-2 border rounded w-full max-w-sm"
        >
          <option value="">-- Select a Tournament --</option>
          {tournaments.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        {selectedTournament && (
          <p className="mt-4 text-green-600">
            ✅ You're viewing: <strong>{selectedTournament}</strong>
          </p>
        )}
      </main>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-20"
          onClick={closeMenu}
        ></div>
      )}

      {/* Slide-in Menu */}
      <aside
        className={`fixed top-0 right-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b font-semibold text-gray-700 flex justify-between items-center">
          Guest Menu
          <button onClick={closeMenu} className="text-sm text-blue-600 hover:underline">✕</button>
        </div>
        <ul className="p-4 space-y-4 text-gray-700">
          <li className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`}>
            Browse Match Results
          </li>
          <li className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`}>
            Top Scorer
          </li>
          <li className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`}>
            Red Carded Players
          </li>
          <li className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`}>
            Team Members
          </li>
        </ul>
      </aside>
    </div>
  );
}
