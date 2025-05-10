import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('');
  const [tournamentTeams, setTournamentTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const kfupmID = localStorage.getItem('kfupmID');
    const storedUser = localStorage.getItem(kfupmID);

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAdminName(user.name);
    }

    fetch('http://localhost:5000/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error('Error fetching tournaments:', err));
  }, []);

  useEffect(() => {
    if (!selectedTournament) return;

    fetch(`http://localhost:5000/api/teams/${selectedTournament}`)
      .then(res => res.json())
      .then(data => {
        setTournamentTeams(data);
        generateFixtures(data);
      })
      .catch(err => console.error('Error fetching teams:', err));
  }, [selectedTournament]);

  const generateFixtures = (teams) => {
    const newFixtures = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        newFixtures.push({
          team1: teams[i],
          team2: teams[j],
          score1: '',
          score2: '',
          scorers1: [],
          scorers2: [],
          redCards1: [],
          redCards2: []
        });
      }
    }
    setFixtures(newFixtures);
  };

  const saveMatch = async (match) => {
    const payload = {
      tournament_id: selectedTournament,
      team1_id: match.team1.team_id,
      team2_id: match.team2.team_id,
      score1: parseInt(match.score1, 10),
      score2: parseInt(match.score2, 10),
      scorers1: match.scorers1.filter(Boolean),
      scorers2: match.scorers2.filter(Boolean),
      red_cards1: match.redCards1.filter(Boolean),
      red_cards2: match.redCards2.filter(Boolean),
    };

    try {
      const response = await fetch('http://localhost:5000/api/matches/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Match saved successfully!');
      } else {
        alert('Failed to save match.');
      }
    } catch (error) {
      console.error('Error saving match:', error);
      alert('An error occurred while saving the match.');
    }
  };

  const handleScoreChange = (index, teamKey, value) => {
    const updated = [...fixtures];
    updated[index][teamKey] = value;
    const scoreKey = teamKey === 'score1' ? 'scorers1' : 'scorers2';
    updated[index][scoreKey] = Array.from({ length: Number(value) || 0 }, () => '');
    setFixtures(updated);
  };

  const handleScorerChange = (index, teamKey, i, value) => {
    const updated = [...fixtures];
    updated[index][teamKey][i] = value;
    setFixtures(updated);
  };

  const addScorerField = (index, teamKey) => {
    const updated = [...fixtures];
    updated[index][teamKey].push('');
    setFixtures(updated);
  };

  const handleRedCardChange = (index, teamKey, i, value) => {
    const updated = [...fixtures];
    updated[index][teamKey][i] = value;
    setFixtures(updated);
  };

  const addRedCardField = (index, teamKey) => {
    const updated = [...fixtures];
    updated[index][teamKey].push('');
    setFixtures(updated);
  };

  const getPlayerOptions = (team) => {
    return team.players?.map((name, idx) => (
      <option key={idx} value={name}>{name}</option>
    )) || [];
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => navigate('/');

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
            <option key={i} value={t.tr_id}>{t.tr_name}</option>
          ))}
        </select>

        {selectedTournament && (
          <div className="mt-4">
            <p className="text-green-600">
              ✅ Managing: <strong>{tournaments.find(t => t.tr_id.toString() === selectedTournament)?.tr_name}</strong>
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-purple-700">Teams in This Tournament</h3>
            {tournamentTeams.map((team, index) => (
              <div key={index} className="mb-4 p-4 border rounded bg-white shadow-sm">
                <h4 className="font-bold text-lg text-gray-800">{team.team_name}</h4>
                {team.players && team.players.length > 0 && (
                  <ul className="list-disc list-inside text-gray-600 mt-2">
                    {team.players.map((player, idx) => (
                      <li key={idx}>{player}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <h3 className="text-lg font-semibold mt-10 mb-4 text-purple-700">Match Fixtures & Scoring</h3>
            {fixtures.map((match, idx) => (
              <div key={idx} className="mb-6 p-4 border rounded bg-white shadow">
                <h4 className="font-bold text-gray-800 mb-2">
                  {match.team1.team_name} vs {match.team2.team_name}
                </h4>

                {/* Scores */}
                <div className="flex gap-4 mb-2">
                  <input type="number" value={match.score1} onChange={(e) => handleScoreChange(idx, 'score1', e.target.value)} className="w-16 border rounded px-2" placeholder="0" />
                  <span> - </span>
                  <input type="number" value={match.score2} onChange={(e) => handleScoreChange(idx, 'score2', e.target.value)} className="w-16 border rounded px-2" placeholder="0" />
                </div>

                {/* Scorers */}
                <div>
                  <p className="font-semibold">Scorers</p>

                  {match.scorers1.map((s, i) => (
                    <select
                      key={i}
                      value={s}
                      onChange={(e) => handleScorerChange(idx, 'scorers1', i, e.target.value)}
                      className="mb-1 block w-full border px-2 py-1 rounded"
                    >
                      <option value="">-- Select Scorer --</option>
                      {getPlayerOptions(match.team1)}
                    </select>
                  ))}
                  <button onClick={() => addScorerField(idx, 'scorers1')} className="text-sm text-purple-600 hover:underline">+ Add scorer</button>

                  {match.scorers2.map((s, i) => (
                    <select
                      key={i}
                      value={s}
                      onChange={(e) => handleScorerChange(idx, 'scorers2', i, e.target.value)}
                      className="mb-1 block w-full border px-2 py-1 rounded"
                    >
                      <option value="">-- Select Scorer --</option>
                      {getPlayerOptions(match.team2)}
                    </select>
                  ))}
                  <button onClick={() => addScorerField(idx, 'scorers2')} className="text-sm text-purple-600 hover:underline">+ Add scorer</button>
                </div>

                {/* Red Cards */}
                <div className="mt-4">
                  <p className="font-semibold text-red-700">Red Carded Players</p>

                  {match.redCards1.map((r, i) => (
                    <select
                      key={i}
                      value={r}
                      onChange={(e) => handleRedCardChange(idx, 'redCards1', i, e.target.value)}
                      className="mb-1 block w-full border px-2 py-1 rounded"
                    >
                      <option value="">-- Select Player --</option>
                      {getPlayerOptions(match.team1)}
                    </select>
                  ))}
                  <button onClick={() => addRedCardField(idx, 'redCards1')} className="text-sm text-red-600 hover:underline">+ Add red card</button>

                  {match.redCards2.map((r, i) => (
                    <select
                      key={i}
                      value={r}
                      onChange={(e) => handleRedCardChange(idx, 'redCards2', i, e.target.value)}
                      className="mb-1 block w-full border px-2 py-1 rounded"
                    >
                      <option value="">-- Select Player --</option>
                      {getPlayerOptions(match.team2)}
                    </select>
                  ))}
                  <button onClick={() => addRedCardField(idx, 'redCards2')} className="text-sm text-red-600 hover:underline">+ Add red card</button>
                </div>

                <button
                  onClick={() => saveMatch(match)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Match
                </button>
              </div>
            ))}
          </div>
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
          <li onClick={() => { closeMenu(); window.location.href = '/admin/add-tournament'; }} className="cursor-pointer hover:underline">Add Tournament</li>
          <li onClick={() => { closeMenu(); navigate('/admin/delete-tournament'); }} className="cursor-pointer hover:underline">Delete Tournament</li>
          <li onClick={() => { closeMenu(); navigate('/admin/add-team'); }} className="cursor-pointer hover:underline">Add Team</li>
          <li onClick={() => { closeMenu(); navigate('/admin/select-captain'); }} className="cursor-pointer hover:underline">Select Captain</li>
          <li className="cursor-pointer hover:underline">Approve Player</li>
        </ul>
        <hr className="my-4" />
        <li onClick={handleLogout} className="cursor-pointer text-red-600 hover:underline">Logout</li>
      </aside>
    </div>
  );
}
