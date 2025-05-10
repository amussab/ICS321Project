const express = require('express');
const router = express.Router();
const pool = require('../db');

// Save match results, goals, and red cards
router.post('/save', async (req, res) => {
  const { tr_id, team1_id, team2_id, score1, score2, scorers1, scorers2, red_cards1, red_cards2 } = req.body;
  const match_no = Date.now(); // unique match ID

  try {
    console.log('📥 Payload received:', {
      match_no,
      team1_id,
      team2_id,
      score1,
      score2,
      scorers1,
      scorers2,
      red_cards1,
      red_cards2
    });

    const safeScore1 = isNaN(parseInt(score1)) ? 0 : parseInt(score1);
    const safeScore2 = isNaN(parseInt(score2)) ? 0 : parseInt(score2);
    const goalScore = `${safeScore1}-${safeScore2}`;

    const playerOfMatchResult = await pool.query(
      `SELECT tp.player_id FROM TEAM_PLAYER tp JOIN PERSON p ON tp.player_id = p.kfupm_id WHERE tp.team_id = $1 LIMIT 1`,
      [team1_id]
    );
    const playerOfMatch = playerOfMatchResult.rows[0]?.player_id;
    if (!playerOfMatch) throw new Error('⚠️ No valid player_of_match found.');

    const venueResult = await pool.query(`SELECT venue_id FROM VENUE WHERE venue_status = 'Y' LIMIT 1`);
    const venue_id = venueResult.rows[0]?.venue_id;
    if (!venue_id) throw new Error('⚠️ No active venue found.');

    await pool.query(
      `INSERT INTO MATCH_PLAYED (
         match_no, play_stage, play_date, team_id1, team_id2, results,
         decided_by, goal_score, venue_id, audience, player_of_match,
         stop1_sec, stop2_sec)
       VALUES (
         $1, 'G', CURRENT_DATE, $2, $3, $4, 'N', $5,
         $6, 0, $7, 0, 0
       )
       ON CONFLICT (match_no) DO NOTHING`,
      [match_no, team1_id, team2_id, goalScore, goalScore, venue_id, playerOfMatch]
    );
    console.log('✅ MATCH_PLAYED inserted');

    let goal_id = Date.now();
    for (let playerName of scorers1) {
      const playerId = await findPlayerId(playerName, team1_id);
      if (playerId) {
        await pool.query(
          `INSERT INTO GOAL_DETAILS (
             goal_id, match_no, player_id, team_id, goal_time,
             goal_type, play_stage, goal_schedule, goal_half)
           VALUES ($1, $2, $3, $4, 10, 'N', 'G', 'FT', 1)`,
          [goal_id++, match_no, playerId, team1_id]
        );
      }
    }
    for (let playerName of scorers2) {
      const playerId = await findPlayerId(playerName, team2_id);
      if (playerId) {
        await pool.query(
          `INSERT INTO GOAL_DETAILS (
             goal_id, match_no, player_id, team_id, goal_time,
             goal_type, play_stage, goal_schedule, goal_half)
           VALUES ($1, $2, $3, $4, 10, 'N', 'G', 'FT', 1)`,
          [goal_id++, match_no, playerId, team2_id]
        );
      }
    }

    for (let playerName of red_cards1) {
      const playerId = await findPlayerId(playerName, team1_id);
      if (playerId) {
        await pool.query(
          `INSERT INTO PLAYER_BOOKED (
             match_no, team_id, player_id, booking_time, sent_off, play_schedule, play_half)
           VALUES ($1, $2, $3, 90, 'Y', 'FT', 2)`,
          [match_no, team1_id, playerId]
        );
      }
    }
    for (let playerName of red_cards2) {
      const playerId = await findPlayerId(playerName, team2_id);
      if (playerId) {
        await pool.query(
          `INSERT INTO PLAYER_BOOKED (
             match_no, team_id, player_id, booking_time, sent_off, play_schedule, play_half)
           VALUES ($1, $2, $3, 90, 'Y', 'FT', 2)`,
          [match_no, team2_id, playerId]
        );
      }
    }

    console.log('✅ All match data saved');
    res.json({ message: '✅ Match, goals, and red cards saved.' });
  } catch (err) {
    console.error('❌ Error saving match and details:', err);
    res.status(500).json({ error: 'Failed to save match and goal/red card details.' });
  }
});

async function findPlayerId(name, team_id) {
  try {
    const result = await pool.query(
      `SELECT tp.player_id FROM TEAM_PLAYER tp JOIN PERSON p ON tp.player_id = p.kfupm_id WHERE tp.team_id = $1 AND p.name = $2`,
      [team_id, name]
    );
    return result.rows[0]?.player_id || null;
  } catch (err) {
    console.error('❌ Error in findPlayerId:', err);
    return null;
  }
}

router.get('/topscorers/:tr_id', async (req, res) => {
  const { tr_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.name, COUNT(*) AS goals
       FROM GOAL_DETAILS gd
       JOIN PLAYER pl ON gd.player_id = pl.player_id
       JOIN PERSON p ON pl.player_id = p.kfupm_id
       JOIN TEAM_PLAYER tp ON pl.player_id = tp.player_id
       WHERE tp.tr_id = $1
       GROUP BY p.name
       ORDER BY goals DESC
       LIMIT 10`,
      [tr_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching top scorers:', err);
    res.status(500).json({ error: 'Failed to fetch top scorers.' });
  }
});

router.get('/results', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        mp.match_no,
        mp.play_date,
        mp.team_id1,
        mp.team_id2,
        mp.goal_score,
        t1.team_name AS team1,
        t2.team_name AS team2,
        tp1.tr_id
      FROM MATCH_PLAYED mp
      JOIN TEAM t1 ON mp.team_id1 = t1.team_id
      JOIN TEAM t2 ON mp.team_id2 = t2.team_id
      JOIN TOURNAMENT_TEAM tp1 ON t1.team_id = tp1.team_id
      WHERE tp1.tr_id IS NOT NULL
      ORDER BY mp.play_date DESC
    `);

    const matches = await Promise.all(result.rows.map(async (match) => {
      const scorers1 = await pool.query(`
        SELECT p.name FROM GOAL_DETAILS gd
        JOIN PLAYER pl ON gd.player_id = pl.player_id
        JOIN PERSON p ON pl.player_id = p.kfupm_id
        WHERE gd.match_no = $1 AND gd.team_id = $2
      `, [match.match_no, match.team_id1]);

      const scorers2 = await pool.query(`
        SELECT p.name FROM GOAL_DETAILS gd
        JOIN PLAYER pl ON gd.player_id = pl.player_id
        JOIN PERSON p ON pl.player_id = p.kfupm_id
        WHERE gd.match_no = $1 AND gd.team_id = $2
      `, [match.match_no, match.team_id2]);

      const cards1 = await pool.query(`
        SELECT p.name FROM PLAYER_BOOKED pb
        JOIN PERSON p ON pb.player_id = p.kfupm_id
        WHERE pb.match_no = $1 AND pb.team_id = $2 AND pb.sent_off = 'Y'
      `, [match.match_no, match.team_id1]);

      const cards2 = await pool.query(`
        SELECT p.name FROM PLAYER_BOOKED pb
        JOIN PERSON p ON pb.player_id = p.kfupm_id
        WHERE pb.match_no = $1 AND pb.team_id = $2 AND pb.sent_off = 'Y'
      `, [match.match_no, match.team_id2]);

      const [score1, score2] = match.goal_score?.includes('-') ? match.goal_score.split('-').map(Number) : [null, null];

      return {
        match_no: match.match_no,
        tr_id: match.tr_id,
        date: match.play_date,
        team1: match.team1,
        team2: match.team2,
        score1,
        score2,
        scorers1: scorers1.rows.map(r => r.name),
        scorers2: scorers2.rows.map(r => r.name),
        cards1: cards1.rows.map(r => r.name),
        cards2: cards2.rows.map(r => r.name)
      };
    }));

    res.json(matches);
  } catch (err) {
    console.error('❌ Error fetching match results:', err);
    res.status(500).json({ error: 'Failed to load match results.' });
  }
});

// matches.js

router.get('/teams-with-players/:tr_id', async (req, res) => {
  const { tr_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         t.team_id,
         t.team_name,
         COALESCE(json_agg(p.name) FILTER (WHERE p.name IS NOT NULL), '[]') AS players
       FROM TOURNAMENT_TEAM tt
       JOIN TEAM t ON tt.team_id = t.team_id
       LEFT JOIN TEAM_PLAYER tp ON t.team_id = tp.team_id
       LEFT JOIN PERSON p ON tp.player_id = p.kfupm_id
       WHERE tt.tr_id = $1
       GROUP BY t.team_id, t.team_name
       ORDER BY t.team_name`,
      [tr_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching teams with players:', err);
    res.status(500).json({ error: 'Failed to fetch teams with players.' });
  }
});

// ✅ Add this route to matches.js
router.get('/redcards/:tr_id', async (req, res) => {
  const { tr_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         t.team_name,
         p.name AS player_name
       FROM PLAYER_BOOKED pb
       JOIN PLAYER pl ON pb.player_id = pl.player_id
       JOIN PERSON p ON pl.player_id = p.kfupm_id
       JOIN TEAM t ON pb.team_id = t.team_id
       JOIN TOURNAMENT_TEAM tt ON t.team_id = tt.team_id
       WHERE pb.sent_off = 'Y' AND tt.tr_id = $1
       ORDER BY t.team_name, p.name`,
      [tr_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching red carded players:', err);
    res.status(500).json({ error: 'Failed to fetch red carded players.' });
  }
});

module.exports = router;
