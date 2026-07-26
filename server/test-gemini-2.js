const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    // There isn't a direct list method exposed in this thin SDK maybe?
    // Let's try gemini-2.0-flash-exp
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Hello',
    });
    console.log('gemini-1.5-flash works:', response.text);
  } catch (error) {
    console.error('gemini-1.5-flash failed:', error.message);
  }
}
run();
