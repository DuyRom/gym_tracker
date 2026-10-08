'use client';

import { X, HelpCircle, Dumbbell, ShieldCheck, Info } from 'lucide-react';

interface WeightGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WeightGuideModal({ isOpen, onClose }: WeightGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 1100 }}
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{
          maxWidth: 520,
          background: '#0B101C',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 30px rgba(56, 189, 248, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="weight-guide-title"
      >
        <div style={{ padding: '22px 24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HelpCircle size={22} />
              </div>
              <div>
                <h3 id="weight-guide-title" style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                  Quy Ước Ghi Mức Tạ (Chuẩn Gym)
                </h3>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                  Theo chuẩn quốc tế (Strong, Hevy, IPF)
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
              }}
              title="Đóng"
            >
              <X size={18} />
            </button>
          </div>

          {/* Guide items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 1. Tạ Đơn */}
            <div
              style={{
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38BDF8', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                <Dumbbell size={16} />
                <span>1. Cặp Tạ Đơn (Dumbbell)</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>
                <li>
                  <strong>Chỉ ghi số kg của 1 quả tạ</strong> (KHÔNG cộng dồn hai tay).
                  <br />
                  <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>
                    VD: Bạn cầm 2 quả tạ 10kg để đẩy ngực ➔ Ghi <strong>10 kg</strong>.
                  </span>
                </li>
                <li style={{ marginTop: 4 }}>
                  <strong>Khi 3 hiệp tạ tăng dần (5kg ➔ 7.5kg ➔ 10kg):</strong>
                  <br />
                  Ghi mức tạ của <strong>Hiệp nặng nhất (Top Set) = 10 kg</strong>!
                  <br />
                  <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>
                    💡 <em>Lý do:</em> Top set là hiệp quyết định kích thích cơ bắp (Progressive Overload). Các hiệp 5kg, 7.5kg là hiệp khởi động/làm quen. Bạn có thể note thêm vào ô ghi chú: "5 / 7.5 / 10".
                  </span>
                </li>
              </ul>
            </div>

            {/* 2. Thanh Tạ Đòn */}
            <div
              style={{
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34D399', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                <ShieldCheck size={16} />
                <span>2. Thanh Tạ Đòn (Barbell)</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>
                <li>
                  <strong>LUÔN LUÔN TÍNH CẢ TRỌNG LƯỢNG THANH ĐÒN</strong>!
                  <br />
                  <span style={{ color: '#FCD34D', fontSize: 12, fontWeight: 600 }}>
                    Tổng mức tạ = Đòn (20kg) + Bánh bên trái + Bánh bên phải
                  </span>
                </li>
                <li style={{ marginTop: 4 }}>
                  <strong>Ví dụ cụ thể:</strong>
                  <br />
                  Thanh đòn tiêu chuẩn 20kg, bạn lắp mỗi bên bánh 5kg:
                  <br />
                  👉 <strong>Ghi vào app: 20 + 5 + 5 = 30 kg</strong>!
                  <br />
                  <span style={{ color: '#F87171', fontSize: 12 }}>
                    ❌ Tuyệt đối không ghi 5kg hay 10kg.
                  </span>
                </li>
              </ul>
            </div>

            {/* 3. Máy Khối & Cáp */}
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A78BFA', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                <Info size={15} />
                <span>3. Máy Tạ Khối (Machine) & Cáp (Cable)</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Ghi đúng con số trên chốt cắm tạ của máy. Nếu máy có đánh số nấc (VD: nấc 5 = 25kg) thì ghi số kg tương ứng.
              </div>
            </div>
          </div>

          {/* Button Close */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: 13 }}
              onClick={onClose}
            >
              Đã hiểu, đóng lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
