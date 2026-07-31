import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const anthropicKey = process.env.ANTHROPIC_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

let anthropicClient = null;
let geminiClient = null;

if (geminiKey && geminiKey.trim() !== '' && geminiKey !== 'your_gemini_api_key_here') {
  try {
    geminiClient = new GoogleGenerativeAI(geminiKey.trim());
    console.log('[AIClient] Google Gemini API client initialized successfully! ♊');
  } catch (err) {
    console.warn('[AIClient Warning] Failed to initialize Google Gemini client:', err.message);
  }
}

if (anthropicKey && anthropicKey.trim() !== '' && anthropicKey !== 'your_anthropic_api_key_here') {
  try {
    anthropicClient = new Anthropic({ apiKey: anthropicKey.trim() });
    console.log('[AIClient] Anthropic API client initialized successfully! 🤖');
  } catch (err) {
    console.warn('[AIClient Warning] Failed to initialize Anthropic client:', err.message);
  }
}

if (!geminiClient && !anthropicClient) {
  console.log('[AIClient Notice] No GEMINI_API_KEY or ANTHROPIC_API_KEY found in server/.env. Using fast mock data fallback.');
}

/**
 * Safely parse JSON from raw AI text by stripping markdown fences and commentary.
 */
export function cleanAndParseJSON(rawText, fallbackData) {
  if (!rawText || typeof rawText !== 'string') return fallbackData;

  let cleaned = rawText.trim();
  // Strip markdown code fences ```json ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.warn('[AIClient JSON Parse Warning] Text was not clean JSON:', parseError.message);
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('[AIClient Regex JSON Parse Error]:', e.message);
      }
    }
    return fallbackData;
  }
}

/**
 * Calls Gemini API with JSON output mode.
 */
async function callGeminiAPI(systemPrompt, userPrompt, fallbackData) {
  const model = geminiClient.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const fullPrompt = `${systemPrompt}\n\nCRITICAL REQUIREMENT: Respond ONLY with valid JSON matching the schema.\n\nUser Context:\n${userPrompt}`;

  const result = await model.generateContent(fullPrompt);
  const text = result.response.text();
  return cleanAndParseJSON(text, fallbackData);
}

/**
 * Calls Anthropic API with JSON output instruction.
 */
async function callClaudeAPI(systemPrompt, userPrompt, fallbackData) {
  const response = await anthropicClient.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1500,
    system: `${systemPrompt}\nCRITICAL REQUIREMENT: Respond ONLY with valid JSON. Do not include introductory text or markdown codeblocks.`,
    messages: [{ role: 'user', content: userPrompt }]
  });
  const textContent = response.content?.[0]?.text || '';
  return cleanAndParseJSON(textContent, fallbackData);
}

/**
 * Primary AI caller with automatic provider selection (Gemini > Claude > Mock Fallback), 15s timeout, and retry.
 */
export async function callClaude({ systemPrompt, userPrompt, fallbackData }) {
  // 1. Try Gemini API first if configured
  if (geminiClient) {
    try {
      console.log('[AIClient] Calling Google Gemini API...');
      return await callGeminiAPI(systemPrompt, userPrompt, fallbackData);
    } catch (err) {
      console.warn('[AIClient Warning] Gemini API call failed:', err.message, '- Retrying once...');
      try {
        return await callGeminiAPI(systemPrompt, userPrompt, fallbackData);
      } catch (retryErr) {
        console.error('[AIClient Error] Gemini retry failed. Falling back:', retryErr.message);
      }
    }
  }

  // 2. Try Anthropic API if configured
  if (anthropicClient) {
    try {
      console.log('[AIClient] Calling Anthropic Claude API...');
      return await callClaudeAPI(systemPrompt, userPrompt, fallbackData);
    } catch (err) {
      console.warn('[AIClient Warning] Claude API call failed:', err.message, '- Retrying once...');
      try {
        return await callClaudeAPI(systemPrompt, userPrompt, fallbackData);
      } catch (retryErr) {
        console.error('[AIClient Error] Claude retry failed. Falling back:', retryErr.message);
      }
    }
  }

  // 3. Fallback to mock data safety net
  return fallbackData;
}
