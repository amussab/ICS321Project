import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('');
  const navigate = useNavigate();
  const [tournamentTeams, setTournamentTeams] = useState([]);
  const [matchResults, setMatchResults] = useState([]);

  useEffect(() => {
    const kfupmID = localStorage.getItem('kfupmID');
    const storedUser = localStorage.getItem(kfupmID);
    const teams = JSON.parse(localStorage.getItem('tournament_teams')) || [];
    setTournamentTeams(teams);

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAdminName(user.name);
    }

    const savedTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    setTournaments(savedTournaments);

    const matches = JSON.parse(localStorage.getItem('match_results')) || [];
    setMatchResults(matches);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    navigate('/');
  };

  const teamsInTournament = tournamentTeams.filter(team => team.tr_id === selectedTournament);

  const handleResultChange = (index, field, value) => {
    const updated = [...matchResults];
    updated[index][field] = value;
    setMatchResults(updated);
    localStorage.setItem('match_results', JSON.stringify(updated));
  };

  const generateMatchFixtures = () => {
    const matches = [];
    for (let i = 0; i < teamsInTournament.length; i++) {
      for (let j = i + 1; j < teamsInTournament.length; j++) {
        matches.push({
          tr_id: selectedTournament,
          team1: teamsInTournament[i].team_name,
          team2: teamsInTournament[j].team_name,
          score1: '',
          score2: '',
          scorer: '',
          cards: ''
        });
      }
    }
    setMatchResults(matches);
    localStorage.setItem('match_results', JSON.stringify(matches));
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <header className="bg-purple-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={toggleMenu}
          className="bg-white text-purple-600 px-4 py-1 rounded hover:bg-purple-100"
        >
          {menuOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </header>

      <main className={`p-6 transition-opacity duration-300 ${menuOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <h2 className="text-xl font-semibold mb-4">Welcome, {adminName || 'Admin'}!</h2>
        <p className="text-gray-600 mb-4">Manage tournaments and teams below.</p>

        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="px-4 py-2 border rounded w-full max-w-sm"
        >
          <option value="">-- Select a Tournament --</option>
          {tournaments.map((t, i) => (
            <option key={i} value={t.tr_id.toString()}>
              {t.tr_name}
            </option>
          ))}
        </select>

        {selectedTournament && (
          <>
            <p className="mt-4 text-green-600">
              ✅ Managing: <strong>{tournaments.find(t => t.tr_id.toString() === selectedTournament)?.tr_name}</strong>
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-700">Teams in This Tournament</h3>
            {teamsInTournament.map((team, index) => (
              <div key={index} className="mb-4 p-4 border rounded bg-white shadow-sm">
                <h4 className="font-bold text-lg text-gray-800">{team.team_name}</h4>
                <ul className="list-disc list-inside text-gray-600 mt-2">
                  {team.players && team.players.map((player, idx) => (
                    <li key={idx}>{player}</li>
                  ))}
                </ul>
              </div>
            ))}

            <button
              onClick={generateMatchFixtures}
              className="mt-6 mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Generate Match Fixtures
            </button>

            {matchResults.length > 0 && matchResults.filter(m => m.tr_id === selectedTournament).map((match, i) => (
              <div key={i} className="mb-4 p-4 bg-white shadow rounded">
                <h4 className="font-bold mb-2">{match.team1} vs {match.team2}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder={`${match.team1} Score`}
                    value={match.score1}
                    onChange={(e) => handleResultChange(i, 'score1', e.target.value)}
                    className="border px-4 py-2 rounded"
                  />
                  <input
                    type="number"
                    placeholder={`${match.team2} Score`}
                    value={match.score2}
                    onChange={(e) => handleResultChange(i, 'score2', e.target.value)}
                    className="border px-4 py-2 rounded"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Scorer(s)"
                  value={match.scorer}
                  onChange={(e) => handleResultChange(i, 'scorer', e.target.value)}
                  className="mt-2 w-full border px-4 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Carded Players"
                  value={match.cards}
                  onChange={(e) => handleResultChange(i, 'cards', e.target.value)}
                  className="mt-2 w-full border px-4 py-2 rounded"
                />
              </div>
            ))}
          </>
        )}
      </main>

      {menuOpen && (
        <div className="fixed inset-0 bg-black opacity-30 z-20" onClick={closeMenu}></div>
      )}

      <aside className={`fixed top-0 right-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b font-semibold text-gray-700 flex justify-between items-center">
          Admin Menu
          <button onClick={closeMenu} className="text-sm text-purple-600 hover:underline">✕</button>
        </div>
        <ul className="p-4 space-y-4 text-gray-700">
          <li onClick={() => { closeMenu(); window.location.href = '/admin/add-tournament'; }} className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`}>Add Tournament</li>
          <li onClick={() => { closeMenu(); navigate('/admin/delete-tournament'); }} className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`}>Delete Tournament</li>
          <li onClick={() => { closeMenu(); navigate('/admin/add-team'); }} className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`}>Add Team</li>
          <li onClick={() => { closeMenu(); navigate('/admin/select-captain'); }} className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`}>Select Captain</li>
          <li className={`cursor-pointer ${!selectedTournament ? 'text-gray-400' : 'hover:underline'}`}>Approve Player</li>
        </ul>
        <hr className="my-4" />
        <li onClick={handleLogout} className="cursor-pointer text-red-600 hover:underline">Logout</li>
      </aside>
    </div>
  );
}
