// backend/routes/tournaments.js

const express = require('express');
const router = express.Router();
const pool = require('../db/index');

// GET all tournaments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM TOURNAMENT');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tournaments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a single tournament by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM TOURNAMENT WHERE tr_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching tournament:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new tournament
// POST a new tournament
router.post('/', async (req, res) => {
  const { tr_name, start_date, end_date } = req.body;
  try {
    // Generate next available tr_id
    const result = await pool.query('SELECT MAX(tr_id) AS max FROM TOURNAMENT');
    const nextTrId = (result.rows[0]?.max || 200) + 1;

    await pool.query(
      'INSERT INTO TOURNAMENT (tr_id, tr_name, start_date, end_date) VALUES ($1, $2, $3, $4)',
      [nextTrId, tr_name, start_date, end_date]
    );

    res.status(201).json({ message: 'Tournament added successfully', tr_id: nextTrId });
  } catch (err) {
    console.error('Error inserting tournament:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update a tournament
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tr_name, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      'UPDATE TOURNAMENT SET tr_name = $1, start_date = $2, end_date = $3 WHERE tr_id = $4',
      [tr_name, start_date, end_date, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json({ message: 'Tournament updated successfully' });
  } catch (err) {
    console.error('Error updating tournament:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a tournament
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM TOURNAMENT WHERE tr_id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json({ message: 'Tournament deleted successfully' });
  } catch (err) {
    console.error('Error deleting tournament:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
