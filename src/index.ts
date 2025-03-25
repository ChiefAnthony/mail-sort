import { Hono } from "hono";
import { google } from "googleapis";
import "dotenv/config";

const app = new Hono();

// configure OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.API_KEY,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

app.get("/search-emails", async (c) => {
  const query = c.req.query("q") || "";
  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: query,
    });
    const messages = res.data.messages || [];
    return c.json({ messages });
  } catch (error) {
    return c.json({}, 500);
  }
});

export default {
  port: 3000,
  fetch: app.fetch,
};
