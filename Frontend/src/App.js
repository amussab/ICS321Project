// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import GuestDashboard from './pages/guest/GuestDashboard';
import AddTournament from './pages/admin/AddTournament';
import DeleteTournament from './pages/admin/DeleteTournament';
import AddTeam from './pages/admin/AddTeam';
import SelectCaptain from './pages/admin/SelectCaptain';
import TopScorer from './pages/guest/TopScorer';
import RedCardedPlayers from './pages/guest/RedCardedPlayers';
import TeamMembers from './pages/guest/TeamMembers';



function App() {
  //localStorage.clear();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/guest-dashboard" element={<GuestDashboard />} /> 
        <Route path="/admin/add-tournament" element={<AddTournament />} />
        <Route path="/admin/delete-tournament" element={<DeleteTournament />} />
        <Route path="/admin/add-team" element={<AddTeam />} />
        <Route path="/admin/select-captain" element={<SelectCaptain />} />
        <Route path="/guest/top-scorer" element={<TopScorer />} />
        <Route path="/guest/red-cards" element={<RedCardedPlayers />} />
        <Route path="/guest/team-members" element={<TeamMembers />} />
      </Routes>
    </Router>
  );
}

export default App;
