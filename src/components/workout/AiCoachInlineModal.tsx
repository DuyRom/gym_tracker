'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Camera,
  Volume2,
  VolumeX,
  Award,
  Zap,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  KEYPOINT_INDEX,
  getSquatAngles,
  getBicepCurlAngles,
  getShoulderPressAngles,
  getPushupAngles,
  getDeadliftAngles,
  getLungeAngles,
} from '@/lib/ai-coach/angle-calculator';
import { RepCounter, EXERCISE_CONFIGS } from '@/lib/ai-coach/rep-counter';
import {
  analyzeSquatForm,
  analyzeBicepCurlForm,
  analyzeShoulderPressForm,
  analyzePushupForm,
  analyzeDeadliftForm,
  analyzeLungeForm,
  FormFeedback,
} from '@/lib/ai-coach/form-analyzer';
import { drawSkeleton } from '@/lib/ai-coach/skeleton-renderer';
import {
  initPoseDetector,
  detectPose,
  disposePoseDetector,
} from '@/lib/ai-coach/pose-detector';
import { voiceCoach } from '@/lib/ai-coach/voice-coach';
import { hapticSuccess, hapticImpact, hapticSelection } from '@/lib/native-bridge';

// Dynamic import CameraView
const CameraView = dynamic(() => import('@/components/ai-coach/CameraView'), {
  ssr: false,
});

export type AiExerciseKey =
  | 'squat'
  | 'bicep_curl'
  | 'shoulder_press'
  | 'pushup'
  | 'deadlift'
  | 'lunge';

interface ExerciseDef {
  key: AiExerciseKey;
  nameVi: string;
  nameEn: string;
  icon: string;
  targetJoint: string;
  idealDepth: string;
}

export const AI_EXERCISES: ExerciseDef[] = [
  {
    key: 'squat',
    nameVi: 'Squat (Gánh Đùi / Goblet)',
    nameEn: 'Squat / Goblet Squat',
    icon: '🏋️‍♂️',
    targetJoint: 'Khớp gối & hông',
    idealDepth: 'Đùi song song mặt đất (~90°-100°)',
  },
  {
    key: 'bicep_curl',
    nameVi: 'Bicep / Hammer Curl (Cuốn Tay Trước)',
    nameEn: 'Dumbbell / Barbell Curl',
    icon: '💪',
    targetJoint: 'Khớp khuỷu tay',
    idealDepth: 'Gập sát < 55°, duỗi thẳng > 150°',
  },
  {
    key: 'shoulder_press',
    nameVi: 'Shoulder Press / Đẩy Ngực Dốc',
    nameEn: 'Overhead / Incline Press',
    icon: '🚀',
    targetJoint: 'Khớp vai & khuỷu tay',
    idealDepth: 'Hạ ngang tai, đẩy thẳng qua đầu',
  },
  {
    key: 'pushup',
    nameVi: 'Push-up (Hít Đất)',
    nameEn: 'Standard Push-up',
    icon: '⚡',
    targetJoint: 'Khuỷu tay & cơ lõi',
    idealDepth: 'Khuỷu tay gập ~90°, lưng thẳng',
  },
  {
    key: 'deadlift',
    nameVi: 'Deadlift / RDL (Bản Lề Hông)',
    nameEn: 'Romanian / Conventional Deadlift',
    icon: '🔥',
    targetJoint: 'Khớp hông & lưng dưới',
    idealDepth: 'Gập hông ~90°-100°, khóa hông ở đỉnh',
  },
  {
    key: 'lunge',
    nameVi: 'Lunge / Bulgarian Split Squat',
    nameEn: 'Walking / Bulgarian Lunge',
    icon: '🦵',
    targetJoint: 'Khớp gối & hông',
    idealDepth: 'Gối trước vuông góc 90°',
  },
];

export function mapExerciseNameToAiKey(name: string): AiExerciseKey {
  const lower = (name || '').toLowerCase();
  if (lower.includes('goblet') || lower.includes('squat')) {
    if (lower.includes('split') || lower.includes('bulgarian') || lower.includes('lunge')) {
      return 'lunge';
    }
    return 'squat';
  }
  if (lower.includes('lunge') || lower.includes('chùng chân') || lower.includes('bulgarian')) {
    return 'lunge';
  }
  if (
    lower.includes('bicep') ||
    lower.includes('tay trước') ||
    lower.includes('hammer') ||
    (lower.includes('curl') && !lower.includes('leg') && !lower.includes('đùi sau'))
  ) {
    return 'bicep_curl';
  }
  if (
    lower.includes('shoulder press') ||
    lower.includes('đẩy vai') ||
    lower.includes('overhead press') ||
    lower.includes('incline')
  ) {
    return 'shoulder_press';
  }
  if (lower.includes('push-up') || lower.includes('pushup') || lower.includes('hít đất')) {
    return 'pushup';
  }
  if (lower.includes('deadlift') || lower.includes('rdl') || lower.includes('romanian')) {
    return 'deadlift';
  }
  return 'squat';
}

function playBeepSound(freq = 880, type: OscillatorType = 'sine', duration = 0.15) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
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
  } catch {}
}

interface AiCoachInlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    id: string;
    nameVi: string;
    nameEn?: string;
    repsMin?: number;
    repsMax?: number;
    sets?: number;
  } | null;
  onSaveResult: (reps: number, avgScore: number) => Promise<void> | void;
}

export default function AiCoachInlineModal({
  isOpen,
  onClose,
  exercise,
  onSaveResult,
}: AiCoachInlineModalProps) {
  const initialKey = exercise ? mapExerciseNameToAiKey(exercise.nameVi) : 'squat';
  const [selectedExercise, setSelectedExercise] = useState<AiExerciseKey>(initialKey);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Live Tracking States
  const [repCount, setRepCount] = useState(0);
  const [repProgress, setRepProgress] = useState(0);
  const [repPhaseText, setRepPhaseText] = useState('SẴN SÀNG');
  const [currentAngle, setCurrentAngle] = useState(180);
  const [formFeedback, setFormFeedback] = useState<FormFeedback>({
    score: 100,
    isGoodRep: true,
    statusText: 'Đứng vào khung hình camera để bắt đầu',
    tips: ['Giữ cơ thể trong tầm nhìn của camera'],
  });

  // Session Stats
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [goodRepsCount, setGoodRepsCount] = useState(0);
  const [formScoresHistory, setFormScoresHistory] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Engine references
  const repCounterRef = useRef<RepCounter | null>(null);
  const isDetectingRef = useRef(false);

  // Sync exercise selection when exercise changes
  useEffect(() => {
    if (exercise) {
      const mapped = mapExerciseNameToAiKey(exercise.nameVi);
      setSelectedExercise(mapped);
    }
  }, [exercise]);

  // Reinitialize RepCounter when exercise changes
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

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      setIsSessionActive(false);
      disposePoseDetector();
    };
  }, []);

  const handleStartSession = async () => {
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
      if (voiceEnabled && voiceCoach) {
        voiceCoach.speak('Bắt đầu buổi tập. Hãy sẵn sàng!', true);
      }
    } catch (err) {
      console.error('Failed to init MoveNet detector:', err);
      alert('Không thể tải mô hình AI MoveNet. Vui lòng kiểm tra quyền camera hoặc kết nối mạng.');
    } finally {
      setIsModelLoading(false);
    }
  };

  const handlePauseSession = () => {
    setIsSessionActive(false);
  };

  const handleResetSession = () => {
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

        // 1. Calculate angles
        if (selectedExercise === 'squat') {
          const angles = getSquatAngles(keypoints);
          primaryAngle = angles.primaryKneeAngle;
          activeJointIndex =
            angles.preferredSide === 'right' ? KEYPOINT_INDEX.RIGHT_KNEE : KEYPOINT_INDEX.LEFT_KNEE;
          feedback = analyzeSquatForm({
            kneeAngle: primaryAngle,
            hipAngle: angles.primaryHipAngle,
            symmetryDelta: angles.symmetryDelta,
          });
        } else if (selectedExercise === 'bicep_curl') {
          const angles = getBicepCurlAngles(keypoints);
          primaryAngle = angles.primaryElbowAngle;
          activeJointIndex =
            angles.preferredSide === 'right' ? KEYPOINT_INDEX.RIGHT_ELBOW : KEYPOINT_INDEX.LEFT_ELBOW;
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
            angles.preferredSide === 'right' ? KEYPOINT_INDEX.RIGHT_ELBOW : KEYPOINT_INDEX.LEFT_ELBOW;
          feedback = analyzePushupForm({
            minElbowAngle: primaryAngle,
            bodyLineAngle: angles.bodyLineAngle,
          });
        } else if (selectedExercise === 'deadlift') {
          const angles = getDeadliftAngles(keypoints);
          primaryAngle = angles.primaryHipAngle;
          activeJointIndex =
            angles.preferredSide === 'right' ? KEYPOINT_INDEX.RIGHT_HIP : KEYPOINT_INDEX.LEFT_HIP;
          feedback = analyzeDeadliftForm({
            hipAngle: primaryAngle,
            kneeAngle: angles.primaryKneeAngle,
          });
        } else if (selectedExercise === 'lunge') {
          const angles = getLungeAngles(keypoints);
          primaryAngle = angles.primaryKneeAngle;
          activeJointIndex = angles.isLeftFront ? KEYPOINT_INDEX.LEFT_KNEE : KEYPOINT_INDEX.RIGHT_KNEE;
          feedback = analyzeLungeForm({
            frontKneeAngle: angles.frontKneeAngle,
            backKneeAngle: angles.backKneeAngle,
            torsoAngle: angles.torsoAngle,
          });
        }

        setCurrentAngle(primaryAngle);
        setFormFeedback(feedback);

        // Voice correction
        if (voiceEnabled && voiceCoach && !feedback.isGoodRep && feedback.tips.length > 0) {
          voiceCoach.speakFormCorrection(feedback.tips[0]);
        }

        // 2. Feed angle to RepCounter State Machine
        if (repCounterRef.current) {
          const repResult = repCounterRef.current.update(primaryAngle);
          setRepCount(repResult.count);
          setRepProgress(repResult.progressPercent);

          const phaseLabels: Record<string, string> = {
            READY: 'SẴN SÀNG',
            DOWN:
              selectedExercise === 'shoulder_press'
                ? 'HẠ TẠ'
                : selectedExercise === 'deadlift'
                ? 'HẠ HÔNG'
                : 'XUỐNG',
            UP:
              selectedExercise === 'shoulder_press'
                ? 'ĐẨY LÊN'
                : selectedExercise === 'deadlift'
                ? 'KHÓA HÔNG'
                : 'LÊN',
          };
          setRepPhaseText(phaseLabels[repResult.phase] || repResult.phase);

          // On completed rep
          if (repResult.repCompleted) {
            hapticSuccess();
            if (soundEnabled) {
              playBeepSound(980, 'sine', 0.18);
            }
            if (voiceEnabled && voiceCoach) {
              voiceCoach.speakRepMilestone(repResult.count);
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
        console.error('Frame pose tracking error:', err);
      } finally {
        isDetectingRef.current = false;
      }
    },
    [isSessionActive, selectedExercise, voiceEnabled, soundEnabled, facingMode]
  );

  const handleFinishAndSave = async () => {
    setIsSubmitting(true);
    const avgScore =
      formScoresHistory.length > 0
        ? Math.round(formScoresHistory.reduce((a, b) => a + b, 0) / formScoresHistory.length)
        : formFeedback.score;

    try {
      // 1. Save AiCoachSession to database
      await fetch('/api/ai-coach/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: selectedExercise,
          exerciseName: exercise?.nameVi || selectedExercise,
          totalReps: repCount,
          goodReps: goodRepsCount,
          avgFormScore: avgScore,
          durationSec: elapsedSec,
          feedbackSummary: formFeedback.tips.join(' • '),
        }),
      });

      // 2. Trigger celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // 3. Callback to parent workout page
      await onSaveResult(repCount, avgScore);
      setIsSessionActive(false);
      onClose();
    } catch (err) {
      console.error('Save AI Coach result error:', err);
      // Still callback even if session log fails
      await onSaveResult(repCount, avgScore);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentDef = AI_EXERCISES.find((e) => e.key === selectedExercise) || AI_EXERCISES[0];
  const avgScore =
    formScoresHistory.length > 0
      ? Math.round(formScoresHistory.reduce((a, b) => a + b, 0) / formScoresHistory.length)
      : formFeedback.score;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 720,
          width: '96%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface-primary, #090d16)',
          borderRadius: 22,
          border: '1px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
              }}
            >
              {currentDef.icon}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  AI COACH CAMERA
                </h2>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34D399',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  MoveNet Realtime
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted, #94A3B8)' }}>
                {exercise?.nameVi || currentDef.nameVi} • {currentDef.idealDepth}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                background: soundEnabled ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: soundEnabled ? '#38BDF8' : '#64748B',
                width: 34,
                height: 34,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#94A3B8',
                width: 34,
                height: 34,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Exercise Quick Selector Pills */}
        <div
          style={{
            padding: '10px 16px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
          }}
        >
          {AI_EXERCISES.map((ex) => {
            const isSelected = ex.key === selectedExercise;
            return (
              <button
                key={ex.key}
                type="button"
                onClick={() => {
                  setSelectedExercise(ex.key);
                  hapticSelection();
                }}
                disabled={isSessionActive}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  border: isSelected ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#38BDF8' : '#94A3B8',
                  cursor: isSessionActive ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  opacity: isSessionActive && !isSelected ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
              >
                <span>{ex.icon}</span>
                <span>{ex.nameVi.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Live Camera Viewport Area */}
        <div
          style={{
            position: 'relative',
            background: '#000',
            width: '100%',
            aspectRatio: '4 / 3',
            maxHeight: '48vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CameraView
            onFrame={handleFrame}
            isActive={isSessionActive}
            facingMode={facingMode}
            onFacingModeChange={(m) => setFacingMode(m)}
          />

          {/* Floating Reps & Score Overlay HUD */}
          {isSessionActive && (
            <>
              {/* Top Left: Rep Count HUD */}
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: 14,
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}
              >
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#38BDF8', letterSpacing: 0.5 }}>
                    SỐ REPS
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#F8FAFC',
                      fontFamily: 'JetBrains Mono, monospace',
                      lineHeight: 1,
                    }}
                  >
                    {repCount}
                  </div>
                </div>

                <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />

                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#34D399', letterSpacing: 0.5 }}>
                    FORM SCORE
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: formFeedback.score >= 80 ? '#34D399' : '#F59E0B',
                      fontFamily: 'JetBrains Mono, monospace',
                      lineHeight: 1,
                    }}
                  >
                    {formFeedback.score}%
                  </div>
                </div>
              </div>

              {/* Top Right: Phase Badge & Angle */}
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  padding: '6px 12px',
                  textAlign: 'right',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color:
                      repPhaseText === 'XUỐNG' || repPhaseText === 'HẠ TẠ'
                        ? '#F59E0B'
                        : repPhaseText === 'LÊN' || repPhaseText === 'ĐẨY LÊN'
                        ? '#38BDF8'
                        : '#34D399',
                    letterSpacing: 0.5,
                  }}
                >
                  {repPhaseText}
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'JetBrains Mono' }}>
                  Góc: {Math.round(currentAngle)}°
                </div>
              </div>

              {/* Bottom: Feedback Strip */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  right: 12,
                  background: 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 12,
                  padding: '8px 14px',
                  border: formFeedback.isGoodRep
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {formFeedback.isGoodRep ? (
                  <ShieldCheck size={18} color="#34D399" style={{ flexShrink: 0 }} />
                ) : (
                  <Zap size={18} color="#F59E0B" style={{ flexShrink: 0 }} />
                )}
                <div style={{ fontSize: 12, color: '#F1F5F9', fontWeight: 600, flex: 1 }}>
                  {formFeedback.tips.length > 0
                    ? formFeedback.tips[0]
                    : formFeedback.statusText || 'Form chuẩn, tiếp tục duy trì!'}
                </div>
              </div>
            </>
          )}

          {/* Not Active Overlay Call to Action */}
          {!isSessionActive && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(9, 13, 22, 0.75)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(2, 132, 199, 0.4) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  marginBottom: 12,
                }}
              >
                {currentDef.icon}
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', margin: '0 0 6px 0' }}>
                {currentDef.nameVi}
              </h3>
              <p style={{ fontSize: 12, color: '#94A3B8', maxWidth: 360, margin: '0 0 16px 0' }}>
                Đứng cách camera khoảng 1.5m–2m sao cho toàn thân hoặc nửa thân trên nằm trong khung hình.
              </p>

              <button
                type="button"
                onClick={handleStartSession}
                disabled={isModelLoading}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                  color: '#0F172A',
                  fontWeight: 800,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 8px 24px rgba(56, 189, 248, 0.35)',
                }}
              >
                <Play size={16} fill="currentColor" />
                <span>{isModelLoading ? 'ĐANG KHỞI TẠO MOVENET...' : 'BẮT ĐẦU TẬP VỚI AI'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Controls & Results */}
        <div
          style={{
            padding: '16px 20px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isSessionActive ? (
              <button
                type="button"
                onClick={handlePauseSession}
                style={{
                  padding: '9px 16px',
                  borderRadius: 10,
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#FBBF24',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <Pause size={14} fill="currentColor" /> Tạm dừng
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartSession}
                style={{
                  padding: '9px 16px',
                  borderRadius: 10,
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38BDF8',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <Play size={14} fill="currentColor" /> Tiếp tục
              </button>
            )}

            <button
              type="button"
              onClick={handleResetSession}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#94A3B8',
                padding: '9px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
              }}
              title="Đặt lại hiệp tập"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={handleFinishAndSave}
              disabled={isSubmitting || repCount === 0}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                background:
                  repCount > 0
                    ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: repCount > 0 ? '#FFFFFF' : '#64748B',
                fontWeight: 800,
                fontSize: 13,
                border: 'none',
                cursor: repCount > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: repCount > 0 ? '0 8px 20px rgba(16, 185, 129, 0.3)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <CheckCircle2 size={16} />
              <span>
                {isSubmitting
                  ? 'Đang lưu...'
                  : repCount > 0
                  ? `Lưu Hiệp Tập (${repCount} Reps • ${avgScore}%)`
                  : 'Chưa có Reps'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
