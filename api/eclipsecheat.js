// api/log.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const API_KEY = "c3f9a1b2e4d6f7a8c9b0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1";

  const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1420458661943312436/dilhVJgICcqqF-GNoQhk-YvhojlMRpl3ZYschV4HFuc7QlFKQzUsw48hC8gIr0gD09d6";

  // Validate API key
  const providedKey = req.headers["x-api-key"] || req.headers["X-API-KEY"];
  if (!providedKey || providedKey !== API_KEY) {
    return res.status(401).json({ ok: false, error: "Invalid API key" });
  }

  // Expect { content: "..." } JSON body
  const content = typeof req.body?.content === "string" ? req.body.content.trim() : "";
  if (!content) {
    return res.status(400).json({ ok: false, error: "No content provided" });
  }

  // Normalize input & validate lines
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n");
  
  if (lines.length > 3) {
    return res.status(400).json({ ok: false, error: "Content has more than 3 lines" });
  }

  // Discord safety limit
  if (normalized.length > 2000) {
    return res.status(400).json({ ok: false, error: "Content too long for Discord" });
  }

  try {
    const discordResponse = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: normalized }),
    });

    if (!discordResponse.ok) {
      const text = await discordResponse.text().catch(() => "");
      console.error("Discord webhook failure:", discordResponse.status, text);
      return res.status(502).json({
        ok: false,
        error: "Failed sending to Discord",
        discordStatus: discordResponse.status
      });
    }

    return res.status(200).json({ ok: true, sent: true });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
}
