import React, { useEffect, useState } from 'react';

export default function TeamMembers() {
  const [selectedTournament, setSelectedTournament] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [tournamentTeams, setTournamentTeams] = useState([]);

  useEffect(() => {
    const savedTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    const teams = JSON.parse(localStorage.getItem('tournament_teams')) || [];
    setTournaments(savedTournaments);
    setTournamentTeams(teams);
  }, []);

  const teamsInSelectedTournament = tournamentTeams.filter(t => t.tr_id === selectedTournament);

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

      {teamsInSelectedTournament.length > 0 ? (
        teamsInSelectedTournament.map((team, idx) => (
          <div key={idx} className="mb-4 bg-white shadow p-4 rounded">
            <h3 className="font-bold text-blue-600 mb-2">{team.team_name}</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {team.players.map((player, i) => (
                <li key={i}>{player}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        selectedTournament && <p className="text-gray-600">No teams found for this tournament.</p>
      )}
    </div>
  );
}
