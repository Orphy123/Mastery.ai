import OpenAI from 'openai';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = openaiApiKey
  ? new OpenAI({ apiKey: openaiApiKey, dangerouslyAllowBrowser: true })
  : null;

const DIFFICULTY_GUIDES = {
  elementary: {
    label: 'elementary school (ages 8-10)',
    style: 'Use simple vocabulary. Questions should test basic recognition and recall. Answer choices should be clearly distinct.',
  },
  middle: {
    label: 'middle school (ages 11-13)',
    style: 'Use age-appropriate language. Questions should test understanding and simple application. Include some "why" and "how" questions.',
  },
  high: {
    label: 'high school (ages 14-17)',
    style: 'Use proper terminology. Questions should test analysis, comparison, and application. Include scenario-based questions.',
  },
  college: {
    label: 'college / university level',
    style: 'Use technical language freely. Questions should test critical thinking, synthesis, and evaluation. Include nuanced distractors.',
  },
};

/**
 * Generate practice problems by calling OpenAI.
 * Returns an array of well-formed question objects that the Practice UI can render.
 */
export const generateProblems = async (topic, difficulty = 'middle', count = 5) => {
  if (!openai) {
    throw new Error('OpenAI API key is missing. Set VITE_OPENAI_API_KEY in your .env file.');
  }

  const guide = DIFFICULTY_GUIDES[difficulty] || DIFFICULTY_GUIDES.middle;

  const prompt = `Generate exactly ${count} multiple-choice practice questions about "${topic}" for ${guide.label}.

${guide.style}

IMPORTANT RULES:
- Every question must be factually accurate.
- Each question must have EXACTLY 4 answer options.
- "correctAnswer" must be the EXACT text of one of the 4 options.
- All wrong options (distractors) must be plausible — no joke or obviously wrong answers.
- Vary question types: definitions, cause-and-effect, application, comparison, true/false reworded as MCQ.
- Hints should guide thinking, NOT give the answer away.
- Explanations should teach — explain WHY the correct answer is right and briefly why key distractors are wrong.

Return ONLY a JSON object with this exact shape (no markdown, no code fences):
{
  "questions": [
    {
      "problemText": "The full question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "hints": ["First hint", "Second hint"],
      "explanation": "Detailed explanation of the correct answer."
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are an expert quiz creator for educational platforms. You generate accurate, engaging, and age-appropriate multiple-choice questions. You always return valid JSON and nothing else.',
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-4o-mini',
    temperature: 0.8,
    max_tokens: 2500,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0].message.content;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error('Failed to parse OpenAI response as JSON:', raw);
    throw new Error('The AI returned an invalid response. Please try again.');
  }

  const questions = parsed.questions || parsed.problems || [];
  if (questions.length === 0) {
    throw new Error('No questions were generated. Please try a different topic.');
  }

  return questions.slice(0, count).map((q, i) => ({
    problemId: `ai-${Date.now()}-${i}`,
    conceptId: `concept-${topic.replace(/\s+/g, '-').toLowerCase()}-${i}`,
    problemText: q.problemText,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty,
    hints: q.hints || [],
    explanation: q.explanation || '',
  }));
};

/**
 * Verify if a user answer is correct
 */
export const verifyAnswer = (problem, answer) => {
  if (!problem || !answer) return false;
  return answer.trim().toLowerCase() === problem.correctAnswer.trim().toLowerCase();
};

/**
 * Adjust difficulty based on user performance
 */
export const adjustDifficulty = (performance) => {
  if (performance < 0.4) return 'elementary';
  if (performance < 0.7) return 'middle';
  if (performance < 0.85) return 'high';
  return 'college';
};

export const getHint = (problem, hintIndex) => {
  if (!problem?.hints || problem.hints.length <= hintIndex) return null;
  return problem.hints[hintIndex];
};

export const generateProblemId = () => `prob-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
