'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  CheckCircle2,
  Headphones,
  Sun,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  EXERCISE_SETUP_PRESETS,
  ExercisePresetGuide,
  getPresetForExercise,
} from '@/lib/ai-coach/framing-evaluator';
import { hapticSuccess, hapticSelection } from '@/lib/native-bridge';

export const CAMERA_GUIDE_DISMISSED_KEY = 'gym_ai_camera_guide_dismissed_v1';

interface CameraSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExerciseKey?: string;
  onStart?: () => void;
}

export default function CameraSetupGuideModal({
  isOpen,
  onClose,
  currentExerciseKey = 'squat',
  onStart,
}: CameraSetupGuideModalProps) {
  const initialPreset = getPresetForExercise(currentExerciseKey);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPreset.id);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  // Sync tab with current exercise key whenever modal opens or exercise changes
  useEffect(() => {
    if (isOpen) {
      const match = getPresetForExercise(currentExerciseKey);
      setSelectedPresetId(match.id);
    }
  }, [isOpen, currentExerciseKey]);

  if (!isOpen) return null;

  const currentPreset: ExercisePresetGuide =
    EXERCISE_SETUP_PRESETS.find((p) => p.id === selectedPresetId) ||
    EXERCISE_SETUP_PRESETS[0];

  const handleConfirm = () => {
    hapticSuccess();
    if (dontShowAgain) {
      try {
        localStorage.setItem(CAMERA_GUIDE_DISMISSED_KEY, 'true');
      } catch {}
    }
    onClose();
    if (onStart) {
      onStart();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 10000,
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '92vh',
          backgroundColor: '#090d16',
          borderRadius: 20,
          border: '1px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInModal 0.2s ease-out',
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
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
                color: '#fff',
              }}
            >
              <Camera size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  HƯỚNG DẪN ĐẶT CAMERA
                </h3>
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38BDF8',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  Góc Chuẩn AI
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>
                Căn chỉnh góc quay để AI đếm rep và chấm form chính xác nhất
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#94A3B8',
              width: 32,
              height: 32,
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

        {/* Scrollable Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Preset Selector Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
            }}
          >
            {EXERCISE_SETUP_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                    hapticSelection();
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: isSelected
                      ? '1px solid #38BDF8'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected
                      ? 'rgba(56, 189, 248, 0.15)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#38BDF8' : '#94A3B8',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>
                    {preset.id === 'full_body' && '🏋️‍♂️ Chân & Toàn thân'}
                    {preset.id === 'upper_standing' && '💪 Thân trên đứng'}
                    {preset.id === 'floor_core' && '⚡ Hít đất (Sàn)'}
                    {preset.id === 'cable_machine' && '🦅 Máy kéo cáp'}
                  </div>
                  <div style={{ fontSize: 10, color: isSelected ? '#BAE6FD' : '#64748B' }}>
                    {preset.distance} • {preset.angle.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Visual Interactive Illustration (SVG Drawing) */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(8, 12, 22, 0.95) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: 14,
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background Grid Pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                pointerEvents: 'none',
              }}
            />

            {/* SVG Diagram Canvas */}
            <svg
              viewBox="0 0 460 160"
              style={{ width: '100%', maxHeight: 150, zIndex: 1 }}
            >
              <defs>
                {/* Camera Beam Gradient */}
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.03" />
                </linearGradient>
                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Floor baseline */}
              <line
                x1="40"
                y1="135"
                x2="420"
                y2="135"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Phone on Mount / Tripod / Kettlebell */}
              <g transform="translate(60, 60)">
                {/* Prop / Stand */}
                {selectedPresetId === 'floor_core' ? (
                  // Plate on floor
                  <ellipse cx="10" cy="72" rx="14" ry="4" fill="#334155" />
                ) : selectedPresetId === 'full_body' ? (
                  // Kettlebell base
                  <path
                    d="M3 65 C3 55, 17 55, 17 65 L19 74 L1 74 Z"
                    fill="#334155"
                  />
                ) : (
                  // Dumbbell rack / Stand
                  <line x1="10" y1="40" x2="10" y2="74" stroke="#475569" strokeWidth="3" />
                )}

                {/* Phone Body */}
                <rect
                  x="4"
                  y={selectedPresetId === 'floor_core' ? '52' : '22'}
                  width="12"
                  height="22"
                  rx="3"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  filter="url(#glow)"
                />
                {/* Camera Lens dot */}
                <circle
                  cx="10"
                  cy={selectedPresetId === 'floor_core' ? '56' : '26'}
                  r="1.5"
                  fill="#fff"
                />

                {/* Height Label */}
                <text
                  x="10"
                  y="90"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontWeight="600"
                >
                  {selectedPresetId === 'floor_core'
                    ? 'Sát sàn'
                    : selectedPresetId === 'full_body'
                    ? 'Cao 60-80cm'
                    : 'Cao 1m-1.2m'}
                </text>
              </g>

              {/* Vision Cone (FOV Field of View) */}
              <polygon
                points={
                  selectedPresetId === 'floor_core'
                    ? '76,118 360,25 360,135'
                    : '76,88 360,18 360,135'
                }
                fill="url(#beamGrad)"
              />

              {/* Distance Arrow and Meter indicator */}
              <line
                x1="82"
                y1="145"
                x2="350"
                y2="145"
                stroke="#38bdf8"
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
              />
              <circle cx="82" cy="145" r="2.5" fill="#38bdf8" />
              <circle cx="350" cy="145" r="2.5" fill="#38bdf8" />
              <rect
                x="180"
                y="136"
                width="80"
                height="18"
                rx="4"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1"
              />
              <text
                x="220"
                y="149"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="10"
                fontWeight="700"
              >
                {currentPreset.distance}
              </text>

              {/* Athlete Silhouette / Skeleton Figure */}
              {selectedPresetId === 'floor_core' ? (
                // Push-up position
                <g transform="translate(260, 95)">
                  {/* Head */}
                  <circle cx="20" cy="18" r="6" fill="#10b981" />
                  {/* Body spine */}
                  <line x1="26" y1="20" x2="85" y2="28" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  {/* Arms */}
                  <line x1="38" y1="22" x2="38" y2="40" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  {/* Legs & Feet */}
                  <line x1="85" y1="28" x2="95" y2="39" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  {/* OK Checkmark Badge */}
                  <circle cx="50" cy="2" r="7" fill="#10b981" />
                  <path d="M47 2 L49 4 L53 0" stroke="#fff" strokeWidth="1.5" fill="none" />
                </g>
              ) : selectedPresetId === 'full_body' ? (
                // Squat figure
                <g transform="translate(340, 40)">
                  {/* Head */}
                  <circle cx="15" cy="12" r="7" fill="#10b981" />
                  {/* Torso */}
                  <line x1="15" y1="20" x2="15" y2="52" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  {/* Arms holding weight */}
                  <line x1="15" y1="26" x2="25" y2="35" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <line x1="25" y1="35" x2="18" y2="45" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  {/* Legs */}
                  <line x1="15" y1="52" x2="5" y2="70" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="5" y1="70" x2="8" y2="95" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="15" y1="52" x2="25" y2="70" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="25" y1="70" x2="22" y2="95" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Feet */}
                  <line x1="8" y1="95" x2="0" y2="95" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <line x1="22" y1="95" x2="30" y2="95" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  {/* Full body bracket */}
                  <path d="M-8 8 L-14 8 L-14 96 L-8 96" stroke="#38bdf8" strokeWidth="1" fill="none" />
                  <text x="-18" y="55" fill="#38bdf8" fontSize="8" textAnchor="end">Trọn người</text>
                </g>
              ) : (
                // Standing Upper / Machine figure
                <g transform="translate(340, 35)">
                  {/* Head */}
                  <circle cx="15" cy="12" r="7" fill="#10b981" />
                  {/* Torso */}
                  <line x1="15" y1="20" x2="15" y2="58" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  {/* Arms curling */}
                  <line x1="15" y1="26" x2="26" y2="38" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <line x1="26" y1="38" x2="16" y2="34" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  {/* Dumbbell */}
                  <rect x="12" y="30" width="8" height="4" rx="1" fill="#f59e0b" />
                  {/* Legs */}
                  <line x1="15" y1="58" x2="10" y2="100" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                  <line x1="15" y1="58" x2="20" y2="100" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                </g>
              )}
            </svg>

            {/* Subtitle tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 4,
                fontSize: 11,
                color: '#38BDF8',
                fontWeight: 600,
                zIndex: 1,
              }}
            >
              <Sparkles size={13} />
              <span>{currentPreset.idealFramingText}</span>
            </div>
          </div>

          {/* Quick Specifications (3 Info Cards) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '10px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Khoảng cách</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#38BDF8' }}>
                {currentPreset.distance}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '10px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Góc quay</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#34D399' }}>
                {currentPreset.angle.split(' ')[0]} {currentPreset.angle.split(' ')[1] || ''}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '10px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Độ cao máy</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#F8FAFC' }}>
                {currentPreset.height.split('(')[0]}
              </div>
            </div>
          </div>

          {/* Practical Gym Hacks */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 12,
              padding: '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} color="#38BDF8" />
              <span>MẸO THỰC TẾ TRONG PHÒNG GYM</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: '#CBD5E1' }}>
              <Smartphone size={14} color="#34D399" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                <strong>Điểm tựa điện thoại:</strong> {currentPreset.gymTip}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: '#CBD5E1' }}>
              <Headphones size={14} color="#38BDF8" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                <strong>Đeo tai nghe Bluetooth:</strong> Vừa nghe nhạc vừa nghe AI Coach đếm rep rõ ràng mà không làm ồn xung quanh.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: '#CBD5E1' }}>
              <Sun size={14} color="#FBBF24" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                <strong>Ánh sáng:</strong> Tránh đứng quay lưng vào bóng đèn rọi thẳng vào camera để AI bắt xương khớp rõ nhất.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 15, 30, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {/* Checkbox: Don't show again */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: '#94A3B8',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              style={{
                width: 16,
                height: 16,
                accentColor: '#38BDF8',
                cursor: 'pointer',
              }}
            />
            <span>Không hiện lại lần sau</span>
          </label>

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
              color: '#04111D',
              fontWeight: 800,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
          >
            <span>Vào Tập Ngay</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
