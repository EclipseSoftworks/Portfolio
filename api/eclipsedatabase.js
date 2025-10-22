// /api/eclipsedatabase.js
import fs from 'fs';
import path from 'path';

const API_KEY = 'K7f9D4sX2mLpQ8zV6rT1bNjU3wYvA0HqZ5xRkCjF9aE2oP1sL8dM';
const DB_FILE = path.join(process.cwd(), 'db.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { apiKey, games } = req.body;

    if (apiKey !== API_KEY) return res.status(403).json({ error: 'Invalid API key' });
    if (!games || !Array.isArray(games)) return res.status(400).json({ error: 'Invalid games data' });

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(games, null, 2));
    } catch (err) {
      console.warn('⚠️ Could not write to file on Vercel. For persistence, use GitHub JSON or a DB.');
    }

    return res.status(200).json({ success: true, message: 'Games updated' });
  }

  if (req.method === 'GET') {
    try {
      const data = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) : [];
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read games data' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
