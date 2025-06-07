// src/services/openai.js
// Service for interacting with OpenAI API

/**
 * Generates an explanation for a given topic using AI
 * @param {string} query - The question to be explained
 * @param {string} level - The educational level (elementary, middle, high, college)
 * @returns {Promise<string>} - The generated explanation
 */
export const generateExplanation = async (query, level = 'middle') => {
  // In a real implementation, this would make an API call to OpenAI
  console.log(`Generating explanation for: "${query}" at ${level} level`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Demo implementation with pre-defined responses for common topics
  const topics = {
    'photosynthesis': `
# Photosynthesis

Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy, usually from the sun, into chemical energy in the form of glucose or other sugars.

## The Basic Process

1. **Light Absorption**: Plants capture sunlight using chlorophyll in their leaves.
2. **Water Conversion**: Water (H₂O) is taken from the soil through the roots.
3. **Carbon Dioxide Utilization**: Carbon dioxide (CO₂) is absorbed from the air through tiny pores called stomata.
4. **Oxygen Release**: Oxygen (O₂) is released as a byproduct.
5. **Sugar Production**: Glucose (C₆H₁₂O₆) is created and used as energy.

The simplified chemical equation is:
6 CO₂ + 6 H₂O + light energy → C₆H₁₂O₆ + 6 O₂

${level === 'elementary' ? '' : `
## Two Main Stages

1. **Light-dependent reactions** occur in the thylakoid membrane and convert light energy into ATP and NADPH.
2. **Light-independent reactions** (Calvin cycle) occur in the stroma and use ATP and NADPH to convert CO₂ into glucose.
`}

${level === 'high' || level === 'college' ? `
## Factors Affecting Photosynthesis

- Light intensity
- Carbon dioxide concentration
- Temperature
- Water availability
- Chlorophyll concentration

Plants have evolved various adaptations to maximize photosynthesis efficiency in different environments, such as C4 and CAM pathways in hot, dry environments.
` : ''}

Photosynthesis is crucial for life on Earth as it produces oxygen and serves as the base of most food chains.
    `,
    
    'quadratic equations': `
# Quadratic Equations

A quadratic equation is a second-degree polynomial equation in a single variable x:

ax² + bx + c = 0

where a, b, and c are constants and a ≠ 0.

## Solving Quadratic Equations

${level === 'elementary' ? 'Quadratic equations can be solved by finding what values of x make the equation equal to zero.' : ''}

${level !== 'elementary' ? `
There are several methods to solve quadratic equations:

### The Quadratic Formula
x = (-b ± √(b² - 4ac)) / 2a

This formula gives all solutions to a quadratic equation.
` : ''}

${level === 'middle' ? `
### Example
To solve x² + 5x + 6 = 0:

a = 1, b = 5, c = 6

Using the quadratic formula:
x = (-5 ± √(5² - 4×1×6)) / 2×1
x = (-5 ± √(25 - 24)) / 2
x = (-5 ± √1) / 2
x = (-5 ± 1) / 2

So x = -3 or x = -2
` : ''}

${level === 'high' || level === 'college' ? `
### Completing the Square
1. Move the constant term to the right side of the equation
2. If a ≠ 1, divide all terms by a
3. Add the square of half the coefficient of x to both sides
4. Express the left side as a perfect square trinomial
5. Take the square root of both sides
6. Solve for x

### Using the Discriminant
The discriminant b² - 4ac tells us about the nature of the roots:
- If b² - 4ac > 0: Two distinct real roots
- If b² - 4ac = 0: One repeated real root
- If b² - 4ac < 0: Two complex conjugate roots
` : ''}

${level === 'college' ? `
## Applications

Quadratic equations are used in:
- Physics for projectile motion
- Economics for optimization problems
- Engineering for control systems
- Computer graphics for modeling parabolic shapes
- Finance for calculating compound interest
` : ''}

Quadratic equations are fundamental in algebra and have numerous practical applications.
    `,

    'pythagorean theorem': `
# The Pythagorean Theorem

The Pythagorean Theorem states that in a right triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides.

If we call the lengths of the two legs a and b, and the length of the hypotenuse c, then:

a² + b² = c²

${level === 'elementary' ? `
## Simple Example

If one leg of a right triangle is 3 units long, and the other is 4 units long, we can find the hypotenuse:

3² + 4² = c²
9 + 16 = c²
25 = c²
c = 5

So the hypotenuse is 5 units long.
` : ''}

${level === 'middle' || level === 'high' || level === 'college' ? `
## Historical Context

The theorem is named after the ancient Greek mathematician Pythagoras (570-495 BCE), although it was known to other civilizations before the Greeks. Evidence suggests that the Babylonians and Egyptians knew about the relationship, and it was independently discovered in ancient China and India.
` : ''}

${level === 'high' || level === 'college' ? `
## Proof

A simple proof of the Pythagorean theorem involves creating a square with side length a + b:

1. Form a square with side length a + b
2. Inside this square, construct four identical right triangles with legs a and b
3. The remaining area is a square with side length c
4. The area of the large square can be calculated two ways:
   - (a + b)² = a² + 2ab + b²
   - c² + 4(½ab) = c² + 2ab
5. Equating these: a² + 2ab + b² = c² + 2ab
6. Simplifying: a² + b² = c²
` : ''}

${level === 'college' ? `
## Generalizations

The Pythagorean theorem extends to higher dimensions:
- In 3D space, if a, b, and c are the sides of a rectangular box, and d is the space diagonal, then a² + b² + c² = d²
- The Law of Cosines generalizes the theorem to all triangles: c² = a² + b² - 2ab·cos(C)
- For non-Euclidean geometries, different relationships apply

The theorem has over 350 known proofs, making it one of the most proved mathematical theorems.
` : ''}

The Pythagorean Theorem is fundamental in mathematics and has numerous applications in architecture, construction, navigation, and physics.
    `,
  };
  
  // Check if we have a pre-defined response for this query
  const matchingTopic = Object.keys(topics).find(topic => 
    query.toLowerCase().includes(topic.toLowerCase())
  );
  
  if (matchingTopic) {
    return topics[matchingTopic];
  }
  
  // For any other query, generate a generic explanation based on the level
  const levelAdjusted = {
    elementary: 'a 3rd grade student',
    middle: 'an 8th grade student',
    high: 'a high school student',
    college: 'a college student'
  }[level] || 'a middle school student';
  
  return `
# ${query}

This is an explanation about "${query}" tailored for ${levelAdjusted}. 

In a real implementation, this would be an AI-generated explanation that covers:

## Key Concepts
- Definition and importance
- Main principles and components
- How it works

## Examples
- Practical applications
- Simple demonstrations
- Real-world connections

## Additional Resources
- Related topics to explore
- Visual aids that would help understanding

This explanation would be adjusted based on the educational level (${level}) to ensure appropriate depth and complexity.

Since this is a demo version, please try searching for specific topics like "photosynthesis", "quadratic equations", or "Pythagorean theorem" to see more detailed sample explanations.
  `;
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
export const isUsingDemoMode = () => true;