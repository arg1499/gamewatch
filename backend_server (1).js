const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Supported sports and their ESPN endpoints
const SPORT_ENDPOINTS = {
  nba: 'basketball/nba',
  nfl: 'football/nfl',
  mlb: 'baseball/mlb',
  nhl: 'hockey/nhl',
  soccer: 'soccer',
  cfb: 'football/college-football',
  cbb: 'basketball/mens-college-basketball',
};

// ESPN Scoreboard base URL
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

// Proxy route: /api/games/:sport
app.get('/api/games/:sport', async (req, res) => {
  const sport = req.params.sport.toLowerCase();
  const endpoint = SPORT_ENDPOINTS[sport];
  if (!endpoint) {
    return res.status(400).json({ error: 'Unsupported sport' });
  }

  try {
    const url = `${ESPN_BASE}/${endpoint}/scoreboard`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/health', (_, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});