// /api/eclipsedatabase.js

let gamesDatabase = []; // in-memory storage (works on Vercel)

const API_KEY = 'K7f9D4sX2mLpQ8zV6rT1bNjU3wYvA0HqZ5xRkCjF9aE2oP1sL8dM';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { apiKey, games } = req.body;

    if (apiKey !== API_KEY) {
      return res.status(403).json({ error: 'Invalid API key' });
    }

    if (!Array.isArray(games)) {
      return res.status(400).json({ error: 'Invalid games data' });
    }

    gamesDatabase = games; // update memory

    return res.status(200).json({
      success: true,
      message: 'Games updated successfully!',
      totalGames: gamesDatabase.length,
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json(gamesDatabase);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
