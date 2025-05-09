const express = require('express');
const router = express.Router();
const pool = require('../db');



router.post('/', async (req, res) => {
    try {
        const { tr_id, team_name, team_group = 'A', players = [] } = req.body;

        if (!tr_id || !team_name) {
            return res.status(400).json({ error: 'tr_id and team_name are required' });
        }

        // 1. Generate next team_id
        const teamResult = await pool.query('SELECT MAX(team_id) AS max_id FROM TEAM');
        const maxTeamId = teamResult.rows[0]?.max_id || 1200;
        const nextTeamId = Number(maxTeamId) + 1;

        // 2. Insert team
        await pool.query(
            'INSERT INTO TEAM (team_id, team_name) VALUES ($1, $2)',
            [nextTeamId, team_name]
        );

        // 3. Insert into TOURNAMENT_TEAM
        await pool.query(
            `INSERT INTO TOURNAMENT_TEAM (
        team_id, tr_id, team_group, match_played, won, draw, lost,
        goal_for, goal_against, goal_diff, points, group_position
      ) VALUES (
        $1, $2, $3, 0, 0, 0, 0, 0, 0, 0, 0, 0
      )`,
            [nextTeamId, tr_id, team_group]
        );

        // 4. Insert players (names only) using a simple counter (string kfupm_id)
        let playerCounter = 1000;

        for (let i = 0; i < players.length; i++) {
            const name = players[i].trim();
            if (!name) continue;

            const fakeId = (playerCounter++).toString(); // ensure it's string to match kfupm_id

            // PERSON
            await pool.query(
                'INSERT INTO PERSON (kfupm_id, name) VALUES ($1, $2) ON CONFLICT (kfupm_id) DO NOTHING',
                [fakeId, name]
            );

            // PLAYER
            await pool.query(
                'INSERT INTO PLAYER (player_id, jersey_no, position_to_play) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                [fakeId, 0, 'MF'] // use valid 2-char code from PLAYING_POSITION
            );



            // TEAM_PLAYER
            await pool.query(
                'INSERT INTO TEAM_PLAYER (team_id, tr_id, player_id) VALUES ($1, $2, $3)',
                [nextTeamId, tr_id, fakeId]
            );
        }

        res.status(201).json({ message: '✅ Team and players added successfully!', team_id: nextTeamId });
    } catch (err) {
        console.error('Error adding team and players:', err);
        res.status(500).json({ error: '❌ Server error while adding team and players' });
    }
});

router.put('/set-captain', async (req, res) => {
  try {
    const { tr_id, team_id, player_name } = req.body;

    // Remove old captain if exists
    await pool.query(
      `UPDATE PERSON 
       SET name = REPLACE(name, ' (C)', '') 
       WHERE kfupm_id IN (
         SELECT player_id 
         FROM TEAM_PLAYER 
         WHERE team_id = $1 AND tr_id = $2
       ) AND name LIKE '% (C)'`,
      [team_id, tr_id]
    );

    // Add (C) to selected player
    await pool.query(
      `UPDATE PERSON 
       SET name = name || ' (C)' 
       WHERE kfupm_id IN (
         SELECT player_id 
         FROM TEAM_PLAYER 
         WHERE team_id = $1 AND tr_id = $2
       ) AND name = $3`,
      [team_id, tr_id, player_name]
    );

    res.status(200).json({ message: `${player_name} is now captain.` });
  } catch (err) {
    console.error('Error setting captain:', err);
    res.status(500).json({ error: '❌ Failed to set captain' });
  }
});


// Get teams and their players by tournament
router.get('/:tr_id', async (req, res) => {
  try {
    const { tr_id } = req.params;

    const teamQuery = `
      SELECT t.team_id, t.team_name, tt.tr_id, tt.team_group
      FROM TEAM t
      JOIN TOURNAMENT_TEAM tt ON t.team_id = tt.team_id
      WHERE tt.tr_id = $1
    `;
    const teamResult = await pool.query(teamQuery, [tr_id]);

    const playerQuery = `
      SELECT tp.team_id, p.name
      FROM TEAM_PLAYER tp
      JOIN PERSON p ON tp.player_id = p.kfupm_id
      WHERE tp.tr_id = $1
    `;
    const playerResult = await pool.query(playerQuery, [tr_id]);

    const playersMap = {};
    playerResult.rows.forEach(p => {
      if (!playersMap[p.team_id]) playersMap[p.team_id] = [];
      playersMap[p.team_id].push(p.name);
    });

    const teams = teamResult.rows.map(team => ({
      ...team,
      players: playersMap[team.team_id] || []
    }));

    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams with players:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// routes/teams.js
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.team_id, t.team_name, tt.tr_id
      FROM TEAM t
      JOIN TOURNAMENT_TEAM tt ON t.team_id = tt.team_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all teams:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
