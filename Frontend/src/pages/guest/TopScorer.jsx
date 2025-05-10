import React, { useEffect, useState } from 'react';

export default function TopScorer() {
  const [scorers, setScorers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/players/top-scorers')
      .then(res => res.json())
      .then(data => setScorers(data))
      .catch(err => console.error('Failed to load scorers:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Top Scorers</h2>

      {scorers.length === 0 ? (
        <p className="text-gray-600">No goals have been recorded yet.</p>
      ) : (
        <table className="w-full table-auto bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Player Name</th>
              <th className="px-4 py-2 text-left">Goals</th>
            </tr>
          </thead>
          <tbody>
            {scorers.map((s, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
