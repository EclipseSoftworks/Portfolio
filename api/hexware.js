let executionLog = [];
const API_KEY = "my-secret-api-key";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers['x-api-key'];
  if (!authHeader || authHeader !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let body = req.body;
  // Vercel sometimes passes stringified JSON
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const { username, script } = body;
  if (!username || !script) {
    return res.status(400).json({ error: "username and script are required" });
  }

  // Add execution to log
  const timestamp = new Date().toISOString();
  executionLog.push(`${timestamp} - ${username}: ${script}`);

  // Optional: keep last 20 executions
  if (executionLog.length > 20) executionLog.shift();

  // Simulate 3 seconds execution
  await new Promise(resolve => setTimeout(resolve, 3000));

  res.status(200).json({ message: "Executed successfully", currentLog: executionLog });
}
