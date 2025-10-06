let eclipsecheat = 117006922827147; // stored in memory (resets when Vercel restarts)

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ number });
  } else if (req.method === 'POST') {
    eclipsecheat = req.body.number;
    res.status(200).json({ message: 'you are a skid', eclipsecheat });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
