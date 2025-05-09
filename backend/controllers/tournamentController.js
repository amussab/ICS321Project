const db = require('../db');

exports.getAllTournaments = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM TOURNAMENT');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching tournaments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
