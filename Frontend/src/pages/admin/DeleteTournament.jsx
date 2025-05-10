import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeleteTournament() {
  const [tournaments, setTournaments] = useState([]);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => {
        console.error('Failed to load tournaments:', err);
        setError('❌ Could not load tournaments.');
      });
  }, []);

  const handleDelete = async () => {
    if (!selected) return alert('Please select a tournament.');

    try {
      const res = await fetch(`http://localhost:5000/api/tournaments/${selected}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('✅ Tournament deleted successfully!');
        setTournaments(prev => prev.filter(t => t.tr_id.toString() !== selected));
        setSelected('');
      } else {
        const result = await res.json();
        alert(`❌ ${result.error || 'Failed to delete tournament.'}`);
      }
    } catch (err) {
      console.error('Error deleting tournament:', err);
      alert('❌ Server error.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-md p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Delete Tournament</h2>

        {error && <div className="text-red-600 font-medium mb-4">{error}</div>}

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-6"
        >
          <option value="">-- Select a Tournament --</option>
          {tournaments.map((t, i) => (
            <option key={i} value={t.tr_id}>{t.tr_name}</option>
          ))}
        </select>

        <button
          onClick={handleDelete}
          disabled={!selected}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Delete
        </button>

        <button
          onClick={() => navigate('/admin-dashboard')}
          className="mt-4 text-sm text-purple-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
