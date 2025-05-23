import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GuestDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [guestName, setGuestName] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const kfupmID = localStorage.getItem('kfupmID');
    const storedUser = localStorage.getItem(kfupmID);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setGuestName(user.name);
    }

    fetch('http://localhost:5000/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error('Error loading tournaments:', err));
  }, []);

  useEffect(() => {
    if (!selectedTournament) return;

    fetch(`http://localhost:5000/api/matches/results/${selectedTournament}`)
      .then(res => res.json())
      .then(data => Array.isArray(data) && setMatchResults(data))
      .catch(err => console.error('Error loading match results:', err));

    fetch(`http://localhost:5000/api/teams/${selectedTournament}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTeams(data);
      })
      .catch(err => console.error('Error loading teams:', err));
  }, [selectedTournament]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => navigate('/');

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Guest Dashboard</h1>
        <button
          onClick={toggleMenu}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100"
        >
          {menuOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </header>

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
            <option key={i} value={t.tr_id}>{t.tr_name}</option>
          ))}
        </select>

        {selectedTournament && (
          <>
            {/* Match Results */}
            <div className="mt-6 space-y-4">
              {matchResults.map((match, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow">
                  <h3 className="font-bold mb-2">{match.team1} vs {match.team2}</h3>
                  <p>Score: {match.score1 ?? match.goal_score?.split('-')[0]} - {match.score2 ?? match.goal_score?.split('-')[1]}</p>

                  <div className="mt-2">
                    <p className="font-semibold">Scorers</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {match.scorers1?.map((s, i) => <li key={i}>{match.team1}: {s}</li>)}
                      {match.scorers2?.map((s, i) => <li key={i}>{match.team2}: {s}</li>)}
                    </ul>
                  </div>

                  <div className="mt-2">
                    <p className="font-semibold">Red Carded Players</p>
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {match.cards1?.map((p, i) => <li key={i}>{match.team1}: {p}</li>)}
                      {match.cards2?.map((p, i) => <li key={i}>{match.team2}: {p}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Team List */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Teams in This Tournament</h3>
              {teams.map((team, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow mb-4">
                  <h4 className="text-md font-bold mb-2">{team.team_name}</h4>
                  {team.players?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {team.players.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No players listed</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {menuOpen && (
        <div className="fixed inset-0 bg-black opacity-30 z-20" onClick={closeMenu}></div>
      )}

      <aside className={`fixed top-0 right-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b font-semibold text-gray-700 flex justify-between items-center">
          Guest Menu
          <button onClick={closeMenu} className="text-sm text-blue-600 hover:underline">✕</button>
        </div>
        <ul className="p-4 space-y-4 text-gray-700">
          <li className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`} onClick={() => navigate('/guest/top-scorer')}>Top Scorer</li>
          <li className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`}>Browse Match Results</li>
          <li className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`} onClick={() => navigate('/guest/red-cards')}>Red Carded Players</li>
          <li className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`} onClick={() => navigate('/guest/team-members')}>Team Members</li>
          <hr className="my-4" />
          <li onClick={handleLogout} className="cursor-pointer text-red-600 hover:underline">Logout</li>
        </ul>
      </aside>
    </div>
  );
}
