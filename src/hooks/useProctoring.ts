'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import type { Snapshot, Flag, ExamSession } from '@/types';

interface UseProctoringReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  snapshots: Snapshot[];
  flags: Flag[];
  isRecording: boolean;
  cameraError: string | null;
  startRecording: () => Promise<void>;
  stopRecording: (updates?: Partial<ExamSession>) => Promise<ExamSession | null>;
  snapshotCount: number;
}

export function useProctoring(sessionId: string, examId: string): UseProctoringReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Tab-switch detection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isRecording) {
        const flag: Flag = { type: 'tab_switch', timestamp: Date.now() };
        setFlags(prev => [...prev, flag]);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isRecording]);

  const captureSnapshot = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
    const snapshot: Snapshot = { timestamp: Date.now(), dataUrl };
    setSnapshots(prev => {
      const updated = [...prev, snapshot];
      // Persist to localStorage
      try {
        localStorage.setItem(`mas_snapshots_${sessionId}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [sessionId]);

  const startRecording = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      // MediaRecorder for video
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(1000);
      recorderRef.current = recorder;

      startTimeRef.current = Date.now();
      setIsRecording(true);

      // Snapshot every 30 seconds
      intervalRef.current = setInterval(captureSnapshot, 30_000);

      // First snapshot after 3s
      setTimeout(captureSnapshot, 3_000);

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Camera access denied';
      setCameraError(msg);
      setFlags(prev => [...prev, { type: 'camera_blocked', timestamp: Date.now() }]);
    }
  }, [captureSnapshot]);

  const stopRecording = useCallback(async (updates: Partial<ExamSession> = {}): Promise<ExamSession | null> => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }

    setIsRecording(false);

    const session: ExamSession = {
      id: sessionId,
      examId,
      examTitle: '',
      studentName: 'Current User',
      startTime: startTimeRef.current,
      endTime: Date.now(),
      snapshotCount: snapshots.length,
      flagCount: flags.length,
      status: flags.length > 0 ? 'Flagged' : 'Completed',
      ...updates,
    };

    // Save session
    try {
      const existing = JSON.parse(localStorage.getItem('mas_exam_sessions') || '[]') as ExamSession[];
      localStorage.setItem('mas_exam_sessions', JSON.stringify([...existing, session]));
    } catch {}

    try {
      await fetch('/api/exam-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...session, flags, snapshots }),
      });
    } catch {}

    return session;
  }, [sessionId, examId, snapshots, flags]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return {
    videoRef,
    snapshots,
    flags,
    isRecording,
    cameraError,
    startRecording,
    stopRecording,
    snapshotCount: snapshots.length,
  };
}
