import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddTournament() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tr_name: '',
    start_date: '',
    end_date: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem('tournaments')) || [];

    // Check for duplicate name (optional)
    const nameExists = existing.some(t => t.tr_name === formData.tr_name);
    if (nameExists) {
      setError('⚠️ A tournament with this name already exists.');
      return;
    }

    // ✅ Generate next ID on submit to avoid duplicates
    const nextID = existing.reduce((max, t) => Math.max(max, Number(t.tr_id)), 0) + 1;

    const newTournament = {
      tr_id: nextID.toString(),
      ...formData
    };

    const updated = [...existing, newTournament];
    localStorage.setItem('tournaments', JSON.stringify(updated));

    alert(`✅ Tournament "${formData.tr_name}" added with ID ${nextID}`);

    // ✅ Redirect after saving
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Add New Tournament</h2>

        {error && (
          <div className="mb-4 text-red-600 font-medium text-sm">{error}</div>
        )}

        <label className="block mb-2 font-medium">Tournament Name</label>
        <input
          type="text"
          name="tr_name"
          value={formData.tr_name}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded mb-4"
        />

        <label className="block mb-2 font-medium">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded mb-4"
        />

        <label className="block mb-2 font-medium">End Date</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded mb-6"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Add Tournament
        </button>
      </form>
    </div>
  );
}
