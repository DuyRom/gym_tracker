'use client';

import React, { useState } from 'react';
import {
  X,
  Settings,
  Layers,
  AlertTriangle,
  Wind,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Sliders,
  Compass,
  Target,
} from 'lucide-react';
import {
  BiomechanicalTechniqueDetail,
  findTechniqueDetail,
} from '@/data/exercise-technique-details';

interface TechniqueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    id?: string;
    nameVi: string;
    nameEn?: string;
    equipment?: string;
    techniqueNote?: string;
    videoUrl?: string | null;
  } | null;
}

export default function TechniqueDetailModal({
  isOpen,
  onClose,
  exercise,
}: TechniqueDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'purpose' | 'setup' | 'execution' | 'mistakes' | 'breathing'>('purpose');

  if (!isOpen || !exercise) return null;

  const detail: BiomechanicalTechniqueDetail | null =
    findTechniqueDetail(exercise.nameVi) ||
    (exercise.nameEn ? findTechniqueDetail(exercise.nameEn) : null);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 680,
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface-primary, #0f172a)',
          borderRadius: 20,
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38BDF8',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Sparkles size={12} /> HƯỚNG DẪN KỸ THUẬT SINH HỌC
                </span>
                {detail && (
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {detail.category}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F8FAFC', margin: '0 0 4px 0' }}>
                {exercise.nameVi}
              </h2>
              <div style={{ fontSize: 13, color: 'var(--text-muted, #94A3B8)' }}>
                {exercise.nameEn || detail?.nameEn} • {exercise.equipment || detail?.equipment}
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#94A3B8',
                width: 36,
                height: 36,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#F8FAFC';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 16,
              overflowX: 'auto',
              paddingBottom: 2,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('purpose')}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'purpose' ? '#A855F7' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === 'purpose' ? '#FFFFFF' : '#94A3B8',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <Target size={14} /> Mục Đích
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('setup')}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'setup' ? '#38BDF8' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === 'setup' ? '#0F172A' : '#94A3B8',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <Sliders size={14} /> Cài Đặt Thiết Bị
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('execution')}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'execution' ? '#38BDF8' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === 'execution' ? '#0F172A' : '#94A3B8',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <Layers size={14} /> Các Bước Động Tác
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mistakes')}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'mistakes' ? '#EF4444' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === 'mistakes' ? '#FFFFFF' : '#94A3B8',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <AlertTriangle size={14} /> Lỗi Thường Gặp
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('breathing')}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'breathing' ? '#10B981' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === 'breathing' ? '#0F172A' : '#94A3B8',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <Wind size={14} /> Nhịp Thở & Tempo
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div
          style={{
            padding: 24,
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Quick Note Summary */}
          {exercise.techniqueNote && (
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: 'rgba(56, 189, 248, 0.07)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              <Compass size={20} color="#38BDF8" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#38BDF8', marginBottom: 2 }}>
                  TÓM TẮT TRỌNG TÂM:
                </div>
                <div style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.5 }}>
                  {exercise.techniqueNote}
                </div>
              </div>
            </div>
          )}

          {/* TAB 0: MỤC ĐÍCH BÀI TẬP */}
          {activeTab === 'purpose' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {detail?.exercisePurpose ? (
                <>
                  {/* Goal Card */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
                      borderRadius: 14,
                      padding: 18,
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#C084FC',
                        marginBottom: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Target size={16} /> MỤC ĐÍCH BÀI TẬP:
                    </h3>
                    <p style={{ fontSize: 14, color: '#F1F5F9', lineHeight: 1.7, margin: 0 }}>
                      {detail.exercisePurpose.goal}
                    </p>
                  </div>

                  {/* Target Muscles */}
                  <div
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: 14,
                      padding: 18,
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#F59E0B',
                        marginBottom: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      💪 NHÓM CƠ MỤC TIÊU:
                    </h3>

                    {/* Primary */}
                    <div style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 8,
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#F87171',
                          fontSize: 11,
                          fontWeight: 700,
                          marginBottom: 8,
                        }}
                      >
                        🎯 CƠ CHÍNH (Primary)
                      </div>
                      <div style={{ fontSize: 14, color: '#F1F5F9', fontWeight: 600, paddingLeft: 8 }}>
                        {detail.exercisePurpose.primaryMuscleGroup}
                      </div>
                    </div>

                    {/* Secondary */}
                    <div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 8,
                          background: 'rgba(56, 189, 248, 0.12)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          color: '#38BDF8',
                          fontSize: 11,
                          fontWeight: 700,
                          marginBottom: 8,
                        }}
                      >
                        🔗 CƠ PHỤ (Secondary)
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 8 }}>
                        {detail.exercisePurpose.secondaryMuscleGroups.map((m: string, i: number) => (
                          <span
                            key={i}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 8,
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#CBD5E1',
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Movement Pattern + Benefit */}
                  <div
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: 14,
                      padding: 18,
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 8,
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#34D399',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        ⚡ {detail.exercisePurpose.movementPattern}
                      </span>
                    </div>

                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#10B981', marginBottom: 8 }}>
                      LỢI ÍCH:
                    </h4>
                    <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.6, margin: 0 }}>
                      {detail.exercisePurpose.benefit}
                    </p>
                  </div>

                  {/* Suitable For */}
                  <div
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>👤</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>
                        PHÙ HỢP VỚI:
                      </div>
                      <div style={{ fontSize: 13, color: '#FDE68A', lineHeight: 1.5 }}>
                        {detail.exercisePurpose.suitableFor}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 14, color: 'var(--text-dim)', textAlign: 'center', padding: '30px 0' }}>
                  Chưa có thông tin mục đích cho bài tập này.
                </div>
              )}
            </div>
          )}

          {/* TAB 1: SETUP THIẾT BỊ & TƯ THẾ */}
          {activeTab === 'setup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {detail?.equipmentSetup ? (
                <div
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: 14,
                    padding: 18,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#38BDF8',
                      marginBottom: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Settings size={16} /> CÀI ĐẶT THIẾT BỊ CHO NGƯỜI MỚI:
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {detail.equipmentSetup.cableSetting && (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', minWidth: 120 }}>
                          ⚙️ Ròng rọc cáp:
                        </span>
                        <span style={{ fontSize: 13, color: '#F1F5F9' }}>
                          {detail.equipmentSetup.cableSetting}
                        </span>
                      </div>
                    )}

                    {detail.equipmentSetup.benchSetting && (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', minWidth: 120 }}>
                          🪑 Ghế ngồi:
                        </span>
                        <span style={{ fontSize: 13, color: '#F1F5F9' }}>
                          {detail.equipmentSetup.benchSetting}
                        </span>
                      </div>
                    )}

                    {detail.equipmentSetup.attachment && (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', minWidth: 120 }}>
                          🔗 Phụ kiện / Tay:
                        </span>
                        <span style={{ fontSize: 13, color: '#F1F5F9' }}>
                          {detail.equipmentSetup.attachment}
                        </span>
                      </div>
                    )}

                    {detail.equipmentSetup.padPosition && (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', minWidth: 120 }}>
                          🦶 Đệm tì / Chân:
                        </span>
                        <span style={{ fontSize: 13, color: '#F1F5F9' }}>
                          {detail.equipmentSetup.padPosition}
                        </span>
                      </div>
                    )}

                    {detail.equipmentSetup.distance && (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', minWidth: 120 }}>
                          📏 Cự ly / Khoảng cách:
                        </span>
                        <span style={{ fontSize: 13, color: '#F1F5F9' }}>
                          {detail.equipmentSetup.distance}
                        </span>
                      </div>
                    )}

                    {detail.equipmentSetup.weightSelectionAdvice && (
                      <div
                        style={{
                          marginTop: 6,
                          padding: '10px 14px',
                          borderRadius: 8,
                          background: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          fontSize: 12,
                          color: '#FCD34D',
                        }}
                      >
                        💡 <strong>Khuyên chọn tạ:</strong> {detail.equipmentSetup.weightSelectionAdvice}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Tư thế chuẩn bị ban đầu */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: 14,
                  padding: 18,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#34D399',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <CheckCircle2 size={16} /> TƯ THẾ CHUẨN BỊ BAN ĐẦU (STARTING POSTURE):
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {detail?.startingPosture ? (
                    detail.startingPosture.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span
                          style={{
                            background: 'rgba(52, 211, 153, 0.15)',
                            color: '#34D399',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 13, color: '#94A3B8' }}>
                      Chuẩn bị tư thế lưng thẳng, gồng nhẹ cơ bụng và khóa chặt khớp xương bả vai.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CÁC BƯỚC ĐỘNG TÁC CHI TIẾT */}
          {activeTab === 'execution' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {detail?.executionSteps ? (
                detail.executionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      borderRadius: 14,
                      padding: 16,
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#38BDF8',
                        marginBottom: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Layers size={15} /> {step.phase}
                    </div>
                    <div style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.6, marginBottom: 8 }}>
                      {step.description}
                    </div>
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: 'rgba(56, 189, 248, 0.1)',
                        fontSize: 12,
                        color: '#7DD3FC',
                        fontWeight: 600,
                      }}
                    >
                      🧠 <em>Khẩu lệnh sinh học (Cue):</em> &quot;{step.cue}&quot;
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94A3B8', fontSize: 13 }}>
                  Thực hiện động tác với biên độ chuyển động toàn diện, có kiểm soát tốc độ hạ tạ.
                </div>
              )}

              {detail?.biomechanicalCue && (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    fontSize: 13,
                    color: '#E9D5FF',
                    lineHeight: 1.5,
                  }}
                >
                  ⚡ <strong>Bí quyết liên kết Thần kinh - Cơ (Mind-Muscle Connection):</strong>{' '}
                  {detail.biomechanicalCue}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LỖI THƯỜNG GẶP & CÁCH SỬA */}
          {activeTab === 'mistakes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {detail?.commonMistakes && detail.commonMistakes.length > 0 ? (
                detail.commonMistakes.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(239, 68, 68, 0.06)',
                      borderRadius: 14,
                      padding: 16,
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#F87171',
                        marginBottom: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <AlertTriangle size={16} /> Lỗi {idx + 1}: {m.mistake}
                    </div>

                    <div style={{ fontSize: 12, color: '#FCA5A5', marginBottom: 8 }}>
                      ⚠️ <strong>Tác hại / Nguy cơ:</strong> {m.consequence}
                    </div>

                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        fontSize: 13,
                        color: '#6EE7B7',
                        fontWeight: 600,
                      }}
                    >
                      ✅ <strong>Cách sửa tức thì:</strong> {m.fix}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94A3B8', fontSize: 13 }}>
                  Tránh dùng quán tính giật tạ và giữ thắt lưng thẳng tự nhiên suốt hiệp tập.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NHỊP THỞ, TEMPO & AN TOÀN */}
          {activeTab === 'breathing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {detail?.breathingAndTempo && (
                <div
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    borderRadius: 14,
                    padding: 18,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#10B981',
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Wind size={16} /> QUY TẮC NHỊP THỞ SINH HỌC:
                  </h3>
                  <div style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.6, marginBottom: 12 }}>
                    {detail.breathingAndTempo.breathing}
                  </div>

                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#34D399', marginBottom: 4 }}>
                      ⏱️ TEMPO CHUẨN (NHỊP ĐẾM GIÂY):
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#F8FAFC',
                        fontFamily: 'JetBrains Mono, monospace',
                        marginBottom: 4,
                      }}
                    >
                      {detail.breathingAndTempo.tempo}
                    </div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>
                      {detail.breathingAndTempo.explanation}
                    </div>
                  </div>
                </div>
              )}

              {/* Safety warning */}
              {detail?.safetyWarning && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderRadius: 14,
                    padding: 16,
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#EF4444',
                      marginBottom: 6,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <ShieldAlert size={16} /> CẢNH BÁO BẢO VỆ KHỚP:
                  </div>
                  <div style={{ fontSize: 13, color: '#FCA5A5', lineHeight: 1.5 }}>
                    {detail.safetyWarning}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.95)',
          }}
        >
          {exercise.videoUrl ? (
            <a
              href={exercise.videoUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: '#38BDF8',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(56, 189, 248, 0.1)',
              }}
            >
              <span>Xem Video Kỹ Thuật YouTube</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              background: '#38BDF8',
              color: '#0F172A',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
