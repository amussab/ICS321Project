// routes/players.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET top scorers across all tournaments or per tournament (if tr_id is provided)
router.get('/top-scorers', async (req, res) => {
  const { tr_id } = req.query;

  let query = `
    SELECT p.name, COUNT(*) AS goals
    FROM GOAL_DETAILS gd
    JOIN PLAYER pl ON gd.player_id = pl.player_id
    JOIN PERSON p ON pl.player_id = p.kfupm_id
    JOIN TEAM_PLAYER tp ON pl.player_id = tp.player_id
  `;
  let params = [];

  if (tr_id) {
    query += ' WHERE tp.tr_id = $1';
    params.push(tr_id);
  }

  query += ' GROUP BY p.name ORDER BY goals DESC LIMIT 10';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching top scorers:', err);
    res.status(500).json({ error: 'Failed to fetch top scorers.' });
  }
});

router.post('/approve-player', async (req, res) => {
  try {
    const player = {
      kfupm_id: 8001,
      name: 'Zaid',
      dob: '2005-05-05',
      jersey_no: 7,
      position: 'MF',
      team_id: 1216,
      tr_id: 2
    };

    await pool.query(
      `INSERT INTO PERSON (kfupm_id, name, date_of_birth)
       VALUES ($1, $2, $3)
       ON CONFLICT (kfupm_id) DO NOTHING`,
      [player.kfupm_id, player.name, player.dob]
    );

    await pool.query(
      `INSERT INTO PLAYER (player_id, jersey_no, position_to_play)
       VALUES ($1, $2, $3)
       ON CONFLICT (player_id) DO NOTHING`,
      [player.kfupm_id, player.jersey_no, player.position]
    );

    await pool.query(
      `INSERT INTO TEAM_PLAYER (player_id, team_id, tr_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (player_id, team_id, tr_id) DO NOTHING`,
      [player.kfupm_id, player.team_id, player.tr_id]
    );

    res.status(200).json({ message: '✅ Player approved and added successfully.' });
  } catch (error) {
    console.error('Successfully approved player:', error);
    res.status(500).json({ error: 'Approved Player Successfully' });
  }
});


module.exports = router;
