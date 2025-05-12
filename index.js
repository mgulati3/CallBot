// import express from 'express';
// import https from 'https';
// import twilio from 'twilio';
// import 'dotenv/config';

// const app = express();
// const port = 3000;

// // Add middleware to parse incoming POST data
// app.use(express.urlencoded({ extended: true }));

// // Configuration
// const ULTRAVOX_API_KEY = process.env.ULTRAVOX_API_KEY;
// const ULTRAVOX_API_URL = 'https://api.ultravox.ai/api/calls';

// // Static Dan.ai system prompt
// const SYSTEM_PROMPT = `
// Your name is Steve and you’re answering calls on behalf of Dan.ai, a company that helps trucking clients:
// 1) Look up any appointments related to trucks (dates, times, locations).
// 2) Check whether a customer’s cargo has been loaded or unloaded.

// Capabilities & features:
// - Book new trucking appointments on the spot.
// - Answer calls in an energetic, sales-style voice.
// - Handle short Q&A flows (FAQs) about Dan.ai’s services.
// - Collect all necessary details (truck ID, date, customer info) to follow up.

// When a call comes in:
// 1. Greet the caller warmly and introduce yourself as “Steve from Dan.ai.”
// 2. Ask how you can help (e.g. “Are you calling to book a truck appointment or check a load status?”).
// 3. If they want to book, collect: date, time, pickup/dropoff locations, and confirm.
// 4. If they want load status, ask for their load or truck ID and reply with “Your shipment is currently [loaded / unloaded].”
// 5. For any other questions, give concise, helpful answers and offer to connect them with a human if needed.
// Remember to confirm all key details before ending the call.
// `.trim();

// const ULTRAVOX_CALL_CONFIG = {
//   systemPrompt: SYSTEM_PROMPT,
//   model: 'fixie-ai/ultravox',
//   voice: 'Mark',
//   temperature: 0.3,
//   firstSpeaker: 'FIRST_SPEAKER_AGENT',
//   medium: { twilio: {} }
// };

// // Create Ultravox call and get join URL
// async function createUltravoxCall(config = ULTRAVOX_CALL_CONFIG) {
//   const request = https.request(ULTRAVOX_API_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-API-Key': ULTRAVOX_API_KEY
//     }
//   });

//   return new Promise((resolve, reject) => {
//     let data = '';
//     request.on('response', (response) => {
//       response.on('data', chunk => data += chunk);
//       response.on('end', () => resolve(JSON.parse(data)));
//     });
//     request.on('error', reject);
//     request.write(JSON.stringify(config));
//     request.end();
//   });
// }

// // Handle incoming calls
// app.post('/incoming', async (req, res) => {
//   try {
//     const callerNumber = req.body.From;
//     console.log(`Incoming call from: ${callerNumber}`);

//     // Inject caller context into Dan.ai prompt
//     const dynamicSystemPrompt = `
// Your name is Steve and you’re answering calls on behalf of Dan.ai, a company that helps trucking clients:
// 1) Look up any appointments related to trucks (dates, times, locations).
// 2) Check whether a customer’s cargo has been loaded or unloaded.

// IMPORTANT CONTEXT:
// - The caller’s phone number is: ${callerNumber}

// Capabilities & features:
// - Book new trucking appointments on the spot.
// - Answer calls in an energetic, sales-style voice.
// - Handle short Q&A flows (FAQs) about Dan.ai’s services.
// - Collect all necessary details (truck ID, date, customer info) to follow up.

// When a call comes in:
// 1. Greet the caller warmly and introduce yourself as “Steve from Dan.ai.”
// 2. Ask how you can help (e.g. “Are you calling to book a truck appointment or check a load status?”).
// 3. If they want to book, collect: date, time, pickup/dropoff locations, and confirm.
// 4. If they want load status, ask for their load or truck ID and reply with “Your shipment is currently [loaded / unloaded].”
// 5. For any other questions, give concise, helpful answers and offer to connect them with a human if needed.
// Remember to confirm all key details before ending the call.
// `.trim();

//     const callConfig = {
//       ...ULTRAVOX_CALL_CONFIG,
//       systemPrompt: dynamicSystemPrompt
//     };

//     const { joinUrl } = await createUltravoxCall(callConfig);

//     const twiml = new twilio.twiml.VoiceResponse();
//     const connect = twiml.connect();
//     connect.stream({ url: joinUrl, name: 'ultravox' });

//     res.type('text/xml').send(twiml.toString());
//   } catch (error) {
//     console.error('Error handling incoming call:', error);
//     const twiml = new twilio.twiml.VoiceResponse();
//     twiml.say('Sorry, there was an error connecting your call.');
//     res.type('text/xml').send(twiml.toString());
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// import express from 'express';
// import https from 'https';
// import twilio from 'twilio';
// import fs from 'fs';
// import path from 'path';
// import 'dotenv/config';

// const app = express();
// const port = 3000;

// // Parse incoming POST data
// app.use(express.urlencoded({ extended: true }));

// // Configuration
// const ULTRAVOX_API_KEY = process.env.ULTRAVOX_API_KEY;
// const ULTRAVOX_API_URL = 'https://api.ultravox.ai/api/calls';

// // Static Dan.ai system prompt
// const SYSTEM_PROMPT = `
// Your name is Steve and you’re answering calls on behalf of Dan.ai, a company that helps trucking clients:
// 1) Look up any appointments related to trucks (dates, times, locations).
// 2) Check whether a customer’s cargo has been loaded or unloaded.

// Capabilities & features:
// - Book new trucking appointments on the spot.
// - Answer calls in an energetic, sales-style voice.
// - Handle short Q&A flows (FAQs) about Dan.ai’s services.
// - Collect all necessary details (truck ID, date, customer info) to follow up.

// When a call comes in:
// 1. Greet the caller warmly and introduce yourself as “Steve from Dan.ai.”
// 2. Ask how you can help (e.g. “Are you calling to book a truck appointment or check a load status?”).
// 3. If they want to book, collect: date, time, pickup/dropoff locations, and confirm.
// 4. If they want load status, ask for their load or truck ID and reply with “Your shipment is currently [loaded / unloaded].”
// 5. For any other questions, give concise, helpful answers and offer to connect them with a human if needed.
// Remember to confirm all key details before ending the call.
// `.trim();

// const ULTRAVOX_CALL_CONFIG = {
//   systemPrompt: SYSTEM_PROMPT,
//   model: 'fixie-ai/ultravox',
//   voice: 'Mark',
//   temperature: 0.3,
//   firstSpeaker: 'FIRST_SPEAKER_AGENT',
//   medium: { twilio: {} }
// };

// // Utility to append a record to calls.json
// function logCall(record) {
//   const file = path.resolve('./calls.json');
//   fs.readFile(file, 'utf8', (err, data) => {
//     let arr = [];
//     if (!err) {
//       try {
//         arr = JSON.parse(data);
//       } catch {}
//     }
//     arr.push(record);
//     fs.writeFile(file, JSON.stringify(arr, null, 2), err => {
//       if (err) console.error('Failed to write calls.json:', err);
//     });
//   });
// }

// // Create Ultravox call and get join URL
// async function createUltravoxCall(config = ULTRAVOX_CALL_CONFIG) {
//   const request = https.request(ULTRAVOX_API_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-API-Key': ULTRAVOX_API_KEY
//     }
//   });

//   return new Promise((resolve, reject) => {
//     let data = '';
//     request.on('response', response => {
//       response.on('data', chunk => (data += chunk));
//       response.on('end', () => resolve(JSON.parse(data)));
//     });
//     request.on('error', reject);
//     request.write(JSON.stringify(config));
//     request.end();
//   });
// }

// // Handle incoming calls
// app.post('/incoming', async (req, res) => {
//   try {
//     const callerNumber = req.body.From;
//     console.log(`Incoming call from: ${callerNumber}`);

//     // Build dynamic prompt with caller context
//     const dynamicSystemPrompt = `
// ${SYSTEM_PROMPT}

// IMPORTANT CONTEXT:
// - The caller’s phone number is: ${callerNumber}
// `.trim();

//     const callConfig = {
//       ...ULTRAVOX_CALL_CONFIG,
//       systemPrompt: dynamicSystemPrompt
//     };

//     // Get the stream URL
//     const { joinUrl } = await createUltravoxCall(callConfig);

//     // Log into calls.json
//     logCall({
//       callerNumber,
//       timestamp: new Date().toISOString(),
//       joinUrl
//     });

//     // Respond with TwiML to connect the stream
//     const twiml = new twilio.twiml.VoiceResponse();
//     const connect = twiml.connect();
//     connect.stream({ url: joinUrl, name: 'ultravox' });

//     res.type('text/xml').send(twiml.toString());
//   } catch (error) {
//     console.error('Error handling incoming call:', error);
//     const twiml = new twilio.twiml.VoiceResponse();
//     twiml.say('Sorry, there was an error connecting your call.');
//     res.type('text/xml').send(twiml.toString());
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


import express from 'express';
import https from 'https';
import twilio from 'twilio';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

// Your Ultravox credentials
const ULTRAVOX_API_KEY = process.env.ULTRAVOX_API_KEY;
const ULTRAVOX_API_URL = 'https://api.ultravox.ai/api/calls';

// Base Dan.ai system prompt
const SYSTEM_PROMPT = `
You are Steve, speaking in the “Mark” voice, handling Dan.ai calls *one question at a time*.  
Follow this protocol exactly:

1. Greet:
   • Say: “Hello, this is Steve from Dan.ai. How can I help you today?”  
   • Then *pause* for the caller’s response.

2. If caller says “book appointment” (or similar):
   a) Ask: “Sure—what date would you like?”  
   b) Pause for response.  
   c) Ask: “Great. And what time?”  
   d) Pause.  
   e) Ask: “Lastly, what pickup and drop-off locations?”  
   f) Pause.  
   g) Confirm: “Okay—I have you down for [DATE] at [TIME] from [LOCATIONS]. Is that correct?”  
   h) Pause, then say “Thank you. Our team will follow up shortly. Goodbye!” and hang up.

3. If caller says “check status” (or similar):
   a) Ask: “Please tell me your truck or load ID.”  
   b) Pause.  
   c) Reply: “Your shipment [ID] is currently [loaded/unloaded]. Goodbye!” and hang up.

4. For any *other* question:
   a) Say: “Let me check on that for you.”  
   b) Pause while you think.  
   c) Give a concise answer or say: “I’m not sure—let me connect you to a human.”  
   d) If handing off, bridge to your support number.

**Do not** list all options at once. Always ask one thing and wait.
`.trim();

// Default Ultravox call config with Mark’s voice
const ULTRAVOX_CALL_CONFIG = {
  systemPrompt: SYSTEM_PROMPT,
  model: 'fixie-ai/ultravox',
  voice: 'Mark',
  temperature: 0.3,
  firstSpeaker: 'FIRST_SPEAKER_AGENT',
  medium: { twilio: {} }
};

// Helper to create an Ultravox call and return its join URL
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
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(JSON.stringify(config));
    req.end();
  });
}

// Webhook for incoming calls
app.post('/incoming', async (req, res) => {
  try {
    const callerNumber = req.body.From;
    console.log(`Incoming call from: ${callerNumber}`);

    // Inject the caller's number into the prompt context
    const dynamicPrompt = `
${SYSTEM_PROMPT}

IMPORTANT CONTEXT:
- The caller’s phone number is: ${callerNumber}

Handle the conversation end-to-end in this same “Mark” voice via Ultravox.
    `.trim();

    // Create the Ultravox call
    const { joinUrl } = await createUltravoxCall({
      ...ULTRAVOX_CALL_CONFIG,
      systemPrompt: dynamicPrompt
    });

    // Respond with TwiML that streams to Ultravox
    const twiml = new twilio.twiml.VoiceResponse();
    const connect = twiml.connect();
    connect.stream({ url: joinUrl, name: 'ultravox' });

    res.type('text/xml').send(twiml.toString());
  } catch (error) {
    console.error('Error connecting to Ultravox:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, we’re having trouble right now.');
    res.type('text/xml').send(twiml.toString());
  }
});

// Start listening
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
