'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Square, CheckSquare, Square as UncheckedSquare, Dumbbell, Clock, Video, Info, Award, Calendar, Sparkles, Bot, CheckCircle2, HelpCircle } from 'lucide-react';
import CompletionModal from '@/components/workout/CompletionModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import TechniqueDetailModal from '@/components/workout/TechniqueDetailModal';
import AiCoachInlineModal from '@/components/workout/AiCoachInlineModal';
import WeightGuideModal from '@/components/workout/WeightGuideModal';
import { WorkoutDayItem } from '@/types/workout';
import { formatDuration, formatDateVi } from '@/lib/utils';
import { hapticSuccess, hapticSelection } from '@/lib/native-bridge';
import { useWorkoutSession } from '@/context/WorkoutSessionContext';
import { useDataSync } from '@/lib/data-sync';

export default function WorkoutPage() {
  const {
    activeSession,
    elapsedSeconds,
    loading: sessionLoading,
    startSession,
    finishSession,
    toggleExerciseCompleted,
    updateExerciseWeight,
    saveAiCoachResult,
  } = useWorkoutSession();

  const [allDays, setAllDays] = useState<WorkoutDayItem[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [daysLoading, setDaysLoading] = useState<boolean>(true);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [showStartConfirm, setShowStartConfirm] = useState<boolean>(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState<boolean>(false);
  const [starting, setStarting] = useState<boolean>(false);
  const [finishing, setFinishing] = useState<boolean>(false);

  // Log bù (Backfill date selection) states
  const [targetDateOption, setTargetDateOption] = useState<'TODAY' | 'YESTERDAY' | 'CUSTOM'>('TODAY');
  const [customDateValue, setCustomDateValue] = useState<string>('');
  const [finishDurationMin, setFinishDurationMin] = useState<number>(45);
  const [showWeightGuideModal, setShowWeightGuideModal] = useState<boolean>(false);

  // Technique Modal & AI Coach Inline Modal States
  const [selectedTechniqueExercise, setSelectedTechniqueExercise] = useState<any | null>(null);
  const [selectedAiCoachExercise, setSelectedAiCoachExercise] = useState<any | null>(null);
  const [aiCoachResults, setAiCoachResults] = useState<Record<string, { reps: number; score: number }>>({});

  const [completedSummary, setCompletedSummary] = useState({
    durationMin: 0,
    completedCount: 0,
    totalCount: 0,
    dayName: '',
  });

  // 1. Fetch workout days with cache: no-store
  const loadDays = useCallback(async () => {
    try {
      const daysRes = await fetch(`/api/exercises?_t=${Date.now()}`, { cache: 'no-store' });
      const daysData = await daysRes.json();
      if (daysData.days) {
        setAllDays(daysData.days);
        if (!selectedDayId) {
          const currentDayNum = new Date().getDay(); // 1 = Mon, 2 = Tue...
          const defaultDay = daysData.days.find((d: any) => d.dayOfWeek === currentDayNum) || daysData.days[0];
          if (defaultDay) setSelectedDayId(defaultDay.id);
        }
      }
    } catch (err) {
      console.error('Failed to load workout days:', err);
    } finally {
      setDaysLoading(false);
    }
  }, [selectedDayId]);

  useEffect(() => {
    loadDays();
  }, [loadDays]);

  // Reactive sync when schedule or exercises are changed
  useDataSync(['SCHEDULE'], loadDays);

  // 2. Synchronize selected day when active session is present
  useEffect(() => {
    if (activeSession?.workoutDayId) {
      setSelectedDayId(activeSession.workoutDayId);
    }
  }, [activeSession?.workoutDayId]);

  // 3. Restore AI Coach results from active session
  useEffect(() => {
    if (activeSession && Array.isArray(activeSession.exercises)) {
      const restoredAi: Record<string, { reps: number; score: number }> = {};
      activeSession.exercises.forEach((se: any) => {
        if (se.aiCoachSessions && se.aiCoachSessions.length > 0) {
          const latest = se.aiCoachSessions[0];
          restoredAi[se.exerciseId] = {
            reps: latest.totalReps,
            score: Math.round(latest.avgFormScore),
          };
        } else if (se.actualReps && typeof se.actualReps === 'string' && se.actualReps.includes('AI')) {
          const repsMatch = se.actualReps.match(/(\d+)\s*reps/i);
          const scoreMatch = se.actualReps.match(/AI(?:\s*Score)?\s*(\d+)%/i);
          if (repsMatch) {
            restoredAi[se.exerciseId] = {
              reps: parseInt(repsMatch[1], 10),
              score: scoreMatch ? parseInt(scoreMatch[1], 10) : 85,
            };
          }
        }
      });
      setAiCoachResults(restoredAi);
    }
  }, [activeSession]);

  // Open Start Dialog with smart date defaults
  const handleOpenStartDialog = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDow = yesterday.getDay();
    if (currentSelectedDay?.dayOfWeek === yesterdayDow) {
      setTargetDateOption('YESTERDAY');
    } else {
      setTargetDateOption('TODAY');
    }
    setCustomDateValue(yesterday.toISOString().slice(0, 10));
    setShowStartConfirm(true);
  };

  // 4. Start Session execution
  const executeStartSession = async () => {
    setStarting(true);
    try {
      let chosenDateStr = new Date().toISOString();
      if (targetDateOption === 'YESTERDAY') {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        chosenDateStr = y.toISOString();
      } else if (targetDateOption === 'CUSTOM' && customDateValue) {
        chosenDateStr = new Date(customDateValue + 'T12:00:00.000Z').toISOString();
      }

      await startSession(selectedDayId, chosenDateStr);
      setShowStartConfirm(false);
    } catch (err: any) {
      console.error('Failed to start session:', err);
      alert(err?.message || 'Không thể khởi tạo buổi tập. Vui lòng thử lại!');
    } finally {
      setStarting(false);
    }
  };

  // 5. Toggle exercise completed & update weight/reps
  const handleToggleExercise = async (exerciseId: string, currentCompleted: boolean) => {
    if (!activeSession) return;
    if (!currentCompleted) {
      hapticSuccess();
    } else {
      hapticSelection();
    }
    await toggleExerciseCompleted(exerciseId, currentCompleted);
  };

  const handleUpdateWeight = async (exerciseId: string, weightKg: number) => {
    if (!activeSession) return;
    await updateExerciseWeight(exerciseId, weightKg);
  };

  // 6. Finish Session trigger
  const handleFinishSession = () => {
    if (!activeSession) return;
    const isPastDate = new Date(activeSession.date).toDateString() !== new Date().toDateString();
    const minutesFromTimer = Math.max(1, Math.round(elapsedSeconds / 60));
    const plannedMin = currentSelectedDay?.durationMin || 40;
    if (isPastDate) {
      // Past-date (log bù): use planned duration as default
      setFinishDurationMin(plannedMin);
    } else {
      // Today: always use real timer value
      setFinishDurationMin(minutesFromTimer);
    }
    setShowFinishConfirm(true);
  };

  const executeFinishSession = async () => {
    if (!activeSession) return;
    setFinishing(true);

    try {
      const summary = await finishSession(sessionNotes, finishDurationMin);
      if (summary) {
        setCompletedSummary(summary);
        setShowFinishConfirm(false);
        setShowCompletionModal(true);
      }
    } catch (err: any) {
      console.error('Failed to finish session:', err);
      alert(err?.message || 'Lỗi khi kết thúc buổi tập');
    } finally {
      setFinishing(false);
    }
  };

  // 7. Save AI Coach result to session
  const handleSaveAiCoachResult = async (exerciseId: string, reps: number, score: number) => {
    setAiCoachResults((prev) => ({
      ...prev,
      [exerciseId]: { reps, score },
    }));

    if (activeSession) {
      await saveAiCoachResult(exerciseId, reps, score);
    }
  };

  const loading = daysLoading && allDays.length === 0;

  const isAiExercise = (name: string) => {
    const lower = (name || '').toLowerCase();
    return Boolean(
      lower.includes('squat') ||
      lower.includes('lunge') ||
      lower.includes('chùng chân') ||
      lower.includes('bicep') ||
      lower.includes('tay trước') ||
      lower.includes('hammer') ||
      (lower.includes('curl') && !lower.includes('leg') && !lower.includes('đùi sau')) ||
      lower.includes('shoulder press') ||
      lower.includes('đẩy vai') ||
      lower.includes('incline') ||
      lower.includes('push-up') ||
      lower.includes('hít đất') ||
      lower.includes('deadlift') ||
      lower.includes('rdl') ||
      lower.includes('lat pulldown') ||
      lower.includes('kéo xô') ||
      lower.includes('pulldown') ||
      lower.includes('cable row') ||
      lower.includes('chèo cáp') ||
      lower.includes('seated row') ||
      (lower.includes('kéo cáp') && !lower.includes('tay sau')) ||
      lower.includes('lateral raise') ||
      lower.includes('bay vai') ||
      lower.includes('dang tạ')
    );
  };

  const currentSelectedDay = allDays.find((d) => d.id === selectedDayId) || allDays[0];
  const exercisesToDisplay = activeSession
    ? activeSession.exercises
    : currentSelectedDay?.exercises?.map((e) => ({
        exerciseId: e.id,
        completed: false,
        actualWeightKg: null,
        actualReps: `${e.repsMin}-${e.repsMax}`,
        actualSets: e.sets,
        exercise: e,
      })) || [];

  const completedCount = activeSession ? activeSession.exercises.filter((e) => e.completed).length : 0;
  const totalCount = exercisesToDisplay.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: 18, color: 'var(--text-muted)' }}>Đang tải dữ liệu buổi tập...</div>
      </div>
    );
  }

  return (
    <main className="container">
      {/* Active Session Timer Banner or Day Selection */}
      <section className="hero-card" style={{ borderLeft: activeSession ? '3px solid #10B981' : undefined }}>
        <div className="hero-top">
          <div className="title-area">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              {activeSession ? (
                <>
                  <span className="badge badge-emerald">
                    <span className="pulse-dot" />
                    ĐANG TRONG BUỔI TẬP
                  </span>
                  {new Date(activeSession.date).toDateString() !== new Date().toDateString() && (
                    <span
                      className="badge badge-amber"
                      style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#FBBF24',
                        borderColor: 'rgba(245, 158, 11, 0.35)',
                        gap: 4,
                      }}
                    >
                      <Calendar size={12} />
                      <span>Log Bù ({formatDateVi(activeSession.date)})</span>
                    </span>
                  )}
                </>
              ) : (
                <span className="badge badge-cyan">SẴN SÀNG TẬP LUYỆN</span>
              )}
              <span className="badge badge-purple">
                <Calendar size={12} />
                <span>{currentSelectedDay?.name}</span>
              </span>
            </div>
            <h1>
              {activeSession ? activeSession.workoutDay.name : currentSelectedDay?.name || 'Chọn Ngày Tập'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {activeSession ? activeSession.workoutDay.focus : currentSelectedDay?.focus}
            </p>
          </div>

          {/* Action Button & Timer Display */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            {activeSession ? (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px' }}>
                  Thời Gian Đã Tập
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#34D399', lineHeight: 1.1, margin: '4px 0' }}>
                  {formatDuration(elapsedSeconds)}
                </div>
                <button
                  onClick={handleFinishSession}
                  className="btn btn-danger"
                  style={{ marginTop: 8, padding: '10px 22px' }}
                >
                  <Square size={16} fill="currentColor" />
                  <span>KẾT THÚC BUỔI TẬP</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenStartDialog}
                disabled={!selectedDayId || loading}
                className="btn btn-primary"
                style={{ padding: '12px 26px', fontSize: 15 }}
              >
                <Play size={17} fill="currentColor" />
                <span>BẮT ĐẦU BUỔI TẬP</span>
              </button>
            )}
          </div>
        </div>

        {/* Day Selector (when no active session) */}
        {!activeSession && (
          <div className="tab-group" style={{ marginTop: 14 }}>
            {allDays.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  hapticSelection();
                  setSelectedDayId(d.id);
                }}
                className={`tab-btn ${selectedDayId === d.id ? 'active' : ''}`}
                type="button"
              >
                <strong>T{d.dayOfWeek + 1 === 7 ? '7' : d.dayOfWeek + 1}:</strong>
                <span>{d.name.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>
        )}

        {/* Progress Bar (when session is active) */}
        {activeSession && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
              <span>Tiến độ bài tập: {completedCount}/{totalCount} bài ({progressPercent}%)</span>
              <span style={{ color: '#10B981' }}>{progressPercent === 100 ? 'Đã hoàn thành tất cả! 🏆' : 'Đang nỗ lực...'}</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 9999, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #0284C7, #10B981)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Exercises Tracking List */}
      <section className="day-card">
        <div className="day-header">
          <div className="day-title">
            <span className="day-tag">DANH SÁCH BÀI TẬP</span>
            <div className="day-name">Chi Tiết Từng Bài & Ghi Nhận Mức Tạ</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowWeightGuideModal(true)}
              className="btn btn-secondary"
              style={{
                fontSize: 12,
                padding: '6px 12px',
                color: '#38BDF8',
                borderColor: 'rgba(56, 189, 248, 0.35)',
                background: 'rgba(56, 189, 248, 0.08)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
              title="Xem quy ước ghi số kg cho tạ đơn và thanh tạ đòn"
            >
              <HelpCircle size={14} />
              <span>Quy ước ghi mức tạ</span>
            </button>
            <span className="badge badge-cyan">
              <Clock size={12} />
              Mục tiêu: {currentSelectedDay?.durationMin || 45} phút
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th style={{ width: 55, textAlign: 'center' }}>Check</th>
                <th style={{ width: 45 }}>STT</th>
                <th>Tên Bài Tập</th>
                <th style={{ width: 135, textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span>Mức Tạ (kg)</span>
                    <button
                      type="button"
                      onClick={() => setShowWeightGuideModal(true)}
                      style={{ background: 'none', border: 'none', color: '#38BDF8', cursor: 'pointer', padding: 0, display: 'inline-flex' }}
                      title="Bấm xem quy ước: Tạ đơn ghi 1 quả (Top set). Tạ đòn ghi đòn + bánh 2 bên."
                    >
                      <HelpCircle size={13} />
                    </button>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 400, marginTop: 1 }}>
                    1 bên / Đòn + 2 bên
                  </div>
                </th>
                <th>Hiệp x Reps</th>
                <th>Ngưỡng RIR</th>
                <th>Lưu Ý Kỹ Thuật Sinh Học</th>
                <th style={{ width: 90, textAlign: 'center' }}>Video</th>
                <th style={{ width: 120, textAlign: 'center' }}>AI Coach</th>
              </tr>
            </thead>
            <tbody>
              {exercisesToDisplay.map((item: any, idx: number) => {
                const ex = item.exercise;
                const isDone = item.completed;
                const aiResult = aiCoachResults[ex.id];
                const aiSupported = isAiExercise(ex.nameVi);

                return (
                  <tr
                    key={ex.id}
                    style={{
                      background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleExercise(ex.id, isDone)}
                        disabled={!activeSession}
                        className={`checkbox-custom-btn ${isDone ? 'checked' : ''}`}
                        title={activeSession ? 'Đánh dấu hoàn thành' : 'Bấm Bắt đầu buổi tập trước'}
                        type="button"
                      >
                        {isDone ? <CheckSquare size={22} color="#10B981" /> : <UncheckedSquare size={22} />}
                      </button>
                    </td>

                    <td>
                      <strong style={{ color: isDone ? '#10B981' : '#F8FAFC' }}>
                        {String(ex.orderIndex || idx + 1).padStart(2, '0')}
                      </strong>
                    </td>

                    <td>
                      <span className="exercise-name" style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : '#F8FAFC' }}>
                        {ex.nameVi}
                      </span>
                      <span className="exercise-en">{ex.nameEn} • {ex.equipment}</span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      {activeSession ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <input
                            type="number"
                            step="0.5"
                            placeholder="kg"
                            defaultValue={item.actualWeightKg || ''}
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val)) handleUpdateWeight(ex.id, val);
                            }}
                            className="input-number"
                          />
                        </div>
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>
                          -- kg
                        </span>
                      )}
                    </td>

                    <td>
                      <strong>{ex.sets} hiệp x {ex.repsMin}–{ex.repsMax} reps</strong>
                    </td>

                    <td>
                      <span className="rir-tag">{ex.rir}</span>
                    </td>

                    <td style={{ fontSize: 13, color: 'var(--text-muted)', minWidth: 200, maxWidth: 300 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: 12, lineHeight: 1.4 }}>{ex.techniqueNote}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedTechniqueExercise(ex)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: 'rgba(56, 189, 248, 0.1)',
                            border: '1px solid rgba(56, 189, 248, 0.25)',
                            color: '#38BDF8',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                            width: 'fit-content',
                            transition: 'all 0.15s',
                          }}
                          title="Xem cài đặt ghế, cáp, tư thế, nhịp thở và các lỗi sai chi tiết"
                        >
                          <Sparkles size={11} />
                          <span>ℹ️ Chi tiết kỹ thuật</span>
                        </button>
                      </div>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      {ex.videoUrl && (
                        <a
                          className="btn-link-action"
                          href={ex.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Video size={13} />
                          <span>Video</span>
                        </a>
                      )}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      {aiResult ? (
                        <button
                          type="button"
                          onClick={() => setSelectedAiCoachExercise(ex)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 8px',
                            borderRadius: 8,
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            color: '#34D399',
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                          title="Bấm để tập lại hiệp với AI Coach"
                        >
                          <CheckCircle2 size={12} color="#10B981" />
                          <span>{aiResult.reps} reps ({aiResult.score}%)</span>
                        </button>
                      ) : aiSupported ? (
                        <button
                          type="button"
                          onClick={() => setSelectedAiCoachExercise(ex)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '5px 10px',
                            borderRadius: 8,
                            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(56, 189, 248, 0.25) 100%)',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            color: '#38BDF8',
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          title="Bật camera AI Coach đếm reps & chấm điểm form"
                        >
                          <Sparkles size={12} />
                          <span>AI Coach</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedTechniqueExercise(ex)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            padding: '4px 8px',
                            borderRadius: 6,
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: 'var(--text-dim)',
                            fontSize: 10,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          title="Bài tập giàn cáp/máy - Click để xem hướng dẫn kỹ thuật chuẩn"
                        >
                          <span>ℹ️ Kỹ thuật</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {activeSession && (
          <div style={{ marginTop: 24, padding: '16px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
              📝 Ghi chú buổi tập hôm nay (cảm giác cơ bắp, mức tạ nâng được, v.v.):
            </label>
            <input
              type="text"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="VD: Flat DB press nâng tạ 14kg cảm giác căng ngực rất tốt, RIR chuẩn 2..."
              className="input-field"
            />
          </div>
        )}
      </section>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        sessionData={completedSummary}
      />

      {/* Modern Confirm Dialog for Starting Session (With Log Bù Date Picker) */}
      <ConfirmDialog
        isOpen={showStartConfirm}
        onClose={() => setShowStartConfirm(false)}
        onConfirm={executeStartSession}
        loading={starting}
        title="Bắt Đầu Buổi Tập Mới"
        message={
          <div>
            <div>
              Bạn chuẩn bị bắt đầu tập giáo án:{' '}
              <strong style={{ color: '#F8FAFC' }}>{currentSelectedDay?.name}</strong>
            </div>

            <div
              style={{
                marginTop: 10,
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 10,
                color: '#6EE7B7',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <div>🎯 <strong>Nhóm cơ:</strong> {currentSelectedDay?.focus}</div>
              <div style={{ marginTop: 4 }}>📋 <strong>Số lượng:</strong> {exercisesToDisplay.length} bài tập</div>
            </div>

            {/* Choose Date to Log / Log Bù */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#38BDF8' }}>
                <Calendar size={14} />
                <span>Ngày ghi nhận buổi tập:</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setTargetDateOption('TODAY')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: targetDateOption === 'TODAY' ? '1.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: targetDateOption === 'TODAY' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: targetDateOption === 'TODAY' ? '#34D399' : 'var(--text-muted)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>🟢 Hôm nay</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{formatDateVi(new Date())}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetDateOption('YESTERDAY')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: targetDateOption === 'YESTERDAY' ? '1.5px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: targetDateOption === 'YESTERDAY' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                    color: targetDateOption === 'YESTERDAY' ? '#FBBF24' : 'var(--text-muted)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>🟡 Hôm qua (Log bù)</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                    {(() => {
                      const y = new Date();
                      y.setDate(y.getDate() - 1);
                      return formatDateVi(y);
                    })()}
                  </div>
                </button>
              </div>

              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setTargetDateOption('CUSTOM')}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: 8,
                    border: targetDateOption === 'CUSTOM' ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: targetDateOption === 'CUSTOM' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    color: targetDateOption === 'CUSTOM' ? '#38BDF8' : 'var(--text-dim)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>📅 Chọn ngày khác...</span>
                  {targetDateOption === 'CUSTOM' && customDateValue && <span>{customDateValue}</span>}
                </button>

                {targetDateOption === 'CUSTOM' && (
                  <input
                    type="date"
                    value={customDateValue}
                    onChange={(e) => setCustomDateValue(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', marginTop: 6, fontSize: 13, padding: '6px 10px' }}
                  />
                )}
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>
              ⏱️ Sau khi bấm bắt đầu, bạn hãy tích hoàn thành các bài và ghi số kg tạ đạt được.
            </div>
          </div>
        }
        confirmText={targetDateOption === 'TODAY' ? 'Sẵn Sàng, Bắt Đầu!' : 'Bắt Đầu (Log Bù)'}
        cancelText="Để sau / Đổi ngày"
        variant={targetDateOption === 'TODAY' ? 'success' : 'warning'}
        icon={<Dumbbell size={22} />}
      />

      {/* Modern Confirm Dialog for Finishing Session */}
      <ConfirmDialog
        isOpen={showFinishConfirm}
        onClose={() => setShowFinishConfirm(false)}
        onConfirm={executeFinishSession}
        loading={finishing}
        title="Kết Thúc Buổi Tập"
        message={
          <div>
            <div>
              Bạn có chắc chắn muốn kết thúc buổi tập này không? Tiến độ các bài tập và mức tạ đã ghi nhận sẽ được lưu vào lịch sử.
            </div>
            <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#38BDF8', marginBottom: 6 }}>
                ⏱️ Thời lượng buổi tập (phút):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={finishDurationMin}
                  onChange={(e) => setFinishDurationMin(Number(e.target.value))}
                  className="input-field"
                  style={{ width: 100, fontSize: 16, fontWeight: 700, fontFamily: 'JetBrains Mono', textAlign: 'center' }}
                />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>phút (tùy chỉnh nếu log bù)</span>
              </div>
              {finishDurationMin < 3 && (
                <div style={{
                  marginTop: 8,
                  padding: '8px 10px',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#FBBF24',
                  lineHeight: 1.5,
                }}>
                  ⚠️ Thời gian tập rất ngắn ({finishDurationMin} phút). Hãy kiểm tra lại hoặc chỉnh tay nếu cần.
                </div>
              )}
            </div>
          </div>
        }
        confirmText="Hoàn thành buổi tập"
        cancelText="Tiếp tục tập"
        variant="primary"
        icon={<Clock size={24} />}
      />

      {/* Weight Guide Modal */}
      <WeightGuideModal
        isOpen={showWeightGuideModal}
        onClose={() => setShowWeightGuideModal(false)}
      />

      {/* Biomechanical Technique Detail Modal */}
      <TechniqueDetailModal
        isOpen={Boolean(selectedTechniqueExercise)}
        onClose={() => setSelectedTechniqueExercise(null)}
        exercise={selectedTechniqueExercise}
      />

      {/* AI Coach Inline Modal */}
      <AiCoachInlineModal
        isOpen={Boolean(selectedAiCoachExercise)}
        onClose={() => setSelectedAiCoachExercise(null)}
        exercise={selectedAiCoachExercise}
        sessionExerciseId={
          activeSession?.exercises?.find((se: any) => se.exerciseId === selectedAiCoachExercise?.id)?.id
        }
        onSaveResult={(reps, score) => {
          if (selectedAiCoachExercise) {
            handleSaveAiCoachResult(selectedAiCoachExercise.id, reps, score);
          }
        }}
      />
    </main>
  );
}
