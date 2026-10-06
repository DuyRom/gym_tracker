'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Zap,
  Award,
  Clock,
  Dumbbell,
  Video,
  ArrowLeft,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Point2D,
  KEYPOINT_INDEX,
  getSquatAngles,
  getBicepCurlAngles,
  getShoulderPressAngles,
  getPushupAngles,
} from '@/lib/ai-coach/angle-calculator';
import { RepCounter, EXERCISE_CONFIGS } from '@/lib/ai-coach/rep-counter';
import {
  analyzeSquatForm,
  analyzeBicepCurlForm,
  analyzeShoulderPressForm,
  analyzePushupForm,
  FormFeedback,
} from '@/lib/ai-coach/form-analyzer';
import { drawSkeleton } from '@/lib/ai-coach/skeleton-renderer';
import {
  initPoseDetector,
  detectPose,
  disposePoseDetector,
} from '@/lib/ai-coach/pose-detector';
import { hapticSuccess, hapticImpact } from '@/lib/native-bridge';

// Dynamic import CameraView to avoid SSR issues
const CameraView = dynamic(() => import('@/components/ai-coach/CameraView'), {
  ssr: false,
});

type ExerciseKey = 'squat' | 'bicep_curl' | 'shoulder_press' | 'pushup';

interface ExerciseDef {
  key: ExerciseKey;
  nameVi: string;
  nameEn: string;
  icon: string;
  targetJoint: string;
  description: string;
  idealDepth: string;
}

const EXERCISES: ExerciseDef[] = [
  {
    key: 'squat',
    nameVi: 'Squat (Gánh Đùi)',
    nameEn: 'Bodyweight / Barbell Squat',
    icon: '🏋️‍♂️',
    targetJoint: 'Khớp gối & khớp hông',
    description: 'Đứng rộng bằng vai, hạ mông về sau như ngồi ghế',
    idealDepth: 'Đùi song song mặt đất (~90°-100°)',
  },
  {
    key: 'bicep_curl',
    nameVi: 'Bicep Curl (Cuốn Tay Trước)',
    nameEn: 'Dumbbell / Barbell Curl',
    icon: '💪',
    targetJoint: 'Khớp khuỷu tay',
    description: 'Cố định cùi chỏ sát thân, gập tay siết chặt bắp trước',
    idealDepth: 'Gập sát < 55°, duỗi thẳng > 150°',
  },
  {
    key: 'shoulder_press',
    nameVi: 'Shoulder Press (Đẩy Vai)',
    nameEn: 'Overhead Press',
    icon: '🚀',
    targetJoint: 'Khớp vai & khuỷu tay',
    description: 'Đẩy tạ thẳng qua đầu, siết cơ vai ở đỉnh',
    idealDepth: 'Hạ ngang tai, đẩy thẳng tay qua đầu',
  },
  {
    key: 'pushup',
    nameVi: 'Push-up (Hít Đất)',
    nameEn: 'Standard Push-up',
    icon: '⚡',
    targetJoint: 'Khuỷu tay & cơ lõi',
    description: 'Thân người tạo đường thẳng, hạ ngực sát sàn',
    idealDepth: 'Khuỷu tay gập ~90°, lưng không võng',
  },
];

// Simple Web Audio API Synthesizer for instant audible feedback
function playBeep(freq = 880, type: OscillatorType = 'sine', duration = 0.15) {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Audio context may be restricted before interaction
  }
}

export default function AiCoachPage() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseKey>('squat');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live Tracking States
  const [repCount, setRepCount] = useState(0);
  const [repProgress, setRepProgress] = useState(0);
  const [repPhaseText, setRepPhaseText] = useState('SẴN SÀNG');
  const [currentAngle, setCurrentAngle] = useState(180);
  const [formFeedback, setFormFeedback] = useState<FormFeedback>({
    score: 100,
    isGoodRep: true,
    statusText: 'Đứng vào khung hình để bắt đầu',
    tips: ['Giữ toàn bộ cơ thể trong tầm nhìn của Camera'],
  });

  // Session Stats
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [goodRepsCount, setGoodRepsCount] = useState(0);
  const [formScoresHistory, setFormScoresHistory] = useState<number[]>([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Engine references
  const repCounterRef = useRef<RepCounter | null>(null);
  const isDetectingRef = useRef(false);

  // Initialize or re-configure RepCounter when exercise changes
  useEffect(() => {
    repCounterRef.current = new RepCounter(EXERCISE_CONFIGS[selectedExercise]);
    setRepCount(0);
    setRepProgress(0);
    setRepPhaseText('SẴN SÀNG');
    setGoodRepsCount(0);
    setFormScoresHistory([]);
  }, [selectedExercise]);

  // Session Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSessionActive && sessionStartTime) {
      timer = setInterval(() => {
        setElapsedSec(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive, sessionStartTime]);

  // Load MoveNet model
  const startSession = async () => {
    setIsModelLoading(true);
    try {
      await initPoseDetector();
      if (repCounterRef.current) {
        repCounterRef.current.reset();
      }
      setRepCount(0);
      setGoodRepsCount(0);
      setFormScoresHistory([]);
      setSessionStartTime(Date.now());
      setIsSessionActive(true);
      hapticImpact();
    } catch (err) {
      console.error('Failed to init MoveNet detector:', err);
      alert('Không thể tải mô hình AI MoveNet. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setIsModelLoading(false);
    }
  };

  const stopSession = () => {
    setIsSessionActive(false);
    setShowSummaryModal(true);
    if (repCount > 0) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const resetSession = () => {
    if (repCounterRef.current) {
      repCounterRef.current.reset();
    }
    setRepCount(0);
    setGoodRepsCount(0);
    setFormScoresHistory([]);
    setElapsedSec(0);
    setSessionStartTime(Date.now());
    hapticImpact();
  };

  // Main real-time frame processing callback
  const handleFrame = useCallback(
    async (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
      if (!isSessionActive || isDetectingRef.current) return;
      isDetectingRef.current = true;

      try {
        const keypoints = await detectPose(video);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (!keypoints || keypoints.length < 17) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }

        let primaryAngle = 180;
        let activeJointIndex = KEYPOINT_INDEX.LEFT_KNEE;
        let feedback: FormFeedback = {
          score: 85,
          isGoodRep: true,
          statusText: 'Đang theo dõi...',
          tips: [],
        };

        // 1. Calculate angles based on chosen exercise
        if (selectedExercise === 'squat') {
          const angles = getSquatAngles(keypoints);
          primaryAngle = angles.primaryKneeAngle;
          activeJointIndex =
            angles.preferredSide === 'right'
              ? KEYPOINT_INDEX.RIGHT_KNEE
              : KEYPOINT_INDEX.LEFT_KNEE;

          feedback = analyzeSquatForm({
            kneeAngle: primaryAngle,
            hipAngle: angles.primaryHipAngle,
            symmetryDelta: angles.symmetryDelta,
          });
        } else if (selectedExercise === 'bicep_curl') {
          const angles = getBicepCurlAngles(keypoints);
          primaryAngle = angles.primaryElbowAngle;
          activeJointIndex =
            angles.preferredSide === 'right'
              ? KEYPOINT_INDEX.RIGHT_ELBOW
              : KEYPOINT_INDEX.LEFT_ELBOW;

          feedback = analyzeBicepCurlForm({
            minElbowAngle: primaryAngle,
            maxElbowAngle: primaryAngle,
          });
        } else if (selectedExercise === 'shoulder_press') {
          const angles = getShoulderPressAngles(keypoints);
          primaryAngle = angles.primaryElbowAngle;
          activeJointIndex = KEYPOINT_INDEX.LEFT_ELBOW;

          feedback = analyzeShoulderPressForm({
            minElbowAngle: primaryAngle,
            maxElbowAngle: primaryAngle,
            symmetryDelta: angles.symmetryDelta,
          });
        } else if (selectedExercise === 'pushup') {
          const angles = getPushupAngles(keypoints);
          primaryAngle = angles.primaryElbowAngle;
          activeJointIndex =
            angles.preferredSide === 'right'
              ? KEYPOINT_INDEX.RIGHT_ELBOW
              : KEYPOINT_INDEX.LEFT_ELBOW;

          feedback = analyzePushupForm({
            minElbowAngle: primaryAngle,
            bodyLineAngle: angles.bodyLineAngle,
          });
        }

        setCurrentAngle(primaryAngle);
        setFormFeedback(feedback);

        // 2. Feed angle to RepCounter State Machine
        if (repCounterRef.current) {
          const repResult = repCounterRef.current.update(primaryAngle);
          setRepCount(repResult.count);
          setRepProgress(repResult.progressPercent);

          const phaseLabels: Record<string, string> = {
            READY: 'SẴN SÀNG',
            DOWN: selectedExercise === 'shoulder_press' ? 'HẠ TẠ' : 'XUỐNG',
            UP: selectedExercise === 'shoulder_press' ? 'ĐẨY LÊN' : 'LÊN',
          };
          setRepPhaseText(phaseLabels[repResult.phase] || repResult.phase);

          // On completed rep
          if (repResult.repCompleted) {
            hapticSuccess();
            if (soundEnabled) {
              playBeep(980, 'sine', 0.18);
            }
            if (feedback.isGoodRep) {
              setGoodRepsCount((prev) => prev + 1);
            }
            setFormScoresHistory((prev) => [...prev, feedback.score]);
          }
        }

        // 3. Render Skeleton Canvas Overlay
        drawSkeleton(ctx, keypoints, canvas.width, canvas.height, {
          formScore: feedback.score,
          highlightAngle: {
            jointIndex: activeJointIndex,
            angle: primaryAngle,
          },
          mirror: facingMode === 'user',
        });
      } catch (err) {
        console.error('Frame inference error:', err);
      } finally {
        isDetectingRef.current = false;
      }
    },
    [isSessionActive, selectedExercise, facingMode, soundEnabled]
  );

  // Clean up MoveNet on unmount
  useEffect(() => {
    return () => {
      disposePoseDetector();
    };
  }, []);

  // Save session to database API
  const handleSaveSession = async () => {
    if (repCount === 0) {
      setShowSummaryModal(false);
      return;
    }

    setIsSaving(true);
    try {
      const avgScore =
        formScoresHistory.length > 0
          ? Math.round(
              formScoresHistory.reduce((a, b) => a + b, 0) / formScoresHistory.length
            )
          : formFeedback.score;

      const currentEx = EXERCISES.find((e) => e.key === selectedExercise);

      const res = await fetch('/api/v1/ai-coach/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: selectedExercise,
          exerciseName: currentEx?.nameVi || selectedExercise,
          totalReps: repCount,
          goodReps: goodRepsCount,
          avgFormScore: avgScore,
          durationSec: elapsedSec,
          feedbackSummary: formFeedback.tips.join('; '),
        }),
      });

      if (res.ok) {
        alert('Đã lưu kết quả bài tập AI Coach vào hệ thống thành công! 🎉');
        setShowSummaryModal(false);
      } else {
        alert('Lỗi lưu buổi tập. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Save session error:', err);
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentExerciseDef = EXERCISES.find((e) => e.key === selectedExercise)!;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-28 pt-4 px-4 max-w-5xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Trang chủ</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            type="button"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/60 text-sky-400 text-xs font-bold">
            <Sparkles size={13} className="text-sky-400 animate-pulse" />
            <span>AI Computer Vision Coach</span>
          </div>
        </div>
      </div>

      {/* Exercise Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {EXERCISES.map((ex) => {
          const isSelected = selectedExercise === ex.key;
          return (
            <button
              key={ex.key}
              disabled={isSessionActive}
              onClick={() => setSelectedExercise(ex.key)}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-500 text-sky-300 shadow-md shadow-sky-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/50'
              } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
              type="button"
            >
              <span className="text-xl">{ex.icon}</span>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{ex.nameVi.split('(')[0]}</p>
                <p className="text-[10px] text-slate-500 truncate">{ex.nameEn.split('/')[0]}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Camera Feed & Canvas Overlay (2 cols on lg) */}
        <div className="lg:col-span-2 relative">
          <CameraView
            onFrame={handleFrame}
            isActive={isSessionActive}
            facingMode={facingMode}
            onFacingModeChange={setFacingMode}
          />

          {/* Overlay HUD Badges (When Active) */}
          {isSessionActive && (
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
              {/* Rep Phase Tag */}
              <div className="px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300">Nhịp:</span>
                <span className="text-sky-400 font-mono">{repPhaseText}</span>
              </div>

              {/* Angle Tag */}
              <div className="px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <span className="text-slate-400">Góc khớp:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {Math.round(currentAngle)}°
                </span>
              </div>
            </div>
          )}

          {/* Bottom Live Feedback Banner (When Active) */}
          {isSessionActive && (
            <div className="absolute bottom-4 inset-x-4 z-20 pointer-events-none">
              <div className="p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      formFeedback.score >= 80
                        ? 'bg-emerald-400'
                        : formFeedback.score >= 60
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">
                      {formFeedback.statusText}
                    </p>
                    {formFeedback.tips.length > 0 && (
                      <p className="text-[11px] text-slate-400 truncate">
                        {formFeedback.tips[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Score Pill */}
                <div className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold font-mono">
                  <span
                    className={
                      formFeedback.score >= 80
                        ? 'text-emerald-400'
                        : formFeedback.score >= 60
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }
                  >
                    {formFeedback.score}% Form
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Dashboard & Controls (1 col on lg) */}
        <div className="flex flex-col gap-4">
          {/* Giant Counter Card */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-400 to-indigo-500" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Số Reps Hoàn Thành
            </p>
            <div className="text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-sky-400 tracking-tight my-2">
              {repCount}
            </div>

            {/* Rep Progress Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-2 mt-1 overflow-hidden">
              <div
                className="bg-sky-400 h-full transition-all duration-150 ease-out"
                style={{ width: `${repProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              Chu kỳ rep: {repProgress}%
            </p>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Form Chuẩn</p>
                <p className="text-base font-bold font-mono text-white">
                  {goodRepsCount}/{repCount}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Thời Gian</p>
                <p className="text-base font-bold font-mono text-white">
                  {Math.floor(elapsedSec / 60)}:
                  {String(elapsedSec % 60).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          {/* Exercise Guide Box */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs">
            <p className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <span>{currentExerciseDef.icon}</span>
              <span>{currentExerciseDef.nameVi}</span>
            </p>
            <p className="text-slate-400 leading-relaxed mb-2">
              {currentExerciseDef.description}
            </p>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-sky-400 font-medium">
              💡 Tiêu chuẩn: {currentExerciseDef.idealDepth}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-auto">
            {!isSessionActive ? (
              <button
                onClick={startSession}
                disabled={isModelLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 active:scale-98 transition-all disabled:opacity-50"
                type="button"
              >
                {isModelLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Đang nạp AI MoveNet...</span>
                  </>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" />
                    <span>Bắt Đầu Tập Với AI</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={stopSession}
                  className="flex-1 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
                  type="button"
                >
                  <Pause size={16} fill="currentColor" />
                  <span>Kết Thúc Hiệp</span>
                </button>
                <button
                  onClick={resetSession}
                  className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
                  title="Đặt lại hiệp"
                  type="button"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Modal Dialog */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400">
                <Award size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Tổng Kết Buổi Tập AI</h3>
                <p className="text-xs text-slate-400">{currentExerciseDef.nameVi}</p>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center my-4">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Tổng Reps</p>
                <p className="text-2xl font-black font-mono text-white mt-1">{repCount}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Reps Chuẩn</p>
                <p className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  {goodRepsCount}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Điểm Form TB</p>
                <p className="text-2xl font-black font-mono text-sky-400 mt-1">
                  {formScoresHistory.length > 0
                    ? Math.round(
                        formScoresHistory.reduce((a, b) => a + b, 0) /
                          formScoresHistory.length
                      )
                    : formFeedback.score}
                  %
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition-all"
                type="button"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveSession}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/20 active:scale-95 transition-all disabled:opacity-50"
                type="button"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu Vào Hồ Sơ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
