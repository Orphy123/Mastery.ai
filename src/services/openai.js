// src/services/openai.js
// Service for interacting with OpenAI API

import OpenAI from 'openai';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = openaiApiKey
  ? new OpenAI({
      apiKey: openaiApiKey,
      dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
    })
  : null;

const requireOpenAI = () => {
  if (!openai) {
    throw new Error('OpenAI API key is missing. Set VITE_OPENAI_API_KEY in your .env file.');
  }

  return openai;
};

const LEVEL_PROFILES = {
  elementary: {
    audience: 'a curious 8-10 year old (elementary school)',
    tone: 'Use very simple words, short sentences, and fun comparisons a kid would understand. Relate things to everyday life (toys, food, animals, school). Be enthusiastic and encouraging.',
    sentenceGuide: 'Keep each section to 2-3 short, simple sentences. Use bullet points with single short sentences.',
    sections: ['In a Nutshell', 'Key Ideas', 'How It Works', 'Fun Fact'],
  },
  middle: {
    audience: 'a middle school student (ages 11-13)',
    tone: 'Use clear, friendly language. You can introduce vocabulary but always explain it immediately. Use relatable analogies.',
    sentenceGuide: 'Keep each section to 3-4 sentences. Bullet points can be 1-2 sentences each.',
    sections: ['In a Nutshell', 'Key Ideas', 'How It Works', 'Real-World Examples', 'Think About It'],
  },
  high: {
    audience: 'a high school student (ages 14-17)',
    tone: 'Use proper terminology and explain it in context. Be clear and engaging while respecting their intelligence. Include cause-and-effect reasoning.',
    sentenceGuide: 'Each section can be 4-5 sentences. Use structured bullet points.',
    sections: ['In a Nutshell', 'Key Ideas', 'How It Works', 'Real-World Examples', 'Think About It', 'Go Further'],
  },
  college: {
    audience: 'a college or university student',
    tone: 'Use technical and academic language freely. Include nuance, edge cases, and connections to broader fields. Be thorough and precise.',
    sentenceGuide: 'Be thorough in each section. Use structured lists, technical terms, and detailed reasoning.',
    sections: ['In a Nutshell', 'Key Ideas', 'How It Works', 'Real-World Examples', 'Deep Dive', 'Go Further'],
  },
};

function buildExplanationParams(query, level) {
  const profile = LEVEL_PROFILES[level] || LEVEL_PROFILES.middle;
  const sectionInstructions = profile.sections.map((s) => `## ${s}`).join('\n');

  const prompt = `Explain "${query}" for ${profile.audience}.

RULES:
- ${profile.tone}
- ${profile.sentenceGuide}
- Start with a single bold sentence on its own line as a TLDR summary (no heading, no label — just the bold sentence).
- Then use EXACTLY these markdown headings in this order, each on its own line:
${sectionInstructions}
- Under each heading, use short paragraphs and/or bullet points.
- Do NOT add any headings beyond the ones listed above.
- Make every sentence count — no filler.`;

  return {
    messages: [
      {
        role: 'system',
        content:
          'You are Mastery.ai — a world-class educational explainer. You make any topic easy to understand by breaking it into bite-sized pieces. You always match your language to the student\'s age. You are concise, clear, and never boring.',
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 1200,
  };
}

/**
 * Generates a structured, grade-appropriate explanation for a given topic.
 * Supports streaming via an optional onUpdate callback — when provided, the
 * response streams token-by-token and onUpdate is called with the accumulated
 * text so the UI can render progressively.
 *
 * @param {string} query - The question to be explained
 * @param {string} level - The educational level (elementary, middle, high, college)
 * @param {Object} [opts]
 * @param {(text: string) => void} [opts.onUpdate] - Called with accumulated text on each chunk
 * @returns {Promise<string>} - The full generated explanation
 */
export const generateExplanation = async (query, level = 'middle', { onUpdate } = {}) => {
  const params = buildExplanationParams(query, level);

  try {
    if (onUpdate) {
      const stream = await requireOpenAI().chat.completions.create({ ...params, stream: true });
      let accumulated = '';
      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          accumulated += delta;
          onUpdate(accumulated);
        }
      }
      return accumulated;
    }

    const completion = await requireOpenAI().chat.completions.create(params);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating explanation:', error);
    throw new Error('Failed to generate explanation. Please try again.');
  }
};

/**
 * Summarizes a given text using OpenAI API
 * @param {string} text - The text to summarize
 * @returns {Promise<string>} - The generated summary
 */
export const generateSummary = async (text) => {
  // In a real implementation, this would make an API call to OpenAI
  console.log(`Generating summary for text of length: ${text.length}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Demo implementation with a simplified response
  return `This is a summary of the provided text. In a production environment, this would be generated by OpenAI's API to provide a concise overview of the key points contained in the original text.`;
};

/**
 * Identifies key concepts in a block of text
 * @param {string} text - The text to analyze
 * @returns {Promise<Array<string>>} - A list of key concepts
 */
export const extractConcepts = async (text) => {
  // In a real implementation, this would make an API call to OpenAI
  console.log(`Extracting concepts from text of length: ${text.length}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Demo implementation with placeholder concepts
  return [
    'Key Concept 1',
    'Important Term A',
    'Foundational Theory',
    'Practical Application'
  ];
};

/**
 * Generates study notes for a given topic
 * @param {string} topic - The topic to generate notes for
 * @param {string} level - The educational level
 * @returns {Promise<string>} - The generated study notes
 */
export const generateStudyNotes = async (topic, level = 'middle') => {
  // In a real implementation, this would make an API call to OpenAI
  console.log(`Generating study notes for: "${topic}" at ${level} level`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Return a simple formatted response
  return `
# Study Notes: ${topic}

## Key Points
- Main idea 1
- Main idea 2
- Main idea 3

## Important Definitions
- Term A: Definition
- Term B: Definition

## Examples
1. Example situation
2. Example problem

## Review Questions
1. Question about the topic?
2. How would you apply this concept?

These study notes are tailored for ${level} level students.
  `;
};

/**
 * Checks if the system is using demo mode vs actual API
 * @returns {boolean} - True if using demo mode
 */
export const isUsingDemoMode = () => !openaiApiKey;

/**
 * Send a chat message with full conversation history for context.
 * @param {string|Array} messageOrHistory - A single string, or an array of {role, content} messages
 * @returns {Promise<string>} - The assistant's response
 */
export const sendMessage = async (messageOrHistory) => {
  const messages = Array.isArray(messageOrHistory)
    ? messageOrHistory
    : [{ role: 'user', content: messageOrHistory }];

  try {
    const completion = await requireOpenAI().chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are Mastery.ai, a friendly and knowledgeable educational assistant. Help students learn by giving clear, encouraging explanations. Use markdown formatting when helpful. Keep answers concise but thorough.',
        },
        ...messages,
      ],
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw error;
  }
};