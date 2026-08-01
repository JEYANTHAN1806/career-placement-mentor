import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import SkillGap from './pages/SkillGap';
import Interview from './pages/Interview';
import Roadmap from './pages/Roadmap';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  // Shared Application State
  const [studentData, setStudentData] = useState({
    name: 'Alex Vance',
    role: 'Frontend Developer',
    skills: 'HTML, CSS, JavaScript, React'
  });

  const [skillGapData, setSkillGapData] = useState(null);
  const [interviewSession, setInterviewSession] = useState({ sessionId: null, questions: [] });
  const [interviewAverage, setInterviewAverage] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);

  // Loading & Error states
  const [loadingState, setLoadingState] = useState({
    skillGap: false,
    interview: false,
    roadmap: false
  });
  const [errorState, setErrorState] = useState({
    skillGap: null,
    interview: null,
    roadmap: null
  });

  // Step 1: Skill Gap API Call
  const handleStartAnalysis = async (student) => {
    setLoadingState(prev => ({ ...prev, skillGap: true }));
    setErrorState(prev => ({ ...prev, skillGap: null }));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/skill-gap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          role: student.role,
          currentSkills: student.skills
        })
      });

      const json = await res.json();
      if (json.data) {
        setSkillGapData(json.data);
        setActivePage('skillGap');
      } else {
        throw new Error(json.message || 'Failed to fetch skill gap analysis');
      }
    } catch (err) {
      console.error('[App] SkillGap error:', err);
      setErrorState(prev => ({ ...prev, skillGap: err.message }));
      setActivePage('skillGap');
    } finally {
      setLoadingState(prev => ({ ...prev, skillGap: false }));
    }
  };

  // Step 2: Start Mock Interview API Call
  const handleProceedToInterview = async () => {
    setActivePage('interview');
    setLoadingState(prev => ({ ...prev, interview: true }));
    setErrorState(prev => ({ ...prev, interview: null }));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentData.name,
          role: studentData.role
        })
      });

      const json = await res.json();
      if (json.questions) {
        setInterviewSession({
          sessionId: json.sessionId,
          questions: json.questions
        });
      } else {
        throw new Error('Failed to generate interview questions');
      }
    } catch (err) {
      console.error('[App] Interview start error:', err);
      setErrorState(prev => ({ ...prev, interview: err.message }));
    } finally {
      setLoadingState(prev => ({ ...prev, interview: false }));
    }
  };

  // Step 3: Evaluate Answer API Call
  const handleEvaluateAnswer = async (payload) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/interview/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.error('[App] Evaluate answer error:', err);
      return {
        success: false,
        evaluation: {
          score: 7,
          feedback: 'Answer submitted. (Network fallback active).',
          strengths: ['Valid attempt'],
          improvements: ['Elaborate with code examples']
        }
      };
    }
  };

  // Step 4: Generate Roadmap API Call
  const handleProceedToRoadmap = async (evaluations = [], avgScore = 8) => {
    setActivePage('roadmap');
    setInterviewAverage(avgScore);
    setLoadingState(prev => ({ ...prev, roadmap: true }));
    setErrorState(prev => ({ ...prev, roadmap: null }));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentData.name,
          role: studentData.role,
          skillGapResults: skillGapData,
          interviewSummary: { averageScore: avgScore, evaluations }
        })
      });

      const json = await res.json();
      if (json.data) {
        setRoadmapData(json.data);
      } else {
        throw new Error('Failed to generate career roadmap');
      }
    } catch (err) {
      console.error('[App] Roadmap error:', err);
      setErrorState(prev => ({ ...prev, roadmap: err.message }));
    } finally {
      setLoadingState(prev => ({ ...prev, roadmap: false }));
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        <div className="spider-web-bg"></div>

        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          studentData={studentData}
        />

        <main className="main-content">
          {activePage === 'home' && (
            <Home
              studentData={studentData}
              setStudentData={setStudentData}
              onStartAnalysis={handleStartAnalysis}
              isLoading={loadingState.skillGap}
            />
          )}

          {activePage === 'skillGap' && (
            <SkillGap
              skillGapData={skillGapData}
              studentData={studentData}
              onProceedToInterview={handleProceedToInterview}
              onReanalyze={() => handleStartAnalysis(studentData)}
              isLoading={loadingState.skillGap}
              error={errorState.skillGap}
            />
          )}

          {activePage === 'interview' && (
            <Interview
              questions={interviewSession.questions}
              role={studentData.role}
              sessionId={interviewSession.sessionId}
              onEvaluateAnswer={handleEvaluateAnswer}
              onProceedToRoadmap={handleProceedToRoadmap}
              onRestartInterview={handleProceedToInterview}
              isLoading={loadingState.interview}
              error={errorState.interview}
            />
          )}

          {activePage === 'roadmap' && (
            <Roadmap
              roadmapData={roadmapData}
              studentData={studentData}
              onProceedToDashboard={() => setActivePage('dashboard')}
              onGenerateRoadmap={() => handleProceedToRoadmap([], interviewAverage || 8)}
              isLoading={loadingState.roadmap}
              error={errorState.roadmap}
            />
          )}

          {activePage === 'dashboard' && (
            <Dashboard
              studentData={studentData}
              skillGapData={skillGapData}
              interviewAverage={interviewAverage}
              roadmapData={roadmapData}
              setActivePage={setActivePage}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
