import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Interview({
  questions = [],
  role = 'Software Developer',
  sessionId,
  onEvaluateAnswer,
  onProceedToRoadmap,
  onRestartInterview,
  isLoading,
  error
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  if (isLoading && questions.length === 0) {
    return <LoadingSpinner message={`Generating placement interview questions for ${role}...`} />;
  }

  if (error && questions.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="glass-card spider-card">
          <h2 style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }}>Session Setup Error</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn-primary" onClick={onRestartInterview}>🔄 Retry Interview</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx] || "Explain your technical problem-solving methodology.";

  // Quick pre-filled sample answers for instant demo testing
  const sampleAnswers = [
    "The Virtual DOM in React is a lightweight in-memory representation of the real DOM. React compares the Virtual DOM with the previous snapshot using a diffing algorithm (reconciliation) and updates only the changed elements in the real DOM, optimizing rendering performance.",
    "During my last project, I encountered a race condition with asynchronous API calls fetching outdated user state. I resolved it by implementing AbortController to cancel pending requests on component unmount and using React state cleanup functions.",
    "To optimize slow rendering, I first profile components using React DevTools, implement React.memo on heavy child components, lazy-load non-critical routes with React.lazy, and avoid inline arrow functions inside map loops.",
    "Context API is ideal for low-frequency global updates like themes or user authentication. For high-frequency state updates or complex state logic, external libraries like Zustand or Redux are preferred because they prevent unnecessary re-renders of the whole component tree.",
    "During code review, a senior developer pointed out missing error handling in my backend endpoint. I welcomed the feedback, asked clarifying questions, refactored the code with structured try-catch wrappers, and added unit tests."
  ];

  const handleFillSample = () => {
    setUserAnswer(sampleAnswers[currentIdx % sampleAnswers.length]);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    setIsSubmitting(true);
    setCurrentFeedback(null);

    const result = await onEvaluateAnswer({
      sessionId,
      questionIndex: currentIdx,
      question: currentQuestion,
      answer: userAnswer,
      role
    });

    setIsSubmitting(false);

    if (result && result.evaluation) {
      const newEval = {
        questionIndex: currentIdx,
        question: currentQuestion,
        answer: userAnswer,
        ...result.evaluation
      };
      
      const updatedEvals = [...evaluations, newEval];
      setEvaluations(updatedEvals);
      setCurrentFeedback(result.evaluation);
    }
  };

  const handleNextQuestion = () => {
    setCurrentFeedback(null);
    setUserAnswer('');
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Calculate Running Average Score
  const currentScores = evaluations.map(e => e.score);
  const averageScore = currentScores.length > 0
    ? (currentScores.reduce((a, b) => a + b, 0) / currentScores.length).toFixed(1)
    : 0;

  // Render Completed Summary View
  if (isCompleted) {
    const totalAvg = parseFloat(averageScore);
    const allStrengths = Array.from(new Set(evaluations.flatMap(e => e.strengths || []))).slice(0, 4);
    const allImprovements = Array.from(new Set(evaluations.flatMap(e => e.improvements || []))).slice(0, 4);

    return (
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div className="page-header">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
          <h1 className="page-title">Interview Completed!</h1>
          <p className="page-subtitle">Here is your comprehensive AI placement performance scorecard.</p>
        </div>

        <div className="glass-card spider-card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Overall Performance Average
          </div>
          <div style={{ fontSize: '4.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: totalAvg >= 7.5 ? 'var(--status-have)' : 'var(--secondary-accent)', margin: '0.5rem 0' }}>
            {totalAvg} <span style={{ fontSize: '1.8rem', color: 'var(--text-muted)' }}>/ 10</span>
          </div>
          <p style={{ color: 'var(--text-main)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            {totalAvg >= 8
              ? "Outstanding performance! You demonstrated technical mastery and structured communication."
              : totalAvg >= 6
              ? "Good foundation! Strengthening edge-case explanations will elevate your offer rate."
              : "Keep practicing! Review key technical fundamentals before upcoming placement rounds."}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left', marginTop: '2rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <h4 style={{ color: 'var(--status-have)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🌟</span> Key Demonstrated Strengths
              </h4>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                {allStrengths.length > 0 ? allStrengths.map((s, i) => <li key={i} style={{ marginBottom: '0.35rem' }}>{s}</li>) : <li>Clear technical communication</li>}
              </ul>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h4 style={{ color: 'var(--status-missing)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🎯</span> Recommended Growth Areas
              </h4>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                {allImprovements.length > 0 ? allImprovements.map((imp, i) => <li key={i} style={{ marginBottom: '0.35rem' }}>{imp}</li>) : <li>Add more real-world project metrics</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Q&A Breakdown */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Detailed Responses Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {evaluations.map((item, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary-accent)' }}>Q{idx + 1} of 5</span>
                  <span style={{ fontWeight: 800, color: item.score >= 8 ? 'var(--status-have)' : 'var(--status-partial)' }}>
                    Score: {item.score}/10
                  </span>
                </div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{item.question}</div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  "{item.answer}"
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  💬 <strong>Feedback:</strong> {item.feedback}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn-primary" onClick={() => onProceedToRoadmap(evaluations, averageScore)}>
            🗺️ Generate My Custom Career Roadmap →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Header bar with running average score */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mock Placement Interview • {role}
          </span>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Question {currentIdx + 1} of {questions.length}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Running Average Score</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: averageScore >= 7 ? 'var(--status-have)' : 'var(--secondary-accent)' }}>
              {averageScore > 0 ? `${averageScore} / 10` : '—'}
            </div>
          </div>

          <div style={{ width: '120px' }}>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-card spider-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          <span>🤖</span> AI Interviewer Prompt
        </div>

        <h2 style={{ fontSize: '1.35rem', lineHeight: 1.4, marginBottom: '1.5rem' }}>
          {currentQuestion}
        </h2>

        {/* Answer Form */}
        {!currentFeedback ? (
          <div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label">Your Response</label>
                <button
                  type="button"
                  onClick={handleFillSample}
                  style={{ background: 'transparent', border: 'none', color: 'var(--secondary-accent)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ⚡ Auto-fill sample answer for fast demo
                </button>
              </div>
              <textarea
                className="form-textarea"
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer clearly. Include key concepts, frameworks, and real-world examples..."
                disabled={isSubmitting}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'right', marginTop: '0.25rem' }}>
                {userAnswer.length} characters
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || !userAnswer.trim()}
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Evaluating Response with Claude AI...' : 'Submit Response for AI Scoring'}
            </button>
          </div>
        ) : (
          /* Feedback Card */
          <div style={{ background: 'rgba(10, 12, 22, 0.8)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-md)', padding: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🎯</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>AI Score & Feedback</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: currentFeedback.score >= 8 ? 'var(--status-have)' : 'var(--status-partial)' }}>
                {currentFeedback.score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 10</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              {currentFeedback.feedback}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ color: 'var(--status-have)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  What You Did Well:
                </div>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {currentFeedback.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div style={{ color: 'var(--status-missing)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Areas to Polish:
                </div>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {currentFeedback.improvements?.map((imp, i) => <li key={i}>{imp}</li>)}
                </ul>
              </div>
            </div>

            <button className="btn-cyan" onClick={handleNextQuestion} style={{ width: '100%' }}>
              {currentIdx + 1 < questions.length ? `Proceed to Question ${currentIdx + 2} →` : 'Complete Interview & View Summary →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
