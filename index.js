import express from 'express';
import https from 'https';
import twilio from 'twilio';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

// parse form-encoded POST bodies (Twilio will still populate req.body)
app.use(express.urlencoded({ extended: true }));

// Your Ultravox config
const ULTRAVOX_API_KEY = process.env.ULTRAVOX_API_KEY;
const ULTRAVOX_API_URL = 'https://api.ultravox.ai/api/calls';

const SYSTEM_PROMPT = `
You are Steve, speaking in the calm “Mark” voice for Dan.ai.
Sound friendly and human.  Use natural pauses created by commas,
periods, or ellipses ( … ).  Do NOT say the word “pause” or describe
your pauses—just insert short silences in your delivery.

Greeting  
• Say: “Hi there … this is Steve from Dan.ai.  How can I help you today?”  
• Then stop and listen.

Booking flow  
1. “Sure, uh … what date works for you?” — wait.  
2. “Great.  And what time would you like?” — wait.  
3. “Lastly, where should we pick up and drop off?” — wait.  
4. “Perfect.  I have you for [DATE] at [TIME], from [PICKUP] to [DROPOFF].”  
5. “Is there anything else I can help you with today?” — wait.  
6. If “no”: “Thanks for calling Dan.ai.  Have a wonderful day!” — hang up.

Status flow  
1. “Sure, may I have your truck or load I‑D?” — wait.  
2. “Let me check … okay, your shipment [ID] is currently [loaded / unloaded].”  
3. “Can I help you with anything else?” — wait.  
4. If “no”: “Alright, thanks for checking in with Dan.ai.  Take care!” — hang up.

Other questions  
1. “Let me just see …” — brief silence while you think.  
2. Give a concise answer or say:  
   “Hmm, I’m not certain—let me connect you with our support team.”  
3. “Anything else I can do for you?” — wait.  
4. If “no”: “Thank you for choosing Dan.ai.  Have a great day!” — hang up.

Rules  
• Ask only one question, then wait for the caller’s answer.  
• Sprinkle in light fillers (“uh”, “sure thing”) to stay informal, but not overdone.  
• Always finish a task by asking if the caller needs anything else before ending the call.
`.trim();

const ULTRAVOX_CALL_CONFIG = {
  systemPrompt: SYSTEM_PROMPT,
  model: 'fixie-ai/ultravox',
  voice: 'Mark',
  temperature: 0.3,
  firstSpeaker: 'FIRST_SPEAKER_AGENT',
  medium: { twilio: {} }
};

async function createUltravoxCall(config = ULTRAVOX_CALL_CONFIG) {
  const req = https.request(ULTRAVOX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': ULTRAVOX_API_KEY
    }
  });

  return new Promise((resolve, reject) => {
    let data = '';
    req.on('response', res => {
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(JSON.stringify(config));
    req.end();
  });
}

// ————————————————————————————————————————————————————————————
// Webhook for incoming calls (no signature validation for now)
// ————————————————————————————————————————————————————————————
app.post('/incoming', async (req, res) => {
  try {
    const callerNumber = req.body.From;
    console.log(`Incoming call from: ${callerNumber}`);

    const dynamicPrompt = `
${SYSTEM_PROMPT}

IMPORTANT CONTEXT:
- Caller’s number: ${callerNumber}

Handle the entire conversation via Ultravox in the “Mark” voice.
`.trim();

    const { joinUrl } = await createUltravoxCall({
      ...ULTRAVOX_CALL_CONFIG,
      systemPrompt: dynamicPrompt
    });

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.connect().stream({ url: joinUrl, name: 'ultravox' });

    res.type('text/xml').send(twiml.toString());
  } catch (err) {
    console.error('Ultravox error:', err);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, we’re having trouble right now.');
    res.type('text/xml').send(twiml.toString());
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
