let number = 117006922827147; // stored in memory (resets when Vercel restarts)

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ number });
  } else if (req.method === 'POST') {
    number = req.body.number;
    res.status(200).json({ message: 'Number updated!', number });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
