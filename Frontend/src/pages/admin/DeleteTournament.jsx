import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeleteTournament() {
  const [tournaments, setTournaments] = useState([]);
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('tournaments')) || [];
    setTournaments(data);
  }, []);

  const handleDelete = () => {
    if (!selected) return alert('Please select a tournament.');

    const updated = tournaments.filter(t => t.tr_id.toString() !== selected);
    localStorage.setItem('tournaments', JSON.stringify(updated));

    alert('Tournament deleted successfully!');
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-md p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Delete Tournament</h2>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-6"
        >
          <option value="">-- Select a Tournament --</option>
          {tournaments.map((t, i) => (
            <option key={i} value={t.tr_id.toString()}>
              {t.tr_name}
            </option>
          ))}
        </select>

        <button
          onClick={handleDelete}
          disabled={!selected}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
