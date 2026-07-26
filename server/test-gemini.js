const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: 'Hello',
    });
    console.log(response.text);
  } catch (error) {
    console.error(error);
  }
}
run();
