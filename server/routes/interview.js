import express from 'express';
import db from '../db/db.js';
import { callClaude } from '../services/claudeClient.js';
import { getMockInterviewQuestions, getMockAnswerEvaluation } from '../services/mockData.js';

const router = express.Router();

// Generate 5 interview questions for a role
router.post('/start', async (req, res) => {
  try {
    const { studentName = 'Student', role = 'Software Developer' } = req.body;
    const mockQuestions = getMockInterviewQuestions(role);

    const systemPrompt = `You are a Technical Lead & Campus Placement Interviewer for top technology companies.
Generate exactly 5 interview questions tailored specifically for a student interviewing for the role of ${role}.
Include a balanced mix of technical domain questions (3) and behavioral/scenario questions (2).

OUTPUT SCHEMA:
{
  "questions": [
    "Question 1 string",
    "Question 2 string",
    "Question 3 string",
    "Question 4 string",
    "Question 5 string"
  ]
}`;

    const userPrompt = `Target Role: ${role}
Generate 5 high-yield placement interview questions.`;

    const response = await callClaude({
      systemPrompt,
      userPrompt,
      fallbackData: { questions: mockQuestions }
    });

    const questions = Array.isArray(response.questions) && response.questions.length >= 5
      ? response.questions.slice(0, 5)
      : mockQuestions;

    let sessionId = Date.now();
    try {
      const stmt = db.prepare(`
        INSERT INTO interview_sessions (student_name, role, questions_json)
        VALUES (?, ?, ?)
      `);
      const info = stmt.run(studentName, role, JSON.stringify(questions));
      sessionId = info.lastInsertRowid;
    } catch (dbErr) {
      console.warn('[Interview DB Warning] Failed to log session to SQLite:', dbErr.message);
    }

    res.json({
      success: true,
      sessionId,
      studentName,
      role,
      questions
    });
  } catch (error) {
    console.error('[Interview Start API Error]:', error);
    const mockQuestions = getMockInterviewQuestions(req.body?.role);
    res.status(200).json({
      success: true,
      sessionId: Date.now(),
      studentName: req.body?.studentName || 'Student',
      role: req.body?.role || 'Software Developer',
      questions: mockQuestions,
      notice: 'Served fallback mock questions due to server error.'
    });
  }
});

// Evaluate a student's answer to a question
router.post('/answer', async (req, res) => {
  try {
    const { sessionId, questionIndex, question, answer, role = 'Software Developer' } = req.body;
    const fallbackEval = getMockAnswerEvaluation(question, answer);

    const systemPrompt = `You are an expert interviewer evaluating a student candidate for the role of ${role}.
Evaluate the candidate's answer to the given question.
Provide:
1. An integer score from 1 to 10.
2. Constructive, encouraging feedback (2-3 sentences).
3. A list of 2 key strengths demonstrated in the answer.
4. A list of 2 key areas for improvement.

OUTPUT SCHEMA:
{
  "score": number,
  "feedback": "string",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"]
}`;

    const userPrompt = `Role: ${role}
Question: ${question}
Candidate's Answer: ${answer || '(No answer provided)'}`;

    const result = await callClaude({
      systemPrompt,
      userPrompt,
      fallbackData: fallbackEval
    });

    const evalData = {
      score: typeof result.score === 'number' ? Math.min(Math.max(result.score, 1), 10) : fallbackEval.score,
      feedback: result.feedback || fallbackEval.feedback,
      strengths: Array.isArray(result.strengths) ? result.strengths : fallbackEval.strengths,
      improvements: Array.isArray(result.improvements) ? result.improvements : fallbackEval.improvements
    };

    // Save answer & evaluation to SQLite
    if (sessionId) {
      try {
        db.prepare(`
          INSERT INTO interview_answers (session_id, question_index, question, answer, score, feedback, strengths, improvements)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          sessionId,
          questionIndex ?? 0,
          question || '',
          answer || '',
          evalData.score,
          evalData.feedback,
          JSON.stringify(evalData.strengths),
          JSON.stringify(evalData.improvements)
        );
      } catch (dbErr) {
        console.warn('[Interview Answer DB Warning]:', dbErr.message);
      }
    }

    res.json({
      success: true,
      evaluation: evalData
    });
  } catch (error) {
    console.error('[Interview Answer API Error]:', error);
    const fallbackEval = getMockAnswerEvaluation(req.body?.question, req.body?.answer);
    res.status(200).json({
      success: true,
      evaluation: fallbackEval,
      notice: 'Served fallback evaluation due to server error.'
    });
  }
});

export default router;
