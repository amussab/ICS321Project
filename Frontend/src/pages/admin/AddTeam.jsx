import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddTeam() {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({
    tr_id: '',
    team_name: '',
    players: ['']
  });

  useEffect(() => {
    const savedTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    setTournaments(savedTournaments);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlayerChange = (index, value) => {
    const updated = [...formData.players];
    updated[index] = value;
    setFormData(prev => ({ ...prev, players: updated }));
  };

  const addPlayerField = () => {
    setFormData(prev => ({ ...prev, players: [...prev.players, ''] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const teams = JSON.parse(localStorage.getItem('tournament_teams')) || [];

    const nextTeamID =
      teams.reduce((max, t) => Math.max(max, Number(t.team_id)), 1220) + 1;

    const newTeam = {
      tr_id: formData.tr_id,
      team_id: nextTeamID.toString(),
      team_name: formData.team_name,
      players: formData.players.filter(p => p.trim() !== '')
    };

    const updated = [...teams, newTeam];
    localStorage.setItem('tournament_teams', JSON.stringify(updated));

    alert(`✅ Team "${formData.team_name}" added to tournament!`);
    navigate('/admin-dashboard'); // ✅ this will now work
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-lg max-w-lg w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Add Team to Tournament</h2>

        {/* Tournament selection */}
        <label className="block mb-1 font-medium">Select Tournament</label>
        <select
          name="tr_id"
          value={formData.tr_id}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded mb-4"
        >
          <option value="">-- Select Tournament --</option>
          {tournaments.map((t, i) => (
            <option key={i} value={t.tr_id}>
              {t.tr_name}
            </option>
          ))}
        </select>

        {/* Team name */}
        <label className="block mb-1 font-medium">Team Name</label>
        <input
          type="text"
          name="team_name"
          value={formData.team_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded mb-4"
        />

        {/* Player inputs */}
        <label className="block mb-1 font-medium">Player Names</label>
        {formData.players.map((player, i) => (
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

        <button
          type="button"
          onClick={addPlayerField}
          className="mb-4 text-blue-600 hover:underline"
        >
          + Add Another Player
        </button>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Add Team
        </button>
      </form>
    </div>
  );
}
