'use client';

import { useState } from 'react';
import { Eye, X, ZoomIn, Search, AlertTriangle, CheckCircle2, Dumbbell, ShieldCheck, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms';
  categoryLabel: string;
  imgSrc: string;
  title: string;
  subtitle: string;
  desc: string;
  targetMuscles: string;
  keyPoints: string[];
  commonMistakes: string[];
}

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const items: GalleryItem[] = [
    // 1. BENCH PRESS
    {
      id: 'bench-press',
      category: 'chest',
      categoryLabel: 'Ngực',
      imgSrc: '/images/bench_press_form.jpg',
      title: 'Đẩy Ngực Nằm Ghế (Bench / DB Press)',
      subtitle: 'Góc nách an toàn 45°–60° bảo vệ chóp xoay vai',
      desc: 'Cùi chỏ mở góc an toàn 45°–60° so với thân người. Tuyệt đối tránh bạnh cùi chỏ 90° ngang vai vì sẽ chèn ép mỏm cùng vai và rách gân chóp xoay.',
      targetMuscles: 'Cơ ngực lớn (Pectoralis Major), Cơ tay sau (Triceps), Cơ vai trước (Anterior Deltoid)',
      keyPoints: [
        'Khóa chặt hai bả vai ép sâu vào đệm ghế trước khi nhấc tạ (Scapular Retraction).',
        'Tạo vòm lưng tự nhiên (Natural Arch), mông và vai luôn tiếp xúc với mặt ghế.',
        'Bàn chân đạp chắc chắn xuống sàn tạo lực đẩy thân dưới (Leg Drive).',
        'Quỹ đạo tạ hơi chéo nhẹ: từ ngang ngực dưới đẩy thẳng lên trên ngực giữa.',
      ],
      commonMistakes: [
        'Bạnh cùi chỏ vuông góc 90° ngang tai gây kẹt gân cơ chóp xoay.',
        'Nhấc mông khỏi ghế để ăn gian lực đẩy làm xoắn vặn đốt sống thắt lưng.',
        'Thả rơi tạ đập vào lồng ngực làm mất kiểm soát sức căng cơ.',
      ],
    },

    // 2. SQUAT
    {
      id: 'squat',
      category: 'legs',
      categoryLabel: 'Chân & Mông',
      imgSrc: '/images/squat_form.jpg',
      title: 'Squat Sâu Chuẩn Cơ Học (Deep Squat Analysis)',
      subtitle: 'Độ sâu gối & căn chỉnh trục đầu gối theo mũi chân',
      desc: 'Kỹ thuật giữ thẳng lưng tự nhiên, mở khớp háng, hạ sâu đến khi nếp gấp hông (hip crease) ngang hoặc dưới đầu gối mà không võng hay cúp mông.',
      targetMuscles: 'Cơ đùi trước (Quadriceps), Cơ mông lớn (Gluteus Maximus), Cơ lõi ổ bụng (Core)',
      keyPoints: [
        'Gót chân và ức bàn chân bám chặt sàn tạo cấu trúc kiềng 3 chân (Tripod foot).',
        'Đầu gối luôn mở hướng theo ngón chân thứ 2, tuyệt đối tránh chụm gối (Knee Valgus).',
        'Hít sâu bằng cơ hoành nén áp lực ổ bụng (Valsalva Maneuver) trước khi hạ tạ.',
        'Thân người đổ về trước ở góc độ tương đồng với độ nghiêng của cẳng chân (Tibia).',
      ],
      commonMistakes: [
        'Sụp đầu gối vào trong (Valgus) khi bắt đầu đạp lên từ đáy Squat.',
        'Nhấc gót chân khỏi mặt sàn do cổ chân kém linh hoạt.',
        'Cúp mông (Butt wink) quá sâu gây tải áp lực gập lên đĩa đệm L4-L5.',
      ],
    },

    // 3. LEG PRESS
    {
      id: 'leg-press',
      category: 'legs',
      categoryLabel: 'Chân & Mông',
      imgSrc: '/images/leg_press_form.jpg',
      title: 'Đạp Đùi Máy Nghiêng 45° (Leg Press)',
      subtitle: 'Bảo vệ khớp gối & tránh khóa khớp ở đỉnh đẩy',
      desc: 'Vị trí đặt chân trên bàn đạp quyết định nhóm cơ kích hoạt: đặt cao ăn nhiều cơ mông/đùi sau, đặt thấp tập trung tối đa cơ đùi trước.',
      targetMuscles: 'Cơ đùi trước (Vastus Lateralis, Rectus Femoris), Cơ mông, Cơ khép đùi',
      keyPoints: [
        'Tuyệt đối không khóa thẳng khớp gối ở đỉnh chuyển động để tránh chấn thương khớp nghiêm trọng.',
        'Lưng dưới và xương cùng phải ép chặt vào đệm ghế suốt quá trình tập, không để nhấc mông lên.',
        'Hạ bàn đạp xuống đến khi góc đầu gối đạt xấp xỉ 90 độ có kiểm soát.',
        'Đẩy bằng toàn bộ lòng bàn chân, tập trung lực truyền từ gót chân.',
      ],
      commonMistakes: [
        'Khóa khớp gối kịch liệt ở đỉnh đạp gây áp lực cắt xé đứt dây chằng chéo.',
        'Nhấc mông và cuộn thắt lưng khỏi đệm lưng khi hạ quá sâu.',
        'Đầu gối chụm vào nhau thay vì mở rộng thẳng hàng với bàn chân.',
      ],
    },

    // 4. ROMANIAN DEADLIFT (RDL)
    {
      id: 'rdl',
      category: 'legs',
      categoryLabel: 'Chân & Mông',
      imgSrc: '/images/rdl_form.jpg',
      title: 'Dumbbell Romanian Deadlift (RDL)',
      subtitle: 'Bản lề hông (Hip Hinge) hoàn hảo',
      desc: 'Chuyển động bản lề hông thuần túy. Đẩy hông ra sau, lưng thẳng tắp. Kéo giãn và phát triển cực đại gân kheo (Hamstrings) và cơ mông (Glutes).',
      targetMuscles: 'Cơ đùi sau (Hamstrings), Cơ mông lớn (Gluteus Maximus), Cơ dựng sống lưng',
      keyPoints: [
        'Giữ thẳng cột sống tự nhiên, khóa chặt hai bả vai không để gù lưng trên.',
        'Đẩy khớp hông ra sau như muốn chạm mông vào bức tường sau lưng.',
        'Đầu gối chỉ hơi cong mềm cố định góc, không khuỵu gối chuyển động thành Squat.',
        'Tạ luôn lướt sát mặt trước cẳng chân để giảm cánh tay đòn lên cột sống thắt lưng.',
      ],
      commonMistakes: [
        'Gù lưng dưới khi cúi xuống vì với tạ thay vì gập bằng khớp hông.',
        'Khuỵu gối quá nhiều biến bài RDL thành bài Squat nửa vời.',
        'Để tạ trôi xa khỏi cẳng chân tạo đòn bẩy khổng lồ chèn ép đĩa đệm.',
      ],
    },

    // 5. LAT PULLDOWN
    {
      id: 'lat-pulldown',
      category: 'back',
      categoryLabel: 'Lưng Xô',
      imgSrc: '/images/lat_pulldown_form.jpg',
      title: 'Kéo Cáp Lưng Xô (Lat Pulldown)',
      subtitle: 'Kỹ thuật mở ngực hạ bả vai (Scapular Depression)',
      desc: 'Hạ và khép bả vai xuống trước khi gập cùi chỏ. Cùi chỏ kéo hướng về hông, ngực ưỡn tự nhiên để lưng xô nhận trọn vẹn tải trọng.',
      targetMuscles: 'Cơ lưng xô (Latissimus Dorsi), Cơ bắp tay trước, Cơ quả trám (Rhomboids)',
      keyPoints: [
        'Hạ và khép hai xương bả vai (Scapular depression & retraction) trước khi cùi chỏ bắt đầu gập.',
        'Kéo thanh đòn về phía xương quai xanh (ngực trên), tuyệt đối không kéo sau gáy.',
        'Giữ thân người nghiêng nhẹ 10–15° về sau cố định suốt động tác.',
        'Nhả tạ lên từ từ 2–3 giây để kéo giãn hoàn toàn thớ cơ xô (Lats) dưới sức căng.',
      ],
      commonMistakes: [
        'Kéo thanh đòn ra sau cổ gây va đập đốt sống cổ và chèn ép khớp vai.',
        'Ngả người ra sau 45 độ dùng đà giật tạ thay vì dùng cơ xô.',
        'Cùi chỏ chĩa về phía sau thay vì kéo thẳng xuống sườn.',
      ],
    },

    // 6. SEATED CABLE ROW
    {
      id: 'seated-row',
      category: 'back',
      categoryLabel: 'Lưng Xô',
      imgSrc: '/images/seated_row_form.jpg',
      title: 'Ngồi Kéo Cáp Chèo Thuyền (Seated Cable Row)',
      subtitle: 'Phát triển độ dày lưng & thu bả vai (Scapular Retraction)',
      desc: 'Tác động sâu vào cơ lưng giữa, cơ xô và cơ thang giữa. Tránh dùng đà đung đưa cột sống để phòng ngừa thoát vị đĩa đệm lưng.',
      targetMuscles: 'Cơ lưng xô, Cơ thang giữa & dưới (Trapezius), Cơ trám, Cơ dựng gai sống',
      keyPoints: [
        'Giữ cột sống ở trạng thái thẳng tự nhiên, ngực hơi ưỡn, đầu gối hơi chùng mềm.',
        'Kéo tay cầm về phía bụng dưới / rốn, cùi chỏ lướt sát mạn sườn.',
        'Ép chặt hai bả vai vào nhau ở đỉnh co như muốn kẹp chặt một cây bút giữa lưng.',
        'Duỗi tay ra từ từ, để bả vai mở ra kéo giãn toàn bộ cơ xô trước rep tiếp theo.',
      ],
      commonMistakes: [
        'Đung đưa người ra trước về sau lấy trớn làm lưng dưới chịu tải trọng thay cho cơ xô.',
        'Nhún vai lên tai khi kéo làm cơ thang trên co cứng gây mỏi cổ vai gáy.',
        'Gù lưng khi duỗi tay ra trước.',
      ],
    },

    // 7. FACE PULL
    {
      id: 'face-pull',
      category: 'back',
      categoryLabel: 'Lưng Xô & Vai Sau',
      imgSrc: '/images/face_pull_form.jpg',
      title: 'Kéo Cáp Mặt (Rope Face Pull)',
      subtitle: 'Bài tập vàng khắc phục hội chứng gù cổ rùa cho dân IT',
      desc: 'Tác động sâu vào cơ vai sau (Rear Delts), cơ hình thoi và nhóm chóp xoay ngoài vai (External Rotators) giúp kéo mở bả vai ra sau.',
      targetMuscles: 'Cơ vai sau (Posterior Deltoid), Cơ xoay ngoài vai (Infraspinatus), Cơ trám, Thang giữa',
      keyPoints: [
        'Đặt ròng rọc ngang tầm mắt hoặc cao hơn một chút, dùng dây thừng đôi (Rope).',
        'Cầm dây ngón cái hướng về phía sau, kéo dây về phía hai bên thái dương / mắt.',
        'Ở đỉnh co, chủ động xoay ngoài hai cùi chỏ (External rotation), ưỡn ngực mở rộng.',
        'Giữ căng 1-2 giây ở đỉnh co trước khi nhả tạ chậm rãi.',
      ],
      commonMistakes: [
        'Kéo tạ quá nặng làm dùng cả thân người giật lùi về sau.',
        'Kéo dây xuống cằm thay vì kéo về ngang mắt làm mất động tác xoay ngoài vai.',
        'Cùi chỏ hạ thấp dưới vai biến bài tập thành bài kéo lưng.',
      ],
    },

    // 8. SHOULDER PRESS
    {
      id: 'shoulder-press',
      category: 'shoulders',
      categoryLabel: 'Vai',
      imgSrc: '/images/shoulder_press_form.jpg',
      title: 'Đẩy Vai Ngồi Ghế Tạ Đơn (DB Shoulder Press)',
      subtitle: 'Mặt phẳng xương bả vai (Scapular Plane) an toàn cho chóp xoay',
      desc: 'Mở cùi chỏ góc 30° về phía trước thân người (Scapular Plane) thay vì bạnh ngang 90° để khớp vai di chuyển tự nhiên nhất mà không kẹp gân cơ.',
      targetMuscles: 'Cơ vai trước (Anterior Deltoid), Cơ vai giữa (Lateral Deltoid), Cơ tay sau (Triceps)',
      keyPoints: [
        'Ghế tựa nghiêng nhẹ 75°–80° thay vì thẳng đứng 90° để giảm áp lực ưỡn thắt lưng.',
        'Cùi chỏ hơi chếch về phía trước, cẳng tay luôn giữ vuông góc với mặt sàn.',
        'Đẩy tạ lên theo đường vòng cung nhẹ, không chạm đập tạ vào nhau ở đỉnh.',
        'Hạ tạ có kiểm soát đến ngang tai hoặc cằm, không thả rơi tự do.',
      ],
      commonMistakes: [
        'Bạnh cùi chỏ thẳng ngang tai (90°) ép gân cơ chóp xoay vào xương mỏm quạ.',
        'Ưỡn cong thắt lưng đẩy bụng về trước khi tạ quá nặng.',
        'Khóa cứng khớp cùi chỏ ở đỉnh đẩy.',
      ],
    },

    // 9. TRICEPS PUSHDOWN
    {
      id: 'tricep-pushdown',
      category: 'arms',
      categoryLabel: 'Tay Sau',
      imgSrc: '/images/tricep_pushdown_form.jpg',
      title: 'Kéo Cáp Ép Tay Sau (Cable Triceps Pushdown)',
      subtitle: 'Khóa cùi chỏ cố định cô lập trọn vẹn 3 đầu cơ tay sau',
      desc: 'Cơ tay sau chiếm 65% thể tích bắp tay. Giữ cùi chỏ cố định hai bên sườn là chìa khóa vàng để lực không bị chuyển sang cơ ngực và vai.',
      targetMuscles: 'Cơ tay sau (Triceps Brachii: Đầu ngoài, Đầu dài, Đầu trong)',
      keyPoints: [
        'Ép sát hai cùi chỏ vào mạn sườn, thân người hơi đổ nhẹ về trước 10-15 độ.',
        'Chỉ chuyển động cẳng tay xoay quanh khớp khuỷu, không đưa cùi chỏ ra trước hay sau.',
        'Đẩy thẳng tay xuống dưới và hơi tách nhẹ hai đầu dây thừng ở vị trí đáy để siết cơ tối đa.',
        'Nhả tạ lên đến khi cẳng tay vuông góc với bắp tay rồi lặp lại.',
      ],
      commonMistakes: [
        'Vung cùi chỏ ra trước khi nhả tạ và kéo bằng đà vai khi đẩy xuống.',
        'Cổ tay bị bẻ gập khi đẩy làm đau cổ tay.',
        'Đứng thẳng đơ người khóa khớp khuỷu tay.',
      ],
    },

    // 10. INCLINE BICEP CURL
    {
      id: 'bicep-curl',
      category: 'arms',
      categoryLabel: 'Tay Trước',
      imgSrc: '/images/bicep_curl_form.jpg',
      title: 'Cuốn Tay Trước Ghế Dốc (Incline DB Bicep Curl)',
      subtitle: 'Kéo giãn cực đại đầu dài cơ nhị đầu (Biceps Long Head)',
      desc: 'Khi ngồi trên ghế dốc 60 độ, cánh tay ở vị trí duỗi ra sau thân người, tạo độ căng trước (Passive Pre-stretch) cực lớn giúp phát triển đỉnh chuột bắp tay.',
      targetMuscles: 'Cơ nhị đầu bắp tay (Biceps Brachii), Cơ cánh tay (Brachialis), Cơ cẳng tay',
      keyPoints: [
        'Hạ ghế dốc khoảng 60 độ, tựa lưng và đầu chắc chắn vào đệm ghế.',
        'Cánh tay buông thẳng tự nhiên vuông góc với mặt đất, không dùng đà vai để vung tạ.',
        'Cuốn tạ lên đồng thời ngửa cổ tay (Supination) ra ngoài ở nửa hành trình trên.',
        'Hạ tạ chậm rãi trong 3 giây để kích hoạt cơ chế Hypertrophy khi duỗi cơ.',
      ],
      commonMistakes: [
        'Dùng đà vung vai đưa cùi chỏ về phía trước làm mất sức căng cơ nhị đầu.',
        'Thả tạ rơi tự do không kiểm soát nhịp hạ (Eccentric phase).',
        'Nhấc lưng hoặc vai khỏi đệm ghế khi tạ quá nặng.',
      ],
    },
  ];

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'chest', label: 'Ngực' },
    { id: 'back', label: 'Lưng Xô' },
    { id: 'legs', label: 'Chân & Mông' },
    { id: 'shoulders', label: 'Vai' },
    { id: 'arms', label: 'Tay Trước & Sau' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetMuscles.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="container" style={{ paddingBottom: 80 }}>
      {/* Header Banner */}
      <section className="hero-card">
        <div className="title-area">
          <div className="badge-group" style={{ marginBottom: 8 }}>
            <span className="badge badge-cyan">CƠ SINH HỌC 3D MỞ RỘNG</span>
            <span className="badge badge-emerald">{items.length} BÀI TẬP TRỤ CỘT</span>
            <span className="badge badge-purple">PHÒNG NGỪA CHẤN THƯƠNG</span>
          </div>
          <h1>Thư Viện Cơ Sinh Học 3D & Kỹ Thuật Trụ Cột</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 680 }}>
            Hình ảnh mô phỏng 3D chuyên sâu chỉ rõ góc độ khớp an toàn, điểm bám cơ học và phân tích chi tiết các sai lầm phổ biến khi nâng tạ.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ position: 'relative', maxWidth: 460 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm theo tên bài tập, nhóm cơ..."
              className="input-field"
              style={{ paddingLeft: 38, width: '100%', marginBottom: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="tab-group" style={{ marginBottom: 0, overflowX: 'auto', flexWrap: 'nowrap' }}>
            {categories.map((c) => {
              const count = c.id === 'all' ? items.length : items.filter((i) => i.category === c.id).length;
              return (
                <button
                  key={c.id}
                  className={`tab-btn ${activeCategory === c.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(c.id)}
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <span>{c.label}</span>
                  <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Cards Grid */}
      <div className="gallery-grid" style={{ marginTop: 24 }}>
        {filteredItems.map((item) => (
          <div key={item.id} className="gallery-card">
            <div className="gallery-card-img" onClick={() => setSelectedItem(item)} style={{ cursor: 'pointer' }}>
              <img src={item.imgSrc} alt={item.title} loading="lazy" />
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#38BDF8',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                }}
              >
                {item.categoryLabel}
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
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
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', marginBottom: 6 }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: 12, color: '#38BDF8', fontWeight: 600, marginBottom: 8 }}>
                  🎯 {item.subtitle}
                </div>
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

      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 15 }}>Không tìm thấy bài tập phù hợp với từ khóa &quot;{searchTerm}&quot;.</p>
        </div>
      )}

      {/* Biomechanics Zoom Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)} style={{ zIndex: 9999 }}>
          <div className="modal-card" style={{ maxWidth: 760, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-cyan" style={{ fontSize: 11, marginBottom: 4 }}>
                  {selectedItem.categoryLabel}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                  {selectedItem.title}
                </h3>
              </div>
              <button className="modal-close" onClick={() => setSelectedItem(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: 20 }}>
              {/* Full Image */}
              <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 18, border: '1px solid var(--card-border)' }}>
                <img
                  src={selectedItem.imgSrc}
                  alt={selectedItem.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              {/* Subtitle & Muscles */}
              <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <strong style={{ color: '#67E8F9', fontSize: 15, display: 'block', marginBottom: 4 }}>
                  💡 {selectedItem.subtitle}
                </strong>
                <p style={{ color: '#E2E8F0', fontSize: 13, margin: '0 0 8px', lineHeight: 1.5 }}>
                  {selectedItem.desc}
                </p>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>
                  <strong style={{ color: '#38BDF8' }}>Nhóm cơ tác động chính:</strong> {selectedItem.targetMuscles}
                </div>
              </div>

              {/* Key Technique Points */}
              <div style={{ marginBottom: 18 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#34D399', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={16} />
                  <span>Kỹ Thuật Bắt Buộc Ghi Nhớ (Form Chuẩn):</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedItem.keyPoints.map((pt, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        background: 'rgba(255, 255, 255, 0.02)',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--card-border)',
                      }}
                    >
                      <CheckCircle2 size={15} color="#34D399" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Pitfalls / Mistakes */}
              {selectedItem.commonMistakes && selectedItem.commonMistakes.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#F87171', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={16} />
                    <span>Sai Lầm Nguy Hiểm Cần Tuyệt Đối Tránh:</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedItem.commonMistakes.map((err, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          background: 'rgba(239, 68, 68, 0.06)',
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}
                      >
                        <X size={15} color="#F87171" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, color: '#FCA5A5', lineHeight: 1.5 }}>{err}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
