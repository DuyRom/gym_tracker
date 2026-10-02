'use client';

import { useState } from 'react';
import { Eye, X, ZoomIn, Info } from 'lucide-react';

interface GalleryItem {
  imgSrc: string;
  title: string;
  subtitle: string;
  desc: string;
  keyPoints: string[];
}

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const items: GalleryItem[] = [
    {
      imgSrc: '/images/rdl_form.jpg',
      title: 'Dumbbell Romanian Deadlift (RDL)',
      subtitle: 'Bản lề hông (Hip Hinge) hoàn hảo',
      desc: 'Chuyển động bản lề hông. Đẩy hông ra sau, lưng thẳng tắp. Phát triển mạnh gân kheo (Hamstrings) và cơ mông (Glutes).',
      keyPoints: [
        'Giữ thẳng cột sống tự nhiên, khóa chặt bả vai.',
        'Đẩy khớp hông ra sau như muốn chạm mông vào tường sau lưng.',
        'Đầu gối chỉ hơi cong mềm, không khuỵu gối thành Squat.',
        'Tạ luôn lướt sát mặt trước cẳng chân để giảm cánh tay đòn lên cột sống thắt lưng.',
      ],
    },
    {
      imgSrc: '/images/lat_pulldown_form.jpg',
      title: 'Kéo Cáp Lưng Xô (Lat Pulldown)',
      subtitle: 'Kỹ thuật mở ngực hạ bả vai (Scapular Depression)',
      desc: 'Hạ và khép bả vai xuống trước khi kéo. Cùi chỏ kéo hướng về hông, ngực ưỡn tự nhiên để lưng xô nhận trọn vẹn tải trọng.',
      keyPoints: [
        'Hạ và khép hai xương bả vai (Scapular depression & retraction) trước khi cùi chỏ bắt đầu gập.',
        'Kéo thanh đòn về phía xương quai xanh (ngực trên), không kéo sau gáy.',
        'Giữ thân người hơi nghiêng nhẹ 10–15° về sau.',
        'Nhả tạ lên từ từ 2–3 giây để kéo giãn toàn bộ cơ xô (Lats).',
      ],
    },
    {
      imgSrc: '/images/bench_press_form.jpg',
      title: 'Đẩy Ngực Nằm Ghế (Bench / DB Press)',
      subtitle: 'Góc nách an toàn 45°–60° bảo vệ chóp xoay vai',
      desc: 'Góc cùi chỏ an toàn 45°–60° so với thân người. Tuyệt đối tránh bạnh cùi chỏ 90° ngang vai vì sẽ chèn ép và xé rách gân chóp xoay vai.',
      keyPoints: [
        'Khóa chặt 2 bả vai ép vào đệm ghế trước khi nhấc tạ.',
        'Tạo vòm lưng tự nhiên (Arch lưng nhẹ), mông và vai luôn tiếp xúc với mặt ghế.',
        'Bàn chân đạp chắc chắn xuống sàn (Leg drive).',
        'Đường đi của tạ hơi chéo nhẹ: từ ngang ngực dưới đẩy lên thẳng trên ngực giữa.',
      ],
    },
  ];

  return (
    <main className="container">
      {/* Header Banner */}
      <section className="hero-card">
        <div className="title-area">
          <div className="badge-group" style={{ marginBottom: 8 }}>
            <span className="badge badge-cyan">CƠ SINH HỌC 3D</span>
            <span className="badge badge-emerald">PHÒNG NGỪA CHẤN THƯƠNG</span>
          </div>
          <h1>Thư Viện Cơ Sinh Học 3D & Kỹ Thuật Trụ Cột</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 680 }}>
            Các hình ảnh mô phỏng 3D chuyên sâu chỉ rõ góc độ khớp, điểm bám cơ và các sai lầm tư thế phổ biến khi tập luyện.
          </p>
        </div>
      </section>

      {/* Gallery Cards Grid */}
      <div className="gallery-grid">
        {items.map((item, idx) => (
          <div key={idx} className="gallery-card">
            <div className="gallery-card-img" onClick={() => setSelectedItem(item)}>
              <img src={item.imgSrc} alt={item.title} />
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '4px 8px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  color: '#67E8F9',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                }}
              >
                <ZoomIn size={12} />
                <span>Phóng to</span>
              </div>
            </div>

            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', marginBottom: 6 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
                  {item.desc}
                </p>
              </div>

              <button
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
                onClick={() => setSelectedItem(item)}
              >
                <Eye size={14} />
                <span>Xem Chi Tiết Cơ Sinh Học</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Biomechanics Zoom Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{selectedItem.title}</h3>
              <button className="modal-close" onClick={() => setSelectedItem(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: '75vh', overflowY: 'auto', padding: 20 }}>
              <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 18, border: '1px solid var(--card-border)' }}>
                <img
                  src={selectedItem.imgSrc}
                  alt={selectedItem.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <strong style={{ color: '#67E8F9', fontSize: 15, display: 'block', marginBottom: 4 }}>
                  {selectedItem.subtitle}
                </strong>
                <p style={{ color: '#E2E8F0', fontSize: 13 }}>{selectedItem.desc}</p>
              </div>

              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', marginBottom: 10 }}>
                Các Điểm Kỹ Thuật Bắt Buộc Ghi Nhớ:
              </h4>
              <ul style={{ paddingLeft: 20, color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.8 }}>
                {selectedItem.keyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
