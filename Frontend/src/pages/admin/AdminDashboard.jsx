import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('');
  const [tournamentTeams, setTournamentTeams] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const kfupmID = localStorage.getItem('kfupmID');
    const storedUser = localStorage.getItem(kfupmID);
    const teams = JSON.parse(localStorage.getItem('tournament_teams')) || [];
    const matches = JSON.parse(localStorage.getItem('match_results')) || [];

    setTournamentTeams(teams);
    setMatchResults(matches);

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAdminName(user.name);
    }

    const savedTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    setTournaments(savedTournaments);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => navigate('/');

  const teamsInTournament = tournamentTeams.filter(team => team.tr_id === selectedTournament);

  const handleMatchUpdate = (index, field, value) => {
    const updated = [...matchResults];
    updated[index][field] = value;
    setMatchResults(updated);
  };

  const saveMatchResults = () => {
    localStorage.setItem('match_results', JSON.stringify(matchResults));
    alert('✅ Match results saved to database!');
  };

  const generateFixtures = () => {
    const fixtures = [];
    for (let i = 0; i < teamsInTournament.length; i++) {
      for (let j = i + 1; j < teamsInTournament.length; j++) {
        fixtures.push({
          tr_id: selectedTournament,
          team1: teamsInTournament[i].team_name,
          team2: teamsInTournament[j].team_name,
          score1: 0,
          score2: 0,
          scorers1: [],
          scorers2: [],
          cards1: [],
          cards2: []
        });
      }
    }
    setMatchResults(fixtures);
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
            <option key={i} value={t.tr_id.toString()}>{t.tr_name}</option>
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
              onClick={generateFixtures}
              className="mt-6 mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Generate Match Fixtures
            </button>

            {matchResults.length > 0 && matchResults.filter(m => m.tr_id === selectedTournament).map((match, i) => {
              const team1Players = teamsInTournament.find(t => t.team_name === match.team1)?.players || [];
              const team2Players = teamsInTournament.find(t => t.team_name === match.team2)?.players || [];
              const score1 = parseInt(match.score1) || 0;
              const score2 = parseInt(match.score2) || 0;

              return (
                <div key={i} className="mb-4 p-4 bg-white shadow rounded">
                  <h4 className="font-bold mb-2">{match.team1} vs {match.team2}</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder={`${match.team1} Score`}
                      value={match.score1}
                      onChange={(e) => handleMatchUpdate(i, 'score1', e.target.value)}
                      className="border px-4 py-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder={`${match.team2} Score`}
                      value={match.score2}
                      onChange={(e) => handleMatchUpdate(i, 'score2', e.target.value)}
                      className="border px-4 py-2 rounded"
                    />
                  </div>

                  {[...Array(score1)].map((_, idx) => (
                    <select
                      key={`s1-${idx}`}
                      value={match.scorers1?.[idx] || ''}
                      onChange={(e) => {
                        const updated = [...(match.scorers1 || [])];
                        updated[idx] = e.target.value;
                        handleMatchUpdate(i, 'scorers1', updated);
                      }}
                      className="mt-2 w-full border px-4 py-2 rounded"
                    >
                      <option value="">Select Scorer for {match.team1}</option>
                      {team1Players.map((p, j) => (
                        <option key={j} value={p}>{p}</option>
                      ))}
                    </select>
                  ))}

                  {[...Array(score2)].map((_, idx) => (
                    <select
                      key={`s2-${idx}`}
                      value={match.scorers2?.[idx] || ''}
                      onChange={(e) => {
                        const updated = [...(match.scorers2 || [])];
                        updated[idx] = e.target.value;
                        handleMatchUpdate(i, 'scorers2', updated);
                      }}
                      className="mt-2 w-full border px-4 py-2 rounded"
                    >
                      <option value="">Select Scorer for {match.team2}</option>
                      {team2Players.map((p, j) => (
                        <option key={j} value={p}>{p}</option>
                      ))}
                    </select>
                  ))}

                  <label className="block mt-4 font-semibold">Carded Players - {match.team1}</label>
                  <select
                    multiple
                    value={match.cards1 || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      handleMatchUpdate(i, 'cards1', selected);
                    }}
                    className="w-full border px-4 py-2 rounded"
                  >
                    {team1Players.map((p, j) => (
                      <option key={j} value={p}>{p}</option>
                    ))}
                  </select>

                  <label className="block mt-4 font-semibold">Carded Players - {match.team2}</label>
                  <select
                    multiple
                    value={match.cards2 || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      handleMatchUpdate(i, 'cards2', selected);
                    }}
                    className="w-full border px-4 py-2 rounded"
                  >
                    {team2Players.map((p, j) => (
                      <option key={j} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              );
            })}

            <button
              onClick={saveMatchResults}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Match Results
            </button>
          </>
        )}
      </main>

      {menuOpen && <div className="fixed inset-0 bg-black opacity-30 z-20" onClick={closeMenu}></div>}

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
