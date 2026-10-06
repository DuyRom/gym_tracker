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
  Mic,
  MicOff,
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
import { hapticSuccess, hapticImpact } from '@/lib/native-bridge';

// Dynamic import CameraView to avoid SSR issues
const CameraView = dynamic(() => import('@/components/ai-coach/CameraView'), {
  ssr: false,
});

type ExerciseKey =
  | 'squat'
  | 'bicep_curl'
  | 'shoulder_press'
  | 'pushup'
  | 'deadlift'
  | 'lunge';

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
  {
    key: 'deadlift',
    nameVi: 'Deadlift (Kéo Tạ Đất)',
    nameEn: 'Conventional / Romanian Deadlift',
    icon: '🔥',
    targetJoint: 'Khớp hông & lưng dưới',
    description: 'Bản lề hông (Hip hinge), đẩy mông về sau, giữ thẳng lưng',
    idealDepth: 'Gập hông ~90°-100°, khóa hông ở đỉnh',
  },
  {
    key: 'lunge',
    nameVi: 'Lunge (Bước Chùng Chân)',
    nameEn: 'Walking / Static Lunge',
    icon: '🦵',
    targetJoint: 'Khớp gối & hông trước sau',
    description: 'Bước một chân lên trước, hạ gối sau gần sát sàn',
    idealDepth: 'Gối trước vuông góc 90°, thân thẳng đứng',
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
  const [voiceEnabled, setVoiceEnabled] = useState(true);

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
      if (voiceEnabled && voiceCoach) {
        voiceCoach.speak('Bắt đầu buổi tập. Hãy sẵn sàng!', true);
      }
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
    if (voiceEnabled && voiceCoach) {
      voiceCoach.speak(`Buổi tập hoàn thành! Bạn đã hoàn thành ${repCount} reps.`, true);
    }
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
        } else if (selectedExercise === 'deadlift') {
          const angles = getDeadliftAngles(keypoints);
          primaryAngle = angles.primaryHipAngle;
          activeJointIndex =
            angles.preferredSide === 'right'
              ? KEYPOINT_INDEX.RIGHT_HIP
              : KEYPOINT_INDEX.LEFT_HIP;

          feedback = analyzeDeadliftForm({
            hipAngle: primaryAngle,
            kneeAngle: angles.primaryKneeAngle,
          });
        } else if (selectedExercise === 'lunge') {
          const angles = getLungeAngles(keypoints);
          primaryAngle = angles.primaryKneeAngle;
          activeJointIndex = angles.isLeftFront
            ? KEYPOINT_INDEX.LEFT_KNEE
            : KEYPOINT_INDEX.RIGHT_KNEE;

          feedback = analyzeLungeForm({
            frontKneeAngle: angles.frontKneeAngle,
            backKneeAngle: angles.backKneeAngle,
            torsoAngle: angles.torsoAngle,
          });
        }

        setCurrentAngle(primaryAngle);
        setFormFeedback(feedback);

        // Real-time voice coaching if form requires attention
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
              playBeep(980, 'sine', 0.18);
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
        console.error('Frame inference error:', err);
      } finally {
        isDetectingRef.current = false;
      }
    },
    [isSessionActive, selectedExercise, facingMode, soundEnabled, voiceEnabled]
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
    <main className="container ai-coach-container">
      {/* Top Header Bar */}
      <div className="ai-coach-header">
        <Link href="/" className="ai-back-btn">
          <ArrowLeft size={16} />
          <span>Trang chủ</span>
        </Link>
        <div className="ai-header-controls">
          {/* Voice Coach Guidance Toggle */}
          <button
            onClick={() => {
              const nextVal = !voiceEnabled;
              setVoiceEnabled(nextVal);
              if (voiceCoach) voiceCoach.setEnabled(nextVal);
            }}
            className={`ai-icon-toggle-btn ${voiceEnabled ? 'active' : ''}`}
            title={voiceEnabled ? 'Tắt giọng nói AI nhắc form' : 'Bật giọng nói AI nhắc form'}
            type="button"
          >
            {voiceEnabled ? <Mic size={18} /> : <MicOff size={18} />}
          </button>

          {/* Sound Beep Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`ai-icon-toggle-btn ${soundEnabled ? 'active' : ''}`}
            title={soundEnabled ? 'Tắt âm thanh bíp' : 'Bật âm thanh bíp'}
            type="button"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <div className="ai-brand-badge">
            <Sparkles size={14} />
            <span>AI Vision Studio</span>
          </div>
        </div>
      </div>

      {/* Exercise Selector Tabs - 6 Exercises Responsive Grid */}
      <div className="ai-exercise-grid">
        {EXERCISES.map((ex) => {
          const isSelected = selectedExercise === ex.key;
          return (
            <button
              key={ex.key}
              disabled={isSessionActive}
              onClick={() => setSelectedExercise(ex.key)}
              className={`ai-exercise-card ${isSelected ? 'active' : ''}`}
              type="button"
            >
              <span className="ai-exercise-icon">{ex.icon}</span>
              <div className="ai-exercise-info">
                <p className="ai-exercise-name-vi">{ex.nameVi.split('(')[0]}</p>
                <p className="ai-exercise-name-en">{ex.nameEn.split('/')[0]}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio Display Grid */}
      <div className="ai-studio-layout">
        {/* Camera Feed & Canvas Overlay */}
        <div style={{ position: 'relative' }}>
          <CameraView
            onFrame={handleFrame}
            isActive={isSessionActive}
            facingMode={facingMode}
            onFacingModeChange={setFacingMode}
          />

          {/* Overlay HUD Badges (When Active) */}
          {isSessionActive && (
            <div className="ai-hud-badges">
              {/* Rep Phase Tag */}
              <div className="ai-hud-badge">
                <span className="ai-hud-dot-pulse" />
                <span className="ai-hud-label">Nhịp:</span>
                <span className="ai-hud-value">{repPhaseText}</span>
              </div>

              {/* Angle Tag */}
              <div className="ai-hud-badge">
                <span className="ai-hud-label">Góc khớp:</span>
                <span className="ai-hud-value" style={{ color: '#10B981', fontSize: 13 }}>
                  {Math.round(currentAngle)}°
                </span>
              </div>
            </div>
          )}

          {/* Bottom Live Feedback Banner (When Active) */}
          {isSessionActive && (
            <div className="ai-feedback-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1 }}>
                <div
                  className="ai-feedback-status-dot"
                  style={{
                    backgroundColor:
                      formFeedback.score >= 80
                        ? '#10B981'
                        : formFeedback.score >= 60
                        ? '#F59E0B'
                        : '#F43F5E',
                  }}
                />
                <div className="ai-feedback-text-area">
                  <p className="ai-feedback-title">{formFeedback.statusText}</p>
                  {formFeedback.tips.length > 0 && (
                    <p className="ai-feedback-tip">{formFeedback.tips[0]}</p>
                  )}
                </div>
              </div>

              {/* Score Pill */}
              <div
                className="ai-feedback-score-pill"
                style={{
                  color:
                    formFeedback.score >= 80
                      ? '#10B981'
                      : formFeedback.score >= 60
                      ? '#F59E0B'
                      : '#F43F5E',
                }}
              >
                {formFeedback.score}% Form
              </div>
            </div>
          )}
        </div>

        {/* Real-time Dashboard & Controls */}
        <div className="ai-dashboard-sidebar">
          {/* Giant Counter Card */}
          <div className="ai-counter-card">
            <div className="ai-counter-top-bar" />
            <p className="ai-counter-label">Số Reps Hoàn Thành</p>
            <div className="ai-counter-number">{repCount}</div>

            {/* Rep Progress Bar */}
            <div className="ai-progress-track">
              <div
                className="ai-progress-bar"
                style={{ width: `${repProgress}%` }}
              />
            </div>
            <p className="ai-progress-info">Chu kỳ rep: {repProgress}%</p>
          </div>

          {/* Secondary Stats Row */}
          <div className="ai-stats-row">
            <div className="ai-stat-box">
              <div
                className="ai-stat-icon-box"
                style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="ai-stat-label">Form Chuẩn</p>
                <p className="ai-stat-value">
                  {goodRepsCount}/{repCount}
                </p>
              </div>
            </div>

            <div className="ai-stat-box">
              <div
                className="ai-stat-icon-box"
                style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8' }}
              >
                <Clock size={18} />
              </div>
              <div>
                <p className="ai-stat-label">Thời Gian</p>
                <p className="ai-stat-value">
                  {Math.floor(elapsedSec / 60)}:
                  {String(elapsedSec % 60).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          {/* Exercise Guide Box */}
          <div className="ai-guide-box">
            <p className="ai-guide-title">
              <span>{currentExerciseDef.icon}</span>
              <span>{currentExerciseDef.nameVi}</span>
            </p>
            <p className="ai-guide-desc">{currentExerciseDef.description}</p>
            <div className="ai-guide-standard">
              💡 Tiêu chuẩn: {currentExerciseDef.idealDepth}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="ai-actions-row">
            {!isSessionActive ? (
              <button
                onClick={startSession}
                disabled={isModelLoading}
                className="ai-start-btn"
                type="button"
              >
                {isModelLoading ? (
                  <>
                    <div className="ai-spinner" />
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
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <button
                  onClick={stopSession}
                  className="ai-stop-btn"
                  type="button"
                >
                  <Pause size={16} fill="currentColor" />
                  <span>Kết Thúc Hiệp</span>
                </button>
                <button
                  onClick={resetSession}
                  className="ai-reset-btn"
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
        <div className="ai-modal-backdrop">
          <div className="ai-modal-card">
            <div className="ai-modal-header">
              <div className="ai-modal-icon-box">
                <Award size={26} />
              </div>
              <div>
                <h3 className="ai-modal-title">Tổng Kết Buổi Tập AI</h3>
                <p className="ai-modal-subtitle">{currentExerciseDef.nameVi}</p>
              </div>
            </div>

            {/* Score Grid */}
            <div className="ai-modal-stats-grid">
              <div className="ai-modal-stat-item">
                <p className="ai-modal-stat-label">Tổng Reps</p>
                <p className="ai-modal-stat-value" style={{ color: '#fff' }}>
                  {repCount}
                </p>
              </div>
              <div className="ai-modal-stat-item">
                <p className="ai-modal-stat-label">Reps Chuẩn</p>
                <p className="ai-modal-stat-value" style={{ color: '#10B981' }}>
                  {goodRepsCount}
                </p>
              </div>
              <div className="ai-modal-stat-item">
                <p className="ai-modal-stat-label">Điểm Form TB</p>
                <p className="ai-modal-stat-value" style={{ color: '#38BDF8' }}>
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

            <div className="ai-modal-actions">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="ai-btn-secondary"
                type="button"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveSession}
                disabled={isSaving}
                className="ai-btn-primary"
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
