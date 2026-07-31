import express from 'express';
import db from '../db/db.js';
import { callClaude } from '../services/claudeClient.js';
import { getMockRoadmap } from '../services/mockData.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { studentName = 'Student', role = 'Software Developer', skillGapResults = {}, interviewSummary = {} } = req.body;
    const fallback = getMockRoadmap(role, skillGapResults, interviewSummary);

    const systemPrompt = `You are a Senior Placement Director & Career Strategist.
Create a high-impact, personalized 6-week career preparation roadmap for a college student targeting the role of ${role}.
Base the roadmap on their skill gap analysis and mock interview performance.
Provide 3 distinct chronological phases (Weeks 1-2, Weeks 3-4, Weeks 5-6).
For each phase, specify topics to master, a concrete portfolio project idea, and recommended learning resources.

OUTPUT SCHEMA:
{
  "role": "string",
  "timelineWeeks": number,
  "summary": "string",
  "milestones": [
    {
      "phase": "string",
      "duration": "string",
      "topics": ["string", "string"],
      "projectIdea": "string",
      "resources": ["string", "string"],
      "status": "in-progress|upcoming"
    }
  ]
}`;

    const userPrompt = `Student Name: ${studentName}
Target Role: ${role}
Skill Gap Details: ${JSON.stringify(skillGapResults)}
Interview Summary: ${JSON.stringify(interviewSummary)}`;

    const result = await callClaude({
      systemPrompt,
      userPrompt,
      fallbackData: fallback
    });

    const finalRoadmap = result && Array.isArray(result.milestones) ? result : fallback;

    // Save roadmap to database
    try {
      db.prepare(`
        INSERT INTO roadmaps (student_name, role, roadmap_json)
        VALUES (?, ?, ?)
      `).run(studentName, role, JSON.stringify(finalRoadmap));
    } catch (dbErr) {
      console.warn('[Roadmap DB Warning]:', dbErr.message);
    }

    res.json({
      success: true,
      studentName,
      data: finalRoadmap
    });
  } catch (error) {
    console.error('[Roadmap API Error]:', error);
    const fallback = getMockRoadmap(req.body?.role);
    res.status(200).json({
      success: true,
      studentName: req.body?.studentName || 'Student',
      data: fallback,
      notice: 'Served fallback roadmap due to server error.'
    });
  }
});

export default router;
