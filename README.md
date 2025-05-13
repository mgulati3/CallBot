# 📞 Dan.ai Voice Call Bot

A lightweight Node + Express server that picks up your Twilio phone calls, streams them to **Ultravox** (voice = “Mark”), and lets “Steve”:

- book trucking appointments  
- check load status  
- handle short FAQs — **one question at a time**  

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Conversational AI** | Friendly, human‑sounding prompt (no “pause” tokens) |
| **Ultravox Streaming** | Male “Mark” voice for all dialogue |
| **Twilio Webhooks** | Receives calls, returns TwiML `<Connect><Stream>` |
| **Local dev via ngrok** | Expose `localhost` to Twilio in seconds |
| **Quick setup** | Just clone, install, add `.env`, and run |

---

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/<your‑username>/callbot.git
cd callbot
npm install
```

### 2. Create `.env`

```dotenv
# .env
ULTRAVOX_API_KEY=sk-********************************
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_auth_token
PORT=3000
```

*(Keep this file private — never commit it.)*

### 3. Run the server

```bash
node index.js           # or: npm start
```

### 4. Expose with ngrok

```bash
ngrok http 3000
```

Copy the **HTTPS** forwarding URL (e.g. `https://abcd-1234.ngrok-free.app`).

### 5. Point Twilio to your webhook

1. Console → **Phone Numbers → Active Numbers** → click your number  
2. **Voice & Fax → A Call Comes In**  
   - Webhook URL: `https://abcd-1234.ngrok-free.app/incoming`  
   - Method: **HTTP POST**  
3. Save

### 6. Call!

Dial your Twilio number (e.g. **(330) 681‑1174**).  
You’ll hear Steve in a natural male voice guiding you through booking or status checks.

---

## 🛠  Developer Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run `node index.js` |
| `npm run dev` | *(if you install nodemon)* auto‑reload on file changes |

---

## 📚 Project Structure

```
callbot/
│
├─ index.js          # Express server + Ultravox/Twilio logic
├─ package.json      # npm dependencies & scripts
├─ .env.example      # sample env file (no secrets)
└─ README.md         # you’re here
```

---

## 🐞 Troubleshooting

| Issue | Fix |
|-------|-----|
| **`EADDRINUSE: port 3000`** | Another process is using the port. Kill it (`lsof -i :3000` → `kill -9 <PID>`), or change `PORT` in `.env` & ngrok. |
| **Twilio says “Application Error”** | Check `node` logs. Common causes: wrong `ULTRAVOX_API_KEY` or missing env vars. |
| **403 in ngrok** | You re‑enabled Twilio signature validation without raw‑body parsing. Disable validation or add the correct middleware. |
| **Steve reads “pause” aloud** | Make sure you’re using the prompt **without** any `[pause]` or `<break>` tags. |

---

## ✏️ Customizing

- **Change the voice**  
  Edit `voice: 'Mark'` in `ULTRAVOX_CALL_CONFIG`.

- **Tweak the prompt**  
  Modify `SYSTEM_PROMPT` for tone, fillers, or extra flows.

- **Persist data**  
  Add a `postCallWebhook` to `ULTRAVOX_CALL_CONFIG` or log to a DB in `/incoming`.

- **Outbound calls**  
  Instantiate the Twilio REST client and use `client.calls.create({ ... })`.

---

### License

MIT — free to use, modify, and distribute.

*Happy trucking! 🚚*
