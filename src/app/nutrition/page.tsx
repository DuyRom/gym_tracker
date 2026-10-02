'use client';

import { useState } from 'react';
import { Utensils, Zap, Apple, Droplet, Calculator } from 'lucide-react';

export default function NutritionPage() {
  const [weightKg, setWeightKg] = useState<number>(60);

  // Macro calculation based on weight
  const proteinMin = Math.round(weightKg * 1.8);
  const proteinMax = Math.round(weightKg * 2.0);
  const carbMin = Math.round(weightKg * 4.0);
  const carbMax = Math.round(weightKg * 5.5);
  const fatMin = Math.round(weightKg * 0.8);
  const fatMax = Math.round(weightKg * 1.0);
  const estCalories = Math.round(weightKg * 38);

  const meals = [
    {
      time: '07:30',
      title: 'Bữa Sáng (Khởi động năng lượng)',
      menu: '1 tô phở/hủ tiếu nhiều thịt bò + 1 quả trứng chần + 1 hộp sữa tươi nguyên kem (180ml).',
      calories: '~550 kcal',
      highlight: false,
    },
    {
      time: '11:45',
      title: 'Bữa Trưa (Nạp lại Glycogen sau giờ làm)',
      menu: '2 bát cơm trắng đầy + 150g thịt kho/gà áp chảo/cá + 1 tô canh rau + 1 quả chuối tiêu.',
      calories: '~700 kcal',
      highlight: false,
    },
    {
      time: '16:15',
      title: 'Phụ Trước Tập (BẮT BUỘC 45 PHÚT TRƯỚC TẬP)',
      menu: '1 quả chuối tiêu + 1 hộp sữa chua (hoặc 1 lát bánh mì bơ đậu phộng) + 250ml nước lọc.',
      calories: '~250 kcal',
      highlight: true,
      tag: 'Chống hạ đường huyết & choáng váng',
    },
    {
      time: '19:30',
      title: 'Bữa Tối (Đồng hóa & xây dựng cơ bắp)',
      menu: '2 bát cơm trắng + 150g thịt bò xào ớt chuông hoặc tôm rim + đĩa rau luộc + canh rau.',
      calories: '~650 kcal',
      highlight: false,
    },
    {
      time: '22:15',
      title: 'Phụ Đêm Nhẹ (Nuôi cơ khi ngủ)',
      menu: '1 ly sữa ấm 200ml hoặc 1 hộp sữa chua.',
      calories: '~150 kcal',
      highlight: false,
    },
  ];

  return (
    <main className="container">
      {/* Header Banner */}
      <section className="hero-card">
        <div className="title-area">
          <div className="badge-group" style={{ marginBottom: 8 }}>
            <span className="badge badge-cyan">THẶNG DƯ CALO (CALORIC SURPLUS)</span>
            <span className="badge badge-emerald">ĐỒNG HÓA CƠ BẮP</span>
          </div>
          <h1>Chiến Lược Dinh Dưỡng & Macro Tăng Cơ Cho Dân IT</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 680 }}>
            Cơ bắp không phát triển trong phòng tập; phòng gym chỉ tạo ra kích thích vi mô. Quá trình phì đại cơ (Hypertrophy) diễn ra khi bạn cung cấp đủ năng lượng thặng dư và đạm chất lượng cao.
          </p>
        </div>
      </section>

      {/* Interactive Macro Calculator */}
      <section className="day-card" style={{ borderLeft: '4px solid #06B6D4' }}>
        <div className="day-header">
          <div className="day-title">
            <span className="day-tag">TÍNH TOÁN CÁ NHÂN HÓA</span>
            <div className="day-name">Tính Toán Lượng Macro Theo Cân Nặng Hiện Tại</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Cân nặng của bạn:</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Math.max(35, Math.min(150, parseFloat(e.target.value) || 50)))}
              className="input-number"
              style={{ width: 80, fontSize: 15 }}
            />
            <span style={{ fontSize: 14, color: '#67E8F9', fontWeight: 700 }}>kg</span>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-box" style={{ borderLeft: '3px solid #38BDF8' }}>
            <span className="stat-label">Tổng Calo Mục Tiêu</span>
            <span className="stat-val" style={{ color: '#38BDF8' }}>
              ~{estCalories} <small>kcal/ngày</small>
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Duy trì thặng dư +300 đến +400 kcal</span>
          </div>

          <div className="stat-box" style={{ borderLeft: '3px solid #34D399' }}>
            <span className="stat-label">Chất Đạm (Protein)</span>
            <span className="stat-val" style={{ color: '#34D399' }}>
              {proteinMin}–{proteinMax} <small>g/ngày</small>
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>1.8 – 2.0g / kg thể trọng</span>
          </div>

          <div className="stat-box" style={{ borderLeft: '3px solid #FBBF24' }}>
            <span className="stat-label">Tinh Bột (Carbohydrate)</span>
            <span className="stat-val" style={{ color: '#FBBF24' }}>
              {carbMin}–{carbMax} <small>g/ngày</small>
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Nạp Glycogen dự trữ cơ bắp</span>
          </div>

          <div className="stat-box" style={{ borderLeft: '3px solid #F472B6' }}>
            <span className="stat-label">Chất Béo Tốt (Fat)</span>
            <span className="stat-val" style={{ color: '#F472B6' }}>
              {fatMin}–{fatMax} <small>g/ngày</small>
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Dầu ô liu, lòng đỏ trứng, quả bơ</span>
          </div>
        </div>
      </section>

      {/* 5-Meal Program */}
      <section className="day-card">
        <div className="day-header">
          <div className="day-title">
            <span className="day-tag">THỰC ĐƠN 5 BỮA</span>
            <div>
              <div className="day-name">Lịch Ăn Uống Mẫu Chuẩn Cho Dân IT Công Sở</div>
              <div className="day-focus">Chia nhỏ năng lượng giúp dạ dày dễ hấp thu, không bị đầy bụng hay buồn ngủ khi code</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {meals.map((m, idx) => (
            <div
              key={idx}
              className="stat-box"
              style={{
                background: m.highlight ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                border: m.highlight ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 14,
                      fontWeight: 800,
                      color: m.highlight ? '#38BDF8' : '#67E8F9',
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '3px 8px',
                      borderRadius: 6,
                    }}
                  >
                    {m.time}
                  </span>
                  <strong style={{ fontSize: 15, color: '#fff' }}>{m.title}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {m.tag && (
                    <span className="badge badge-cyan" style={{ fontSize: 11 }}>
                      {m.tag}
                    </span>
                  )}
                  <span className="badge" style={{ fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                    {m.calories}
                  </span>
                </div>
              </div>

              <p style={{ color: '#E2E8F0', fontSize: 13, lineHeight: 1.6 }}>{m.menu}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
