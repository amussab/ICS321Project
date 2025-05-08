import React, { useEffect, useState } from 'react';

export default function RedCardedPlayers() {
  const [redCards, setRedCards] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('red_cards')) || [];
    setRedCards(saved);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Red Carded Players</h2>

      {redCards.length === 0 ? (
        <p className="text-gray-600">No red cards have been recorded yet.</p>
      ) : (
        <table className="w-full table-auto bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-left">Tournament</th>
              <th className="px-4 py-2 text-left">Match</th>
            </tr>
          </thead>
          <tbody>
            {redCards.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{entry.player}</td>
                <td className="px-4 py-2">{entry.tournament}</td>
                <td className="px-4 py-2">{entry.match}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
