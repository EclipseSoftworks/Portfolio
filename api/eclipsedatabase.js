// /api/eclipsedatabase.js

let gamesDatabase = []; // in-memory storage

const API_KEY = 'K7f9D4sX2mLpQ8zV6rT1bNjU3wYvA0HqZ5xRkCjF9aE2oP1sL8dM';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Parse JSON body manually
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject('Invalid JSON');
          }
        });
      });

      const { apiKey, games } = body;

      if (apiKey !== API_KEY) {
        return res.status(403).json({ error: 'Invalid API key' });
      }

      if (!Array.isArray(games)) {
        return res.status(400).json({ error: 'Invalid games data' });
      }

      // Update memory
      gamesDatabase = games;

      return res.status(200).json({
        success: true,
        message: 'Games updated successfully!',
        totalGames: gamesDatabase.length,
      });

    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json(gamesDatabase);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
