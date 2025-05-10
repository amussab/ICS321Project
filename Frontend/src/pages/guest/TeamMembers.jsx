import React, { useEffect, useState } from 'react';

export default function TeamMembers() {
  const [selectedTournament, setSelectedTournament] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [tournamentTeams, setTournamentTeams] = useState([]);

  useEffect(() => {
    // Fetch tournaments from the server
    fetch('http://localhost:5000/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error('Error loading tournaments:', err));
  }, []);

  useEffect(() => {
    if (!selectedTournament) return;

    // Fetch teams and their players for the selected tournament
    fetch(`http://localhost:5000/api/matches/teams-with-players/${selectedTournament}`)
      .then(res => res.json())
      .then(data => setTournamentTeams(data))
      .catch(err => console.error('Error loading teams:', err));
  }, [selectedTournament]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Team Members</h2>

      <select
        value={selectedTournament}
        onChange={(e) => setSelectedTournament(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full max-w-sm"
      >
        <option value="">-- Select a Tournament --</option>
        {tournaments.map((t, i) => (
          <option key={i} value={t.tr_id}>{t.tr_name}</option>
        ))}
      </select>

      {tournamentTeams.length > 0 ? (
        tournamentTeams.map((team, idx) => (
          <div key={idx} className="mb-4 bg-white shadow p-4 rounded">
            <h3 className="font-bold text-blue-600 mb-2">{team.team_name}</h3>
            {team.players.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {team.players.map((player, i) => (
                  <li key={i}>{player}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No players listed</p>
            )}
          </div>
        ))
      ) : (
        selectedTournament && <p className="text-gray-600">No teams found for this tournament.</p>
      )}
    </div>
  );
}
