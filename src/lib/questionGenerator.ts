// Curated list of insightful questions to ask companies at booths
export const boothQuestions = [
    // Company Culture
    "What's your company culture like?",
    "How would you describe your team dynamics?",
    "What do you value most in your employees?",
    "How do you support work-life balance?",
    "What makes your company unique?",

    // Technical
    "What tech stack do you use?",
    "What's your approach to code quality and testing?",
    "How do you handle technical debt?",
    "What development methodologies do you follow?",
    "What's your deployment process like?",

    // Career Growth
    "What does career progression look like here?",
    "Do you offer mentorship programs?",
    "What learning and development opportunities are available?",
    "How do you support professional growth?",
    "What's the typical career path for this role?",

    // Work Environment
    "Do you offer remote work options?",
    "What's your office setup like?",
    "How many people are on the team?",
    "What's a typical day like in this role?",
    "How do teams collaborate?",

    // Interview & Hiring
    "What's your interview process?",
    "What are you looking for in candidates?",
    "What's the timeline for hiring?",
    "When do you expect to make a decision?",
    "What are the next steps?",

    // Benefits & Compensation
    "What benefits do you offer?",
    "Do you provide equity/stock options?",
    "What's your PTO policy?",
    "Do you offer relocation assistance?",
    "What's the salary range for this position?",

    // Projects & Impact
    "What projects would I work on?",
    "What's the biggest challenge your team faces?",
    "How do you measure success?",
    "What impact can I make in the first 6 months?",
    "What are your company's goals for this year?"
];

export function getRandomQuestion(): string {
    return boothQuestions[Math.floor(Math.random() * boothQuestions.length)];
}

export function getRandomQuestions(count: number = 3): string[] {
    const shuffled = [...boothQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
