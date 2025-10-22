// api/log.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Hardcoded secure API key
  const API_KEY = "c3f9a1b2e4d6f7a8c9b0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1";

  // Hardcoded Discord webhook
  const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1420458661943312436/dilhVJgICcqqF-GNoQhk-YvhojlMRpl3ZYschV4HFuc7QlFKQzUsw48hC8gIr0gD09d6";

  const providedKey = req.headers["x-api-key"] || req.headers["X-API-KEY"];
  if (!providedKey || providedKey !== API_KEY) {
    return res.status(401).json({ ok: false, error: "Invalid API key" });
  }

  // Accept JSON body { content: "..." }
  const content = typeof req.body?.content === "string" ? req.body.content : "";
  if (!content) {
    return res.status(400).json({ ok: false, error: "Empty content" });
  }

  // Reject if any ASCII letters (A-Z or a-z)
  if (/[A-Za-z]/.test(content)) {
    return res.status(400).json({ ok: false, error: "Content contains letters; declined" });
  }

  // Normalize newlines and count lines
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lineCount = normalized === "" ? 0 : normalized.split("\n").length;
  if (lineCount > 2) {
    return res.status(400).json({ ok: false, error: "Content has more than 2 lines; declined" });
  }

  // Maximum length safety for Discord
  if (normalized.length > 2000) {
    return res.status(400).json({ ok: false, error: "Content too long" });
  }

  try {
    const r = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: normalized }),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      console.error("Discord webhook returned", r.status, text);
      return res.status(502).json({ ok: false, error: "Failed to post to Discord", discordStatus: r.status });
    }

    return res.status(200).json({ ok: true, forwarded: true });
  } catch (err) {
    console.error("Error forwarding to Discord:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
