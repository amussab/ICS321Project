// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Route imports
const tournamentRoutes = require('./routes/tournaments');
const teamRoutes = require('./routes/teams');
const playerRoutes = require('./routes/players');
const matchRoutes = require('./routes/matches');

// ✅ API Route mounting
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);

// ✅ Root route for testing
app.get('/', (req, res) => {
  res.send('🏆 Welcome to the Football Tournament API');
});

// ✅ Optional: Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: '❌ Route not found' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
