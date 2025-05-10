import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SelectCaptain() {
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCaptain, setSelectedCaptain] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch tournaments from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error('Error fetching tournaments:', err));
  }, []);

  // Fetch teams (and their players) for selected tournament
  useEffect(() => {
    if (!selectedTournament) return;
    fetch(`http://localhost:5000/api/teams/${selectedTournament}`)
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('Error fetching teams:', err));
  }, [selectedTournament]);

  const handleSetCaptain = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teams/set-captain', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tr_id: selectedTournament,
          team_id: selectedTeam,
          player_name: selectedCaptain,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`✅ ${selectedCaptain} is now the captain!`);

        // Refresh teams to see updated captain
        const updatedTeams = await fetch(`http://localhost:5000/api/teams/${selectedTournament}`);
        const updatedData = await updatedTeams.json();
        setTeams(updatedData);
      } else {
        setMessage(`❌ Failed: ${result.error}`);
      }
    } catch (err) {
      setMessage('❌ Failed to set captain.');
      console.error('Error:', err);
    }
  };

  const availableTeams = teams.filter(team => team.tr_id.toString() === selectedTournament);
  const selectedTeamData = teams.find(team => team.team_id.toString() === selectedTeam);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white max-w-xl mx-auto p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-purple-700">Select Team Captain</h2>

        {message && <div className="text-green-600 mb-4 font-semibold">{message}</div>}

        <label className="block font-medium mb-1">Select Tournament</label>
        <select
          value={selectedTournament}
          onChange={e => {
            setSelectedTournament(e.target.value);
            setSelectedTeam('');
            setSelectedCaptain('');
            setMessage('');
          }}
          className="w-full border px-4 py-2 rounded mb-4"
        >
          <option value="">-- Select Tournament --</option>
          {tournaments.map((t, i) => (
            <option key={i} value={t.tr_id}>{t.tr_name}</option>
          ))}
        </select>

        {selectedTournament && (
          <>
            <label className="block font-medium mb-1">Select Team</label>
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            >
              <option value="">-- Select Team --</option>
              {availableTeams.map((team, i) => (
                <option key={i} value={team.team_id}>{team.team_name}</option>
              ))}
            </select>
          </>
        )}

        {selectedTeam && selectedTeamData && (
          <>
            <label className="block font-medium mb-1">Select Captain</label>
            <select
              value={selectedCaptain}
              onChange={e => setSelectedCaptain(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            >
              <option value="">-- Select Captain --</option>
              {selectedTeamData.players.map((player, i) => (
                <option key={i} value={player.replace(' (C)', '')}>
                  {player}
                </option>
              ))}
            </select>

            <button
              onClick={handleSetCaptain}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Set Captain
            </button>
          </>
        )}

        <button
          onClick={() => navigate('/admin-dashboard')}
          className="mt-6 text-sm text-purple-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
