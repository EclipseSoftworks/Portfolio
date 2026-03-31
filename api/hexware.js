let executionLog = [];

// Replace this with a secure random key in production
const API_KEY = "HEXONEXECUTIONSTATEMATTER";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers['x-api-key'];
  if (!authHeader || authHeader !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { username, script } = req.body;

  if (!username || !script) {
    return res.status(400).json({ error: "username and script are required" });
  }

  // Add execution to log
  const startTime = new Date().toISOString();
  const logEntry = `${startTime} - ${username}: ${script}`;
  executionLog.push(logEntry);

  // Optional: keep last 20 executions
  if (executionLog.length > 20) executionLog.shift();

  // Simulate 3 seconds execution
  await new Promise(resolve => setTimeout(resolve, 3000));

  res.status(200).json({
    message: "Executed successfully",
    currentLog: executionLog
  });
}
