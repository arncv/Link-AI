const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require('cors');
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Define a global conversation log
let conversationLog = [];

// Define a function to generate a prompt for the chatbot
function generatePrompt(message) {
    return `
      The following is a conversation between a human and a chatbot.
  
      Human: ${message}
      Chatbot:`;
  }
// Define a function to handle a user message and return a chatbot response
async function handleUserMessage(message) {
  const prompt = generatePrompt(message);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 64,
  });

  const reply = response.data.choices[0].text.trim();

  conversationLog.push({ userMessage: message, botMessage: reply });

  return reply;
}

// Define a route to handle incoming chat messages
app.post("/chat", async (req, res) => {
  const message = req.body.message;

  const reply = await handleUserMessage(message);

  res.json({ reply });
});

  
// Define a route to retrieve the conversation log
app.get("/chat", (req, res) => {
    res.json({ conversationLog });
});

app.post('/api/generate', async(req, res) => {
  try {
    const description = req.body.description;

    const response = await openai.createImage({
      prompt: description,
      n: 1,
      size: '512x512'
    })

    const { data } = response.data;
    const { url: imageUrl } = data[0];

    const message = await client.messages.create({
      body: `Image generated: ${imageUrl}`,
      from: process.env.TWILIO_PHONE,
      to: process.env.MY_PHONE
    });

    return res.send(`<a href="${imageUrl}" target="_blank"><img src="${imageUrl}"></a>`);
  } catch(error) {
    return res.status(500).json({ message: 'Error generating image' });
  }
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
