const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

// GET all tournaments
router.get('/', tournamentController.getAllTournaments);

module.exports = router;
