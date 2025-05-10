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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`✅ Tournament "${formData.tr_name}" added to the database.`);
        navigate('/admin-dashboard');
      } else if (response.status === 409) {
        setError('⚠️ A tournament with this name already exists.');
      } else {
        setError('❌ Failed to save tournament.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Server error occurred.');
    }
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
