import express from 'express';
import db from '../db/db.js';
import { callClaude } from '../services/claudeClient.js';
import { getMockSkillGap } from '../services/mockData.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { studentName = 'Student', role = 'Software Developer', currentSkills = '' } = req.body;

    const skillsArray = Array.isArray(currentSkills)
      ? currentSkills
      : currentSkills.split(',').map(s => s.trim()).filter(Boolean);

    const fallback = getMockSkillGap(role, skillsArray);

    const systemPrompt = `You are an elite Tech Career & Placement Mentor. Analyze the target role and current skills of a college student.
Identify 6 to 10 required skills for the target role.
For each skill, determine if the student's current skills match it ('have'), partially match it ('partial'), or if it's completely missing ('missing').
Assign a priority ('high', 'medium', 'low') to each required skill.
Calculate an overall match percentage (0 to 100). Provide a brief 1-2 sentence executive summary.

OUTPUT SCHEMA:
{
  "role": "string",
  "matchPercentage": number,
  "summary": "string",
  "requiredSkills": [
    { "skill": "string", "status": "have|partial|missing", "priority": "high|medium|low" }
  ]
}`;

    const userPrompt = `Target Role: ${role}
Current Skills: ${skillsArray.join(', ') || 'None specified'}`;

    const result = await callClaude({
      systemPrompt,
      userPrompt,
      fallbackData: fallback
    });

    // Ensure database save
    try {
      db.prepare(`
        INSERT INTO students (student_name, role, current_skills)
        VALUES (?, ?, ?)
      `).run(studentName, role, JSON.stringify(skillsArray));

      db.prepare(`
        INSERT INTO skill_gap_reports (student_name, role, results_json)
        VALUES (?, ?, ?)
      `).run(studentName, role, JSON.stringify(result));
    } catch (dbErr) {
      console.warn('[SkillGap DB Warning] Failed to log to SQLite:', dbErr.message);
    }

    res.json({
      success: true,
      studentName,
      data: result
    });
  } catch (error) {
    console.error('[SkillGap API Error]:', error);
    const fallback = getMockSkillGap(req.body?.role, req.body?.currentSkills);
    res.status(200).json({
      success: true,
      studentName: req.body?.studentName || 'Student',
      data: fallback,
      notice: 'Served fallback mock data due to server error.'
    });
  }
});

export default router;
