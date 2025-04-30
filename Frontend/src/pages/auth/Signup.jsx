import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import trophyBg from '../../assets/trophy.png'; // adjust path if needed

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [userID, setUserID] = useState('');
  const [kfupmID, setKfupmID] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest');

  const handleSignup = (e) => {
    e.preventDefault();
    console.log({ name, userID, kfupmID, password, role });
    alert(`Signed up as ${role}`);
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${trophyBg})` }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <form
        onSubmit={handleSignup}
        className="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
          required
        />

        <input
          type="text"
          placeholder="User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
          required
        />

        <input
          type="text"
          placeholder="KFUPM ID"
          value={kfupmID}
          onChange={(e) => setKfupmID(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded"
          required
        />

        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Role</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="admin"
                checked={role === 'admin'}
                onChange={() => setRole('admin')}
              />
              Admin
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="guest"
                checked={role === 'guest'}
                onChange={() => setRole('guest')}
              />
              Guest
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
