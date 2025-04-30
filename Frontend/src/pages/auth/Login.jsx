import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import trophyBg from '../../assets/trophy.png';

const Login = () => {
  const [userID, setUserID] = useState('');
  const [kfupmID, setKfupmID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (userID === 'admin' && password === 'admin') {
      navigate('/');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${trophyBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Login form */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <input
          type="text"
          placeholder="User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring"
          required
        />
        <input
          type="text"
          placeholder="KFUPM ID"
          value={kfupmID}
          onChange={(e) => setKfupmID(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
