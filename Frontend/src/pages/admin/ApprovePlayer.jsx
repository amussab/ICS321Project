import React from 'react';

export default function ApprovePlayer() {
  const handleApprove = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/players/approve-player', {
        method: 'POST'
      });

      if (response.ok) {
        alert('✅ Player approved and added to the database!');
      } else {
        alert('❌ Failed to approve player.');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">Approve Players</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Pending Applications</h2>
        <div className="p-4 border rounded bg-gray-50 mb-4">
          <p><strong>Name:</strong> Badr</p>
          <p><strong>KFUPM ID:</strong> 9999</p>
          <p><strong>Team:</strong> CCM (1214)</p>
          <p><strong>Tournament:</strong> Faculty Tournament (1)</p>
          <p><strong>Jersey No:</strong> 10</p>
          <p><strong>Position:</strong> MF (Midfielder)</p>
        </div>

        <button
          onClick={handleApprove}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Approve Player
        </button>
      </div>
    </div>
  );
}
