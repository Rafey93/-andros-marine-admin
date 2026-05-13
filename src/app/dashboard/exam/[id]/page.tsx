'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { exams } from '@/lib/mock-data';
import { useProctoring } from '@/hooks/useProctoring';
import { useExamTimer } from '@/hooks/useExamTimer';
import ExamProctoringWidget from '@/components/proctoring/ExamProctor';
import { cn } from '@/lib/utils';

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const exam = exams.find(e => e.id === examId);
  const [sessionId] = useState(() => String(Date.now()));

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [tabWarning, setTabWarning] = useState(false);

  const { videoRef, flags, isRecording, cameraError, startRecording, stopRecording, snapshotCount } =
    useProctoring(sessionId, examId);

  const handleSubmit = async () => {
    if (!exam) return;
    const correct = exam.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const pct = Math.round((correct / exam.questions.length) * 100);
    const session = await stopRecording({ examTitle: exam.title, score: pct });
    setScore(pct);
    if (session) {
      try {
        const existing = JSON.parse(localStorage.getItem('mas_exam_sessions') || '[]');
        const updated = existing.map((s: { id: string }) => s.id === session.id ? session : s);
        localStorage.setItem('mas_exam_sessions', JSON.stringify(updated));
      } catch {}
    }
    setSubmitted(true);
  };

  const timer = useExamTimer(exam?.duration ?? 30, handleSubmit);

  useEffect(() => {
    const handleVis = () => { if (document.hidden && started) setTabWarning(true); };
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, [started]);

  useEffect(() => {
    if (tabWarning) {
      const t = setTimeout(() => setTabWarning(false), 4000);
      return () => clearTimeout(t);
    }
  }, [tabWarning]);

  if (!exam) return <div className="p-8 text-center text-gray-500">Exam not found.</div>;

  if (!started) {
    return (
      <div className="max-w-lg mx-auto mt-12 bg-white p-8 text-center">
        <div className="w-16 h-16 bg-navy/10 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-navy" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">{exam.title}</h1>
        <p className="text-gray-500 text-sm mb-1">{exam.questions.length} questions — {exam.duration} minutes</p>
        <div className="my-6 text-left bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 space-y-1">
          <p className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Proctoring is active</p>
          <p>Your webcam will be recorded and snapshots captured every 30 seconds.</p>
          <p>Tab switching will be flagged and reviewed by administrators.</p>
        </div>
        <button
          onClick={async () => { await startRecording(); timer.start(); setStarted(true); }}
          className="w-full py-3 bg-navy text-white font-semibold uppercase tracking-wider hover:bg-navy-dark transition-colors"
        >
          Start Exam
        </button>
      </div>
    );
  }

  if (submitted) {
    const passed = score >= 70;
    return (
      <div className="max-w-lg mx-auto mt-12 bg-white p-8 text-center">
        <div className={cn('w-16 h-16 flex items-center justify-center mx-auto mb-4', passed ? 'bg-green-50' : 'bg-red-50')}>
          <CheckCircle className={cn('w-8 h-8', passed ? 'text-green-600' : 'text-red-500')} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{score}%</h2>
        <p className={cn('text-sm font-semibold mb-4', passed ? 'text-green-600' : 'text-red-500')}>
          {passed ? 'Passed' : 'Failed — minimum 70% required'}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
          <div className="bg-gray-50 p-3">
            <p className="font-bold text-gray-800">{exam.questions.filter(q => answers[q.id] === q.correctIndex).length}</p>
            <p className="text-xs text-gray-400">Correct</p>
          </div>
          <div className="bg-gray-50 p-3">
            <p className="font-bold text-gray-800">{snapshotCount}</p>
            <p className="text-xs text-gray-400">Snapshots</p>
          </div>
          <div className="bg-gray-50 p-3">
            <p className={cn('font-bold', flags.length > 0 ? 'text-red-500' : 'text-gray-800')}>{flags.length}</p>
            <p className="text-xs text-gray-400">Flags</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/dashboard/proctoring')}
          className="w-full py-2.5 border border-navy text-navy font-semibold uppercase tracking-wider text-sm hover:bg-navy hover:text-white transition-colors"
        >
          View Proctoring Report
        </button>
      </div>
    );
  }

  const question = exam.questions[currentQ];
  const progress = ((currentQ + 1) / exam.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-24">
      {tabWarning && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-lg">
          <AlertTriangle className="w-4 h-4" />
          Tab switch detected — this has been flagged.
        </div>
      )}

      {/* Progress bar + timer */}
      <div className="bg-white p-4 flex items-center gap-4">
        <div className="flex-1 h-2 bg-gray-100">
          <div className="h-full bg-teal transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">Q {currentQ + 1} of {exam.questions.length}</span>
        <div className={cn('flex items-center gap-1.5 font-mono font-bold text-sm', timer.isWarning ? 'text-red-500' : 'text-gray-700')}>
          <Clock className="w-4 h-4" />
          {timer.formatted}
        </div>
      </div>

      <div>
        <h1 className="text-lg font-bold text-gray-800">{exam.title}</h1>
        <p className="text-sm text-gray-400">{cameraError ? 'Camera unavailable — session flagged' : 'Proctoring active'}</p>
      </div>

      {/* Question card */}
      <div className="bg-white p-6">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Question {currentQ + 1}</p>
        <p className="text-base font-semibold text-gray-800 mb-5">{question.question}</p>
        <div className="space-y-2.5">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswers(prev => ({ ...prev, [question.id]: i }))}
              className={cn(
                'w-full text-left px-4 py-3 border text-sm transition-colors',
                answers[question.id] === i
                  ? 'border-teal bg-teal/5 text-teal font-semibold'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <span className="font-semibold mr-2 text-gray-400">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          disabled={currentQ === 0}
          onClick={() => setCurrentQ(q => q - 1)}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {currentQ < exam.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQ(q => q + 1)}
            className="flex items-center gap-1 px-4 py-2 bg-navy text-white text-sm font-semibold hover:bg-navy-dark transition-colors ml-auto"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-teal text-white text-sm font-semibold uppercase tracking-wider hover:bg-teal-dark transition-colors ml-auto"
          >
            Submit Exam
          </button>
        )}
      </div>

      <ExamProctoringWidget
        videoRef={videoRef}
        isRecording={isRecording}
        snapshotCount={snapshotCount}
        flagCount={flags.length}
        cameraError={cameraError}
      />
    </div>
  );
}
