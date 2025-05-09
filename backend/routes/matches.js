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

    // ✅ Get a real player for player_of_match
    const playerOfMatchResult = await pool.query(
      `SELECT tp.player_id
       FROM TEAM_PLAYER tp
       JOIN PERSON p ON tp.player_id = p.kfupm_id
       WHERE tp.team_id = $1
       LIMIT 1`,
      [team1_id]
    );
    const playerOfMatch = playerOfMatchResult.rows[0]?.player_id;
    if (!playerOfMatch) throw new Error('⚠️ No valid player_of_match found.');

    // ✅ Get an active venue
    const venueResult = await pool.query(
      `SELECT venue_id FROM VENUE WHERE venue_status = 'Y' LIMIT 1`
    );
    const venue_id = venueResult.rows[0]?.venue_id;
    if (!venue_id) throw new Error('⚠️ No active venue found.');

    // ✅ Insert match record
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

    // ✅ Insert goals
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

    // ✅ Insert red carded players
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

// Helper function
async function findPlayerId(name, team_id) {
  try {
    const result = await pool.query(
      `SELECT tp.player_id
       FROM TEAM_PLAYER tp
       JOIN PERSON p ON tp.player_id = p.kfupm_id
       WHERE tp.team_id = $1 AND p.name = $2`,
      [team_id, name]
    );
    return result.rows[0]?.player_id || null;
  } catch (err) {
    console.error('❌ Error in findPlayerId:', err);
    return null;
  }
}

// Top scorers
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

module.exports = router;
