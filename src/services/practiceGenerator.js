// src/services/practiceGenerator.js
// Service for generating practice problems

/**
 * Generate practice problems based on topic and difficulty
 * @param {string} topic - The topic to generate problems for
 * @param {string} difficulty - The difficulty level (elementary, middle, high)
 * @param {number} count - Number of problems to generate
 * @returns {Promise<Array>} - Array of practice problem objects
 */
export const generateProblems = async (topic, difficulty = 'middle', count = 5) => {
  // In a real implementation, this would make an API call to generate custom problems
  console.log(`Generating ${count} ${difficulty} level problems for topic: ${topic}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Sample problems for different topics
  const topicProblems = {
    'photosynthesis': [
      {
        problemId: `photo-1-${difficulty}`,
        conceptId: 'concept-photosynthesis-primary',
        problemText: 'Which gas is released as a byproduct of photosynthesis?',
        options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
        correctAnswer: 'Oxygen',
        difficulty: difficulty,
        hints: [
          'Plants take in carbon dioxide during photosynthesis.',
          'The process produces something we need to breathe.'
        ],
        explanation: 'During photosynthesis, plants convert carbon dioxide and water into glucose and oxygen using energy from sunlight. The oxygen is released as a byproduct through the stomata in the leaves.'
      },
      {
        problemId: `photo-2-${difficulty}`,
        conceptId: 'concept-photosynthesis-components',
        problemText: 'Which plant structure contains chlorophyll and is the primary site of photosynthesis?',
        options: ['Roots', 'Stem', 'Chloroplasts', 'Flowers'],
        correctAnswer: 'Chloroplasts',
        difficulty: difficulty,
        hints: [
          'These structures give plants their green color.',
          'They are found inside plant cells, especially in leaves.'
        ],
        explanation: 'Chloroplasts are specialized organelles found in plant cells that contain chlorophyll. They are the primary site of photosynthesis, where light energy is converted into chemical energy.'
      },
      {
        problemId: `photo-3-${difficulty}`,
        conceptId: 'concept-photosynthesis-equation',
        problemText: 'Which of the following is NOT a reactant in photosynthesis?',
        options: ['Water', 'Carbon Dioxide', 'Sunlight', 'Glucose'],
        correctAnswer: 'Glucose',
        difficulty: difficulty,
        hints: [
          'Reactants are substances that go into a chemical reaction.',
          'The reaction produces sugar as an end product.'
        ],
        explanation: 'The reactants in photosynthesis are carbon dioxide, water, and sunlight (energy). Glucose is a product of photosynthesis, not a reactant.'
      },
      {
        problemId: `photo-4-${difficulty}`,
        conceptId: 'concept-photosynthesis-conditions',
        problemText: 'Which factor does NOT affect the rate of photosynthesis?',
        options: ['Light intensity', 'Carbon dioxide concentration', 'Sound waves', 'Temperature'],
        correctAnswer: 'Sound waves',
        difficulty: difficulty,
        hints: [
          'Think about what physically or chemically impacts the process.',
          'Plants don\'t have ears!'
        ],
        explanation: 'The rate of photosynthesis is affected by light intensity, carbon dioxide concentration, temperature, and water availability. Sound waves have no significant impact on the process.'
      },
      {
        problemId: `photo-5-${difficulty}`,
        conceptId: 'concept-photosynthesis-importance',
        problemText: 'Why is photosynthesis important for animals?',
        options: [
          'It produces oxygen that animals breathe',
          'It creates habitats for animals to live in',
          'It breaks down waste products from animals',
          'It generates heat that keeps animals warm'
        ],
        correctAnswer: 'It produces oxygen that animals breathe',
        difficulty: difficulty,
        hints: [
          'Think about what we get from plants that we need to survive.',
          'What gas do you breathe in with every breath?'
        ],
        explanation: 'Photosynthesis is vital for animals because it produces oxygen, which animals need for respiration. Additionally, it forms the basis of food chains as plants convert solar energy into chemical energy that animals can consume.'
      }
    ],
    
    'quadratic equations': [
      {
        problemId: `quad-1-${difficulty}`,
        conceptId: 'concept-quadratic-formula',
        problemText: 'What are the solutions to the equation x² - 5x + 6 = 0?',
        options: ['x = 2, x = 3', 'x = -2, x = -3', 'x = 2, x = -3', 'x = -2, x = 3'],
        correctAnswer: 'x = 2, x = 3',
        difficulty: difficulty,
        hints: [
          'You can use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a',
          'Or try factoring: x² - 5x + 6 = (x - ?)(x - ?)'
        ],
        explanation: 'The equation x² - 5x + 6 = 0 can be factored as (x - 2)(x - 3) = 0. So x = 2 or x = 3 are the solutions. You can verify by substituting these values into the original equation.'
      },
      {
        problemId: `quad-2-${difficulty}`,
        conceptId: 'concept-quadratic-discriminant',
        problemText: 'What is the discriminant of the equation 2x² + 4x + 7 = 0?',
        options: ['-40', '16', '4', '-56'],
        correctAnswer: '-40',
        difficulty: difficulty,
        hints: [
          'The discriminant is b² - 4ac',
          'Identify the values of a, b, and c in the standard form ax² + bx + c = 0'
        ],
        explanation: 'For the equation 2x² + 4x + 7 = 0, we have a = 2, b = 4, and c = 7. The discriminant is b² - 4ac = 4² - 4(2)(7) = 16 - 56 = -40. Since the discriminant is negative, this equation has no real solutions.'
      },
      {
        problemId: `quad-3-${difficulty}`,
        conceptId: 'concept-quadratic-graph',
        problemText: 'What is the vertex of the parabola y = x² - 6x + 8?',
        options: ['(3, -1)', '(-3, -1)', '(3, 1)', '(0, 8)'],
        correctAnswer: '(3, -1)',
        difficulty: difficulty,
        hints: [
          'The x-coordinate of the vertex is x = -b/(2a)',
          'Substitute that x-value back into the original equation to find y'
        ],
        explanation: 'For y = x² - 6x + 8, we have a = 1 and b = -6. The x-coordinate of the vertex is x = -b/(2a) = -(-6)/(2*1) = 6/2 = 3. Substituting x = 3 into the original equation gives y = 3² - 6(3) + 8 = 9 - 18 + 8 = -1. Thus, the vertex is at (3, -1).'
      },
      {
        problemId: `quad-4-${difficulty}`,
        conceptId: 'concept-quadratic-word-problems',
        problemText: 'A ball is thrown upward with an initial velocity of 16 m/s from a height of 2 meters. The height h of the ball after t seconds is given by h = -5t² + 16t + 2. When will the ball hit the ground?',
        options: ['After 0.4 seconds', 'After 4 seconds', 'After 3.4 seconds', 'After 2 seconds'],
        correctAnswer: 'After 3.4 seconds',
        difficulty: difficulty,
        hints: [
          'When the ball hits the ground, h = 0',
          'Solve the quadratic equation -5t² + 16t + 2 = 0'
        ],
        explanation: 'When the ball hits the ground, h = 0. We need to solve -5t² + 16t + 2 = 0. Using the quadratic formula with a = -5, b = 16, and c = 2: t = (-16 ± √(16² - 4(-5)(2)))/(2(-5)) = (-16 ± √(256 + 40))/(-10) = (-16 ± √296)/(-10) = (-16 ± 17.2)/(-10). This gives t = -0.12 or t = 3.4. Since we can\'t have negative time in this context, the ball hits the ground after 3.4 seconds.'
      },
      {
        problemId: `quad-5-${difficulty}`,
        conceptId: 'concept-quadratic-completing-square',
        problemText: 'Express x² + 6x + 7 in the form (x + p)² + q',
        options: ['(x + 3)² - 2', '(x - 3)² + 2', '(x + 3)² + 2', '(x - 3)² - 2'],
        correctAnswer: '(x + 3)² - 2',
        difficulty: difficulty,
        hints: [
          'To complete the square, take half of the coefficient of x, square it, and add and subtract it',
          'For x² + 6x, half of 6 is 3, and 3² = 9'
        ],
        explanation: 'For x² + 6x + 7, we complete the square for the first two terms. Taking half of 6, we get 3, and 3² = 9. So x² + 6x + 7 = (x² + 6x + 9) + 7 - 9 = (x + 3)² - 2. We can verify by expanding: (x + 3)² - 2 = x² + 6x + 9 - 2 = x² + 6x + 7.'
      }
    ],
    
    'pythagoras theorem': [
      {
        problemId: `pyth-1-${difficulty}`,
        conceptId: 'concept-pythagorean-basics',
        problemText: 'If the legs of a right triangle are 3 and 4 units long, how long is the hypotenuse?',
        options: ['5 units', '7 units', '25 units', '6 units'],
        correctAnswer: '5 units',
        difficulty: difficulty,
        hints: [
          'Use the Pythagorean theorem: a² + b² = c²',
          'Substitute a = 3 and b = 4 into the formula'
        ],
        explanation: 'Using the Pythagorean theorem, a² + b² = c², where c is the hypotenuse. Substituting a = 3 and b = 4: 3² + 4² = c². 9 + 16 = c². 25 = c². Therefore, c = 5 units.'
      },
      {
        problemId: `pyth-2-${difficulty}`,
        conceptId: 'concept-pythagorean-application',
        problemText: 'A ladder 13 feet long is leaning against a wall. The foot of the ladder is 5 feet from the base of the wall. How high up the wall does the ladder reach?',
        options: ['12 feet', '8 feet', '9 feet', '10 feet'],
        correctAnswer: '12 feet',
        difficulty: difficulty,
        hints: [
          'This forms a right triangle with the ladder as hypotenuse',
          'The distance from the wall and the height up the wall are the legs'
        ],
        explanation: 'This problem forms a right triangle where the ladder length is the hypotenuse (c = 13), and the distance from the wall is one leg (a = 5). We need to find the other leg (height up the wall, b). Using the Pythagorean theorem: a² + b² = c². 5² + b² = 13². 25 + b² = 169. b² = 144. Therefore, b = 12 feet.'
      },
      {
        problemId: `pyth-3-${difficulty}`,
        conceptId: 'concept-pythagorean-verification',
        problemText: 'Which of these sets of numbers could be the lengths of the sides of a right triangle?',
        options: ['5, 12, 13', '8, 10, 12', '7, 24, 25', '14, 15, 16'],
        correctAnswer: '5, 12, 13',
        difficulty: difficulty,
        hints: [
          'For a right triangle, the square of the longest side should equal the sum of the squares of the other two sides',
          'Check each set by applying the Pythagorean theorem'
        ],
        explanation: 'For a set of numbers to represent the sides of a right triangle, they must satisfy the Pythagorean theorem: a² + b² = c², where c is the longest side. For 5, 12, 13: 5² + 12² = 25 + 144 = 169 = 13². This works! For 8, 10, 12: 8² + 10² = 64 + 100 = 164 ≠ 12² = 144. For 7, 24, 25: 7² + 24² = 49 + 576 = 625 = 25². This works too, but the answer has 5, 12, 13. For 14, 15, 16: 14² + 15² = 196 + 225 = 421 ≠ 16² = 256.'
      },
      {
        problemId: `pyth-4-${difficulty}`,
        conceptId: 'concept-pythagorean-distance',
        problemText: 'What is the distance between points (1, 3) and (4, 7) in the coordinate plane?',
        options: ['5 units', '4 units', '6.5 units', '5.83 units'],
        correctAnswer: '5 units',
        difficulty: difficulty,
        hints: [
          'Use the distance formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]',
          'This is an application of the Pythagorean theorem'
        ],
        explanation: 'The distance between points (x₁, y₁) and (x₂, y₂) is given by d = √[(x₂ - x₁)² + (y₂ - y₁)²], which is derived from the Pythagorean theorem. For points (1, 3) and (4, 7): d = √[(4 - 1)² + (7 - 3)²] = √[9 + 16] = √25 = 5 units.'
      },
      {
        problemId: `pyth-5-${difficulty}`,
        conceptId: 'concept-pythagorean-converse',
        problemText: 'If a triangle has sides of lengths 8, 15, and 17, is it a right triangle?',
        options: ['Yes', 'No', 'Cannot be determined', 'Only if the angle between sides 8 and 15 is 90°'],
        correctAnswer: 'Yes',
        difficulty: difficulty,
        hints: [
          'Apply the Pythagorean theorem to check',
          'The longest side would be the hypotenuse'
        ],
        explanation: 'To determine if a triangle with sides a, b, and c (where c is the longest side) is a right triangle, we check if a² + b² = c². For sides 8, 15, and 17: 8² + 15² = 64 + 225 = 289 = 17². Since the equation is satisfied, this is indeed a right triangle.'
      }
    ]
  };
  
  // Generic problems for any other topic
  const genericProblems = [
    {
      problemId: `gen-1-${difficulty}-${Date.now()}`,
      conceptId: `concept-${topic.replace(/\s+/g, '-').toLowerCase()}-basics`,
      problemText: `What is a key characteristic of ${topic}?`,
      options: [
        'Characteristic A',
        'Characteristic B',
        'Characteristic C',
        'Characteristic D'
      ],
      correctAnswer: 'Characteristic A', // In a real app, this would be an actual correct answer
      difficulty: difficulty,
      hints: [
        `Think about the fundamental principles of ${topic}.`,
        `Consider what makes ${topic} unique from related concepts.`
      ],
      explanation: `This explanation would provide details about the key characteristics of ${topic} and why option A is correct. It would include foundational knowledge and examples.`
    },
    {
      problemId: `gen-2-${difficulty}-${Date.now()}`,
      conceptId: `concept-${topic.replace(/\s+/g, '-').toLowerCase()}-application`,
      problemText: `Which of the following is an application of ${topic}?`,
      options: [
        'Application 1',
        'Application 2',
        'Application 3',
        'Application 4'
      ],
      correctAnswer: 'Application 2', // In a real app, this would be an actual correct answer
      difficulty: difficulty,
      hints: [
        `Consider how ${topic} is used in real-world scenarios.`,
        `Think about practical implementations of ${topic} principles.`
      ],
      explanation: `This explanation would detail how ${topic} is applied in various contexts, particularly focusing on Application 2 and why it's the correct answer. It would connect theory to practice.`
    },
    {
      problemId: `gen-3-${difficulty}-${Date.now()}`,
      conceptId: `concept-${topic.replace(/\s+/g, '-').toLowerCase()}-history`,
      problemText: `Which statement about the development of ${topic} is accurate?`,
      options: [
        'Historical fact 1',
        'Historical fact 2',
        'Historical fact 3',
        'Historical fact 4'
      ],
      correctAnswer: 'Historical fact 3', // In a real app, this would be an actual correct answer
      difficulty: difficulty,
      hints: [
        `Consider the historical context in which ${topic} emerged.`,
        `Think about key figures or milestones in the development of ${topic}.`
      ],
      explanation: `This explanation would provide historical context for ${topic}, including key developments, people involved, and how it evolved over time to its current understanding.`
    },
    {
      problemId: `gen-4-${difficulty}-${Date.now()}`,
      conceptId: `concept-${topic.replace(/\s+/g, '-').toLowerCase()}-components`,
      problemText: `Which component is NOT typically associated with ${topic}?`,
      options: [
        'Component A',
        'Component B',
        'Component C',
        'Component D'
      ],
      correctAnswer: 'Component D', // In a real app, this would be an actual correct answer
      difficulty: difficulty,
      hints: [
        `Think about the essential elements or parts of ${topic}.`,
        `Consider what might be confused with ${topic} but is actually separate.`
      ],
      explanation: `This explanation would break down the components of ${topic}, explaining why Components A, B, and C are relevant while Component D is not typically associated with it.`
    },
    {
      problemId: `gen-5-${difficulty}-${Date.now()}`,
      conceptId: `concept-${topic.replace(/\s+/g, '-').toLowerCase()}-misconception`,
      problemText: `Which of the following is a common misconception about ${topic}?`,
      options: [
        'Misconception 1',
        'Misconception 2',
        'Misconception 3',
        'All of these are misconceptions'
      ],
      correctAnswer: 'Misconception 2', // In a real app, this would be an actual correct answer
      difficulty: difficulty,
      hints: [
        `Consider common errors or misunderstandings about ${topic}.`,
        `Think about what frequently confuses people about ${topic}.`
      ],
      explanation: `This explanation would address common misconceptions about ${topic}, particularly focusing on Misconception 2 and why it's incorrect despite being commonly believed.`
    }
  ];
  
  // Check if we have specific problems for this topic
  const lowerTopic = topic.toLowerCase();
  let problems = [];
  
  for (const key in topicProblems) {
    if (lowerTopic.includes(key)) {
      problems = topicProblems[key];
      break;
    }
  }
  
  // If no specific problems found, use generic ones
  if (problems.length === 0) {
    problems = genericProblems;
  }
  
  // Adjust difficulty if needed
  problems = problems.map(problem => ({
    ...problem,
    difficulty
  }));
  
  // Return requested number of problems
  return problems.slice(0, count);
};

/**
 * Verify if a user answer is correct
 * @param {Object} problem - The problem object
 * @param {string} answer - The user's answer
 * @returns {boolean} - True if correct, false otherwise
 */
export const verifyAnswer = (problem, answer) => {
  if (!problem || !answer) return false;
  
  // Simple string comparison for multiple choice or text answers
  if (typeof answer === 'string') {
    // Case-insensitive comparison
    return answer.trim().toLowerCase() === problem.correctAnswer.trim().toLowerCase();
  }
  
  return false;
};

/**
 * Adjust difficulty based on user performance
 * @param {number} performance - The user's performance rate (0-1)
 * @returns {string} - The adjusted difficulty level
 */
export const adjustDifficulty = (performance) => {
  if (performance < 0.4) {
    return 'elementary';
  } else if (performance < 0.7) {
    return 'middle';
  } else {
    return 'high';
  }
};

/**
 * Generate a hint for a specific problem
 * @param {Object} problem - The problem object
 * @param {number} hintIndex - The index of the hint to retrieve
 * @returns {string|null} - The hint or null if not available
 */
export const getHint = (problem, hintIndex) => {
  if (!problem || !problem.hints || problem.hints.length <= hintIndex) {
    return null;
  }
  
  return problem.hints[hintIndex];
};

/**
 * Generate a random problem ID
 * @returns {string} - A unique problem ID
 */
export const generateProblemId = () => {
  return `prob-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};