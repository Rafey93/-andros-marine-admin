'use client';

import { Camera, CameraOff, AlertTriangle } from 'lucide-react';

interface ExamProctoringWidgetProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isRecording: boolean;
  snapshotCount: number;
  flagCount: number;
  cameraError: string | null;
}

export default function ExamProctoringWidget({
  videoRef,
  isRecording,
  snapshotCount,
  flagCount,
  cameraError,
}: ExamProctoringWidgetProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-44 bg-gray-900 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1.5 bg-gray-800">
        <div className="flex items-center gap-1.5">
          {isRecording ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 rec-pulse" />
              <span className="text-white text-xs font-semibold">REC</span>
            </>
          ) : (
            <span className="text-gray-400 text-xs">Proctoring</span>
          )}
        </div>
        {flagCount > 0 && (
          <div className="flex items-center gap-1 text-mas-warning text-xs">
            <AlertTriangle className="w-3 h-3" />
            <span>{flagCount}</span>
          </div>
        )}
      </div>

      {/* Video / error */}
      <div className="relative aspect-video bg-black">
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400">
            <CameraOff className="w-6 h-6" />
            <span className="text-xs text-center px-2">Camera blocked</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
            autoPlay
          />
        )}
        {!cameraError && !isRecording && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-6 h-6 text-gray-600" />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-2 py-1.5 flex justify-between text-xs text-gray-400 bg-gray-900 border-t border-gray-700">
        <span>{snapshotCount} captures</span>
        <span className={flagCount > 0 ? 'text-mas-warning font-semibold' : ''}>{flagCount} flags</span>
      </div>
    </div>
  );
}
