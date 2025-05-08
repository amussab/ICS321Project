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

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem('tournaments')) || [];
    setTournaments(t);
    const teamData = JSON.parse(localStorage.getItem('tournament_teams')) || [];
    setTeams(teamData);
  }, []);

  const handleSetCaptain = () => {
    const updatedTeams = teams.map(team => {
      if (team.tr_id === selectedTournament && team.team_id === selectedTeam) {
        return {
          ...team,
          players: team.players.map(p =>
            p === selectedCaptain ? `${p} (C)` : p.replace(' (C)', '')
          )
        };
      }
      return team;
    });

    localStorage.setItem('tournament_teams', JSON.stringify(updatedTeams));
    setMessage(`✅ ${selectedCaptain} is now the captain!`);
    setSelectedCaptain('');
  };

  const availableTeams = teams.filter(team => team.tr_id === selectedTournament);
  const selectedTeamData = teams.find(team => team.team_id === selectedTeam);

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

        {selectedTeam && (
          <>
            <label className="block font-medium mb-1">Select Captain</label>
            <select
              value={selectedCaptain}
              onChange={e => setSelectedCaptain(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            >
              <option value="">-- Select Captain --</option>
              {selectedTeamData?.players.map((player, i) => (
                <option key={i} value={player.replace(' (C)', '')}>
                  {player.replace(' (C)', '')}
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
