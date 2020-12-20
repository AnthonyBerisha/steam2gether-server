const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const axios = require('axios');

const gc = require('../controllers/GameController');
const GameController = new gc();

router.get('/:id', (req, res) => {
  return GameController.getUserGameList(req, res)
});

router.get('', async (req, res) => {
  // Check if there are ids in the query string
  if (req.query.ids)
    return GameController.getCommonGamesList(req, res, req.query.ids)
  // Failure if not
  else
    res.send(400)
});

module.exports = router