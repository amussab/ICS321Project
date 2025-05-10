import React, { useEffect, useState } from 'react';

export default function RedCardedPlayers() {
  const [selectedTournament, setSelectedTournament] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [redCards, setRedCards] = useState([]);

  useEffect(() => {
    // Fetch tournaments
    fetch('http://localhost:5000/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error('Error loading tournaments:', err));
  }, []);

  useEffect(() => {
    if (!selectedTournament) return;
    fetch(`http://localhost:5000/api/matches/redcards/${selectedTournament}`)
      .then(res => res.json())
      .then(data => setRedCards(data))
      .catch(err => console.error('Error loading red cards:', err));
  }, [selectedTournament]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-700">Red Carded Players</h2>

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

      {redCards.length === 0 ? (
        <p className="text-gray-600">No red cards have been recorded for this tournament.</p>
      ) : (
        <table className="w-full table-auto bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-left">Team</th>
            </tr>
          </thead>
          <tbody>
            {redCards.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{entry.player_name}</td>
                <td className="px-4 py-2">{entry.team_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
