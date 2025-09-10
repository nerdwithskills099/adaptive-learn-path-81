export const mockStudents = {
  sanga: {
    name: "Sanga Kumar",
    grade: "Grade 8",
    assessmentDate: "March 15, 2024",
    overallScore: 67,
    skillBreakdown: [
      { skill: "Listening", score: 85, status: "excellent" as const, improvement: 12 },
      { skill: "Grasping", score: 72, status: "good" as const, improvement: 8 },
      { skill: "Retention", score: 68, status: "needs-improvement" as const, improvement: -5 },
      { skill: "Application", score: 45, status: "critical" as const, improvement: -12 },
    ],
    subjectPerformance: [
      {
        subject: "Mathematics",
        score: 78,
        trend: "up" as const,
        recommendations: [
          "Focus on word problems and real-world applications",
          "Practice mental math daily for 10 minutes",
          "Review algebraic concepts with visual aids"
        ]
      },
      {
        subject: "Science",
        score: 65,
        trend: "stable" as const,
        recommendations: [
          "Strengthen understanding of scientific method",
          "Use hands-on experiments to improve retention",
          "Create concept maps for complex topics"
        ]
      },
      {
        subject: "English",
        score: 82,
        trend: "up" as const,
        recommendations: [
          "Continue reading diverse literature",
          "Practice creative writing exercises",
          "Work on advanced grammar concepts"
        ]
      }
    ],
    strengths: [
      "Excellent listening skills and ability to follow complex instructions",
      "Strong foundational knowledge in English language arts",
      "Good at identifying patterns and relationships in mathematics",
      "Shows enthusiasm for collaborative learning activities"
    ],
    weaknesses: [
      "Struggles with applying mathematical concepts to real-world problems",
      "Difficulty retaining information from previous lessons",
      "Needs improvement in critical thinking and analysis",
      "Tends to rush through problems without careful consideration"
    ]
  },
  shyam: {
    name: "Shyam Patel",
    grade: "Grade 8",
    assessmentDate: "March 15, 2024",
    overallScore: 74,
    skillBreakdown: [
      { skill: "Listening", score: 68, status: "needs-improvement" as const, improvement: -3 },
      { skill: "Grasping", score: 85, status: "excellent" as const, improvement: 15 },
      { skill: "Retention", score: 78, status: "good" as const, improvement: 10 },
      { skill: "Application", score: 65, status: "good" as const, improvement: 8 },
    ],
    subjectPerformance: [
      {
        subject: "Mathematics",
        score: 88,
        trend: "up" as const,
        recommendations: [
          "Challenge with advanced problem-solving exercises",
          "Explore mathematical competitions and olympiads",
          "Focus on explaining mathematical reasoning verbally"
        ]
      },
      {
        subject: "Science",
        score: 82,
        trend: "up" as const,
        recommendations: [
          "Engage in more complex scientific inquiries",
          "Develop hypothesis testing skills",
          "Practice scientific communication and presentations"
        ]
      },
      {
        subject: "English",
        score: 52,
        trend: "down" as const,
        recommendations: [
          "Improve listening comprehension through audio materials",
          "Practice active listening strategies in discussions",
          "Work on following multi-step verbal instructions"
        ]
      }
    ],
    strengths: [
      "Exceptional ability to grasp complex mathematical concepts quickly",
      "Strong logical reasoning and problem-solving skills",
      "Good retention of information once understood",
      "Excellent at working independently on challenging tasks"
    ],
    weaknesses: [
      "Struggles with listening comprehension in noisy environments",
      "Difficulty following verbal instructions without visual aids",
      "Needs improvement in English language communication",
      "Sometimes impatient with step-by-step explanations"
    ]
  }
};

export const mockQuestions = [
  {
    id: "q1",
    text: "What is the sum of the interior angles of a triangle?",
    options: ["90 degrees", "180 degrees", "270 degrees", "360 degrees"],
    correctAnswer: 1,
    difficulty: "easy" as const,
    skill: "grasping" as const,
  },
  {
    id: "q2",
    text: "If a car travels 60 miles in 2 hours, what is its average speed in miles per hour?",
    options: ["20 mph", "25 mph", "30 mph", "35 mph"],
    correctAnswer: 2,
    difficulty: "medium" as const,
    skill: "application" as const,
  },
  {
    id: "q3",
    text: "Which of the following is the chemical formula for water?",
    options: ["CO2", "H2O", "NaCl", "O2"],
    correctAnswer: 1,
    difficulty: "easy" as const,
    skill: "retention" as const,
  },
  {
    id: "q4",
    text: "In the sentence 'The quick brown fox jumps over the lazy dog,' what part of speech is 'quick'?",
    options: ["Noun", "Verb", "Adjective", "Adverb"],
    correctAnswer: 2,
    difficulty: "medium" as const,
    skill: "grasping" as const,
  },
  {
    id: "q5",
    text: "If you have a rectangular garden that is 8 meters long and 6 meters wide, and you want to put a fence around it, how much fencing do you need?",
    options: ["14 meters", "28 meters", "48 meters", "56 meters"],
    correctAnswer: 1,
    difficulty: "hard" as const,
    skill: "application" as const,
  }
];