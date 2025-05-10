import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddTeam() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({
    tr_id: '',
    team_name: '',
    team_group: 'A',
  });
  const [players, setPlayers] = useState(['']);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error('Failed to fetch tournaments:', err));
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlayerChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const addPlayerField = () => {
    setPlayers(prev => [...prev, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          players: players.filter(p => p.trim() !== '')
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ ${formData.team_name} added successfully!`);
        navigate('/admin-dashboard');
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error adding team:', err);
      setError('❌ Failed to add team. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-8 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Add Team to Tournament</h2>

        {error && <div className="mb-4 text-red-600 font-medium text-sm">{error}</div>}

        <label className="block mb-1 font-medium">Select Tournament</label>
        <select
          name="tr_id"
          value={formData.tr_id}
          onChange={handleFormChange}
          required
          className="w-full px-4 py-2 border rounded mb-4"
        >
          <option value="">-- Select Tournament --</option>
          {tournaments.map((t, i) => (
            <option key={i} value={t.tr_id}>{t.tr_name}</option>
          ))}
        </select>

        <label className="block mb-1 font-medium">Team Name</label>
        <input
          type="text"
          name="team_name"
          value={formData.team_name}
          onChange={handleFormChange}
          required
          className="w-full px-4 py-2 border rounded mb-4"
        />

        <label className="block mb-1 font-medium">Group (A, B, etc.)</label>
        <input
          type="text"
          name="team_group"
          value={formData.team_group}
          onChange={handleFormChange}
          required
          className="w-full px-4 py-2 border rounded mb-4"
        />

        <label className="block mb-1 font-medium">Player Names</label>
        {players.map((player, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Player ${i + 1}`}
            value={player}
            onChange={(e) => handlePlayerChange(i, e.target.value)}
            className="w-full px-4 py-2 border rounded mb-2"
            required
          />
        ))}

        <button type="button" onClick={addPlayerField} className="mb-4 text-blue-600 hover:underline">
          + Add Another Player
        </button>

        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
          Add Team
        </button>
      </form>
    </div>
  );
}
