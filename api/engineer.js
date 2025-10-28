let eclipsecheat = 2009; // stored in memory (resets when Vercel restarts)

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Send the current number
    res.status(200).json({ eclipsecheat });
  } else if (req.method === 'POST') {
    // Update the number
    eclipsecheat = req.body.number;
    res.status(200).json({ message: 'you are a skid', eclipsecheat });
  } else {
    // Invalid method
    res.status(405).json({ message: 'Method not allowed' });
  }
}
