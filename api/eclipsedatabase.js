// /api/eclipsedatabase.js

let gamesDatabase = []; // in-memory storage
let lastReset = Date.now();

const API_KEY = 'K7f9D4sX2mLpQ8zV6rT1bNjU3wYvA0HqZ5xRkCjF9aE2oP1sL8dM';
const RESET_INTERVAL = 60 * 60 * 1000; // 1 hour

export default async function handler(req, res) {

  // ⏰ Auto reset every hour
  if (Date.now() - lastReset >= RESET_INTERVAL) {
    gamesDatabase = [];
    lastReset = Date.now();
  }

  if (req.method === 'POST') {
    try {
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

      // 🔁 Merge / update by Gameid
      for (const newGame of games) {
        if (!newGame.Gameid) continue;

        const index = gamesDatabase.findIndex(
          g => g.Gameid === newGame.Gameid
        );

        if (index !== -1) {
          // Update existing game
          gamesDatabase[index] = {
            ...gamesDatabase[index],
            ...newGame
          };
        } else {
          // Add new game
          gamesDatabase.push(newGame);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Games stored successfully!',
        totalGames: gamesDatabase.length
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
