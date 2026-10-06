export interface BiomechanicalTechniqueDetail {
  id: string;
  nameVi: string;
  nameEn: string;
  category: string;
  equipment: string;
  targetMuscles: {
    primary: string;
    secondary: string | string[];
  };
  equipmentSetup: {
    benchSetting?: string;
    cableSetting?: string;
    attachment?: string;
    padPosition?: string;
    distance?: string;
    weightSelectionAdvice?: string;
  };
  startingPosture: string[];
  executionSteps: {
    phase: string;
    description: string;
    cue: string;
  }[];
  commonMistakes: {
    mistake: string;
    consequence: string;
    fix: string;
  }[];
  breathingAndTempo: {
    breathing: string;
    tempo: string;
    explanation: string;
  };
  biomechanicalCue: string;
  safetyWarning: string;
}

export const EXERCISE_TECHNIQUE_DETAILS: Record<string, BiomechanicalTechniqueDetail> = {
  // 1. KÉO CÁP LƯNG XÔ (LAT PULLDOWN)
  'lat-pulldown': {
    id: 'lat-pulldown',
    nameVi: 'Kéo Cáp Lưng Xô',
    nameEn: 'Wide-Grip Lat Pulldown',
    category: 'Lưng Xô (Back / Lats)',
    equipment: 'Giàn cáp kéo cao (Lat Pulldown Machine) + Thanh ngang rộng',
    targetMuscles: {
      primary: 'Cơ lưng rộng (Latissimus Dorsi)',
      secondary: 'Cơ quả trám (Rhomboids), Tay trước (Biceps), Cơ tròn lớn (Teres Major)',
    },
    equipmentSetup: {
      cableSetting: 'Chốt ròng rọc ở vị trí cao nhất trên đỉnh máy.',
      attachment: 'Thanh kéo ngang dài (Wide Lat Bar). Nắm rộng hơn vai mỗi bên 10–15cm.',
      padPosition: 'Chỉnh đệm đùi (Thigh Pad) đè chặt vào giữa đùi. Bàn chân đặt phẳng 100% trên sàn, không kiễng gót để khóa hông không bị nhấc lên.',
      benchSetting: 'Ghế ngồi đặt ngay dưới thanh cáp sao cho đường cáp rơi thẳng xuống xương quai xanh.',
      weightSelectionAdvice: 'Chọn mức tạ bạn có thể kéo chạm nhẹ ức mà không cần giật ngửa người ra sau quá 20°.',
    },
    startingPosture: [
      'Ngồi sát đùi vào đệm, chân ép chặt xuống sàn nhà tạo điểm tựa vát chắc chắn.',
      'Hai tay nắm thanh bar theo kiểu Hook-grip hoặc Overhand grip, rộng hơn vai ~1.5 lần.',
      'Hơi ưỡn ngực ra trước (Chest Up), giữ thân người nghiêng về sau một góc tự nhiên từ 10°–15°.',
      'Khóa bả vai: Chủ động HẠ và KHÉP hai xương bả vai xuống (Scapular Depression & Retraction) trước khi bắt đầu kéo bằng cánh tay.',
    ],
    executionSteps: [
      {
        phase: '1. Kéo xuống (Concentric)',
        description: 'Tập trung kéo bằng cách ghì hai cùi chỏ thẳng xuống hai bên hông (tưởng tượng đưa cùi chỏ vào túi quần sau). Kéo thanh bar xuống ngang xương quai xanh hoặc mép ngực trên.',
        cue: 'Nghĩ về việc kéo cùi chỏ xuống, đừng nghĩ về việc dùng bàn tay giật tạ.',
      },
      {
        phase: '2. Siết đỉnh co (Peak Contraction)',
        description: 'Giữ thanh tạ chạm nhẹ ngực trên 1 giây. Ép hai xương bả vai chặt lại sau lưng, mở ngực tối đa.',
        cue: 'Cảm nhận cơ xô hai bên nách siết cứng lại.',
      },
      {
        phase: '3. Trả tạ chậm có kiểm soát (Eccentric)',
        description: 'Nhả tạ từ từ trong 2–3 giây cho đến khi tay duỗi thẳng nhưng KHÔNG thả lỏng hoàn toàn khớp vai. Cho cơ xô giãn hết cỡ ở đỉnh.',
        cue: 'Chống lại trọng lực kéo lên, duy trì lực căng (tension) liên tục trên cơ xô.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Ngả người ra sau quá nhiều (> 45°) và giật lưng',
        consequence: 'Biến bài kéo xô thành kéo lưng giữa/lưng dưới, tăng nguy cơ thoát vị đĩa đệm thắt lưng.',
        fix: 'Khóa thân cố định ở góc nghiêng 10-15°, giảm bớt 1-2 nấc tạ.',
      },
      {
        mistake: 'Kéo thanh bar ra sau gáy (Behind the neck)',
        consequence: 'Ép khớp xoay vai (Rotator Cuff) vào tư thế kẹt nguy hiểm và chèn ép đốt sống cổ.',
        fix: 'Luôn luôn kéo thanh bar về phía trước ngực trên.',
      },
      {
        mistake: 'Dùng ngón tay bóp quá chặt và giật bằng bắp tay trước',
        consequence: 'Mỏi nhừ cẳng tay và bắp trước trước khi cơ lưng kịp kích hoạt.',
        fix: 'Sử dụng Thumbless grip (ngón cái cùng phía với các ngón khác) hoặc strap cổ tay.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Hít sâu nén lồng ngực trước khi kéo → Thở ra dứt khoát khi thanh tạ chạm đỉnh co ở ngực → Hít vào chậm rãi khi trả tạ lên trên.',
      tempo: '3 - 1 - 1 - 0 (3 giây nhả tạ lên, 1 giây giữ giãn đỉnh, 1 giây kéo dứt khoát xuống, 0 giây chờ đáy).',
      explanation: 'Pha hạ tạ eccentric 3 giây là chìa khóa phát triển độ rộng của lưng xô.',
    },
    biomechanicalCue: 'Hãy hình dung bàn tay chỉ là chiếc móc câu (hooks), động lực chính kéo tạ là hai cùi chỏ ghì thẳng xuống đất.',
    safetyWarning: 'Không bao giờ nhả tạ thả rơi tự do làm khớp vai bị giật đột ngột khi cơ đang thư giãn.',
  },

  // 2. NGỒI KÉO CÁP CHÈO THUYỀN (SEATED CABLE ROW)
  'seated-cable-row': {
    id: 'seated-cable-row',
    nameVi: 'Ngồi Kéo Cáp Chèo Thuyền',
    nameEn: 'Seated Cable Row',
    category: 'Lưng Dày (Mid Back & Rhomboids)',
    equipment: 'Giàn cáp thấp (Low Row) + Tay cầm chữ V (Close-grip V-bar)',
    targetMuscles: {
      primary: 'Cơ lưng giữa, Cơ quả trám (Rhomboids), Cơ thang giữa/dưới (Middle/Lower Trapezius)',
      secondary: 'Cơ xô (Lats), Cơ delta sau (Rear Deltoid), Cẳng tay',
    },
    equipmentSetup: {
      cableSetting: 'Chốt cáp ở ròng rọc thấp sát chân ghế.',
      attachment: 'Tay cầm V-Bar khép ngón đối diện (Neutral grip) hoặc thanh thẳng vừa.',
      padPosition: 'Chỗ gác chân (Footplates): Đặt bàn chân ở giữa bàn đạp, gối hơi chùng nhẹ 10-15°, TUYỆT ĐỐI không khóa cứng khớp gối.',
      benchSetting: 'Ghế ngồi phẳng, khoảng cách ngồi sao cho khi tay duỗi thẳng thì tạ không bị chạm vào khung tạ.',
      weightSelectionAdvice: 'Mức tạ cho phép bạn giữ thân thẳng 90° vuông góc sàn mà không bị kéo chúi người về trước.',
    },
    startingPosture: [
      'Đặt chân lên bàn đạp, đẩy người về sau vừa tầm, lưng thẳng tắp, ngực ưỡn nhẹ.',
      'Cột sống ở trạng thái trung tính (Neutral Spine), không cong gù lưng tôm và không ưỡn thắt lưng quá đà.',
      'Đầu gối hơi gập nhẹ để giảm áp lực lên cơ đùi sau và khớp gối.',
      'Vai hạ thấp tự nhiên, hai cánh tay duỗi thẳng giữ tay cầm V-bar.',
    ],
    executionSteps: [
      {
        phase: '1. Kéo về (Concentric)',
        description: 'Kéo tay cầm về phía rốn hoặc bụng dưới. Đồng thời ép chặt hai xương bả vai lại với nhau như đang kẹp một cây bút chì giữa lưng.',
        cue: 'Cùi chỏ quét sát hai bên sườn, hướng thẳng về phía sau.',
      },
      {
        phase: '2. Điểm co thắt (Peak Contraction)',
        description: 'Dừng lại 1 giây khi tay cầm chạm nhẹ rốn. Mở căng lồng ngực, siết cơ lưng giữa tối đa.',
        cue: 'Giữ thân mình cố định góc 90° so với mặt sàn, không ngửa lưng ra sau.',
      },
      {
        phase: '3. Nhả tạ (Eccentric)',
        description: 'Duỗi tay từ từ ra phía trước trong 2–3 giây, cho phép bả vai tách mở ra để kéo giãn toàn bộ cơ lưng, nhưng thân người giữ yên.',
        cue: 'Chỉ di chuyển khớp vai và khớp khuỷu tay, giữ hông và cột sống ổn định.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Đung đưa người như người chèo thuyền thực thụ (gập tới lui lấy đà)',
        consequence: 'Dồn toàn bộ áp lực tải trọng lên cột sống thắt lưng L4-L5 gây thoái hóa đĩa đệm.',
        fix: 'Gồng chặt bụng (Core Bracing), cố định góc thân trên nghiêng tối đa ±5°.',
      },
      {
        mistake: 'Kéo tay cầm lên quá cao (về phía ngực trên/cổ)',
        consequence: 'Làm rụt vai lên tai, kích hoạt cơ cầu vai trên (Upper Traps) gây căng cứng cổ.',
        fix: 'Luôn kéo thanh tạ về hướng rốn, hạ vai thấp xuống xa tai.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Hít sâu nén chặt khoang bụng → Kéo tạ về rốn và thở ra dứt khoát → Hít vào khi nhả tay cầm về phía trước.',
      tempo: '2 - 1 - 1 - 1 (2 giây nhả tạ, 1 giây giãn, 1 giây kéo mạnh về rốn, 1 giây ép siết bả vai).',
      explanation: 'Giữ 1 giây ép bả vai ở rốn giúp xây dựng độ dày lưng tối ưu.',
    },
    biomechanicalCue: 'Tưởng tượng ngực bạn ưỡn ra đón tay cầm, trong khi hai xương bả vai cố gắng chạm vào nhau ở giữa lưng.',
    safetyWarning: 'Không cong lưng dưới khi với tay lấy tạ lúc mới bắt đầu hoặc khi đặt tạ kết thúc hiệp.',
  },

  // 3. KÉO CÁP DUỖI TAY SAU (TRICEP ROPE PUSHDOWN)
  'tricep-pushdown': {
    id: 'tricep-pushdown',
    nameVi: 'Kéo Cáp Duỗi Tay Sau Với Dây Thừng',
    nameEn: 'Tricep Rope Pushdown',
    category: 'Tay Sau (Triceps)',
    equipment: 'Giàn cáp đơn cao + Dây thừng (Rope Attachment)',
    targetMuscles: {
      primary: 'Cơ tam đầu bắp tay sau - Đầu ngoài (Lateral Head) & Đầu giữa (Medial Head)',
      secondary: 'Đầu dài (Long Head), Cổ tay',
    },
    equipmentSetup: {
      cableSetting: 'Ròng rọc cáp chốt ở nấc cao nhất trên đỉnh giàn.',
      attachment: 'Dây thừng đôi (Tricep Rope). Nắm chặt hai đầu mút cao su.',
      distance: 'Đứng cách máy khoảng 30–50cm (khoảng 1 bước chân nhỏ).',
      benchSetting: 'Đứng thẳng, hai chân mở rộng bằng hông, gối hơi chùng nhẹ, thân trên hơi nghiêng về trước 10° để tạo không gian chuyển động.',
      weightSelectionAdvice: 'Trọng lượng cho phép khóa chặt cùi chỏ hai bên mạn sườn trong suốt động tác.',
    },
    startingPosture: [
      'Hai tay nắm hai đầu dây thừng, lòng bàn tay hướng vào nhau (Neutral grip).',
      'Đưa hai cùi chỏ áp sát mạn sườn (vị trí này phải KHÓA CHẶT vĩnh viễn suốt hiệp tập).',
      'Cánh tay trên vuông góc hoặc tạo góc 80°-90° so với cẳng tay.',
      'Gồng bụng, hạ vai xuống, mắt nhìn thẳng hoặc nhìn nhẹ xuống chân cáp.',
    ],
    executionSteps: [
      {
        phase: '1. Đẩy xuống (Concentric)',
        description: 'Dùng lực cơ tay sau đẩy thẳng cẳng tay xuống dưới sàn nhà cho đến khi cánh tay duỗi thẳng hoàn toàn.',
        cue: 'Chỉ có khớp khuỷu tay chuyển động quay, cùi chỏ không được tiến về trước hay lùi về sau.',
      },
      {
        phase: '2. Tách dây thừng (Peak Flare)',
        description: 'Ở điểm thấp nhất, chủ động TÁCH HAI ĐẦU DÂY THỪNG sang hai bên đùi ngoài và khóa cổ tay xuống.',
        cue: 'Cảm nhận đầu ngoài bắp tay sau siết căng như đá cuội.',
      },
      {
        phase: '3. Trả tạ lên (Eccentric)',
        description: 'Kiểm soát nhả cẳng tay lên lại vị trí ban đầu trong 2–3 giây đến khi cẳng tay vuông góc với bắp tay.',
        cue: 'Không để tạ giật làm cùi chỏ bị nhấc bay ra khỏi sườn.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Cùi chỏ đưa ra trước đưa về sau (Flaring & Swinging)',
        consequence: 'Dùng đà của khớp vai và ngực đẩy tạ thay vì cơ tay sau.',
        fix: 'Hãy tưởng tượng cùi chỏ của bạn bị đóng đinh cố định dính chặt vào xương sườn.',
      },
      {
        mistake: 'Gập cổ tay lên xuống liên tục',
        consequence: 'Viêm gân cổ tay (Wrist Tendonitis) và mất lực bóp.',
        fix: 'Giữ cổ tay thẳng trục trung tính với cẳng tay trong suốt biên độ.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Thở ra khi đẩy tạ xuống và tách dây → Hít sâu vào khi đưa tay gập trở lại lên trên.',
      tempo: '2 - 1 - 1 - 1 (2 giây lên chậm, 1 giây dừng ở góc 90°, 1 giây đẩy thẳng, 1 giây tách siết đáy).',
      explanation: 'Động tác tách dây ở đáy giúp kích hoạt tối đa sợi cơ đầu ngoài tạo độ rộng bắp tay hình móng ngựa.',
    },
    biomechanicalCue: 'Đẩy xuống và bẻ hai ngón tay cái hướng xuống đất ở điểm cuối của hành trình chuyển động.',
    safetyWarning: 'Không cúi đè cả thân trên lên tạ để dùng trọng lượng cơ thể ép cáp xuống.',
  },

  // 4. KÉO CÁP NGANG TRÁN (FACE PULL)
  'face-pull': {
    id: 'face-pull',
    nameVi: 'Kéo Cáp Ngang Trán',
    nameEn: 'Cable Face Pull',
    category: 'Vai Sau & Chóp Xoay (Rear Delts & Rotator Cuff)',
    equipment: 'Giàn cáp đơn + Dây thừng dài (Rope)',
    targetMuscles: {
      primary: 'Cơ vai sau (Rear Deltoid), Cơ chóp xoay (Infraspinatus & Teres Minor)',
      secondary: 'Cơ quả trám (Rhomboids), Cơ thang giữa/dưới, Cơ dựng sống cổ',
    },
    equipmentSetup: {
      cableSetting: 'Chốt ròng rọc cáp ngang tầm mắt hoặc ngang trán (khoảng 1.5m–1.7m tùy chiều cao).',
      attachment: 'Dây thừng đôi (Rope). Nắm theo kiểu ngón tay cái hướng về phía mặt (Thumbs back grip).',
      distance: 'Đứng lùi lại cách trụ cáp khoảng 1.2m–1.5m để dây cáp luôn căng khi tay duỗi thẳng.',
      padPosition: 'Không có. Đứng tư thế so le (một chân trước một chân sau) để giữ thăng bằng vững chắc tuyệt đối.',
      weightSelectionAdvice: 'Chọn tạ RẤT NHẸ (chỉ từ 5kg–15kg). Đây là bài tập phục hồi tư thế và kích hoạt chóp xoay, không phải bài đẩy tạ nặng.',
    },
    startingPosture: [
      'Đứng lùi sau trụ cáp, một chân trước một chân sau vững như bàn thạch.',
      'Hai tay nắm hai đầu dây thừng, ngón tay cái hướng thẳng về sau gáy.',
      'Duỗi thẳng tay về hướng máy, bả vai thả lỏng tự nhiên nhưng ngực hơi ưỡn.',
    ],
    executionSteps: [
      {
        phase: '1. Kéo về mặt & Xoay ngoài vai (External Rotation)',
        description: 'Kéo điểm nút của dây thừng về thẳng hướng chóp mũi hoặc trán. Đồng thời mở rộng hai cùi chỏ sang hai bên và XOAY NGOÀI khớp vai sao cho hai nắm tay hướng lên trên và về sau.',
        cue: 'Cùi chỏ phải luôn cao hơn hoặc ngang bằng cổ tay. Tưởng tượng làm động tác "Double Bicep Pose".',
      },
      {
        phase: '2. Siết đỉnh vai sau (Peak Contraction)',
        description: 'Dừng lại 1.5 giây ở vị trí nắm tay ngang hai tai. Ép chặt hai xương bả vai và cảm nhận mặt sau khớp vai bỏng rát.',
        cue: 'Kéo hai nắm tay ra sau mang tai.',
      },
      {
        phase: '3. Trả về chậm (Eccentric)',
        description: 'Kiểm soát nhả tay từ từ về phía trước theo quỹ đạo ngược lại trong 2–3 giây.',
        cue: 'Không để sức kéo của cáp giật kéo đổ người bạn về phía trước.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Cùi chỏ sà xuống thấp hơn bàn tay (thành bài chèo thuyền)',
        consequence: 'Mất hoàn toàn tác dụng lên vai sau và chóp xoay, chuyển thành bài lưng xô thông thường.',
        fix: 'Luôn giữ cùi chỏ mở cao ngang mang tai trong suốt lúc kéo.',
      },
      {
        mistake: 'Ngửa cổ giật người ra sau để kéo tạ',
        consequence: 'Gây chèn ép đốt sống cổ và đau nhức cổ.',
        fix: 'Hạ bớt tạ, giữ đầu thẳng trục với cột sống, cằm hơi thu lại (chin tuck).',
      },
    ],
    breathingAndTempo: {
      breathing: 'Hít sâu trước khi kéo → Thở ra dứt khoát khi kéo dây chạm ngang trán và xoay vai → Hít vào khi nhả tay về trước.',
      tempo: '2 - 2 - 1 - 0 (2 giây trả về, 2 giây giữ siết đỉnh, 1 giây kéo về trán).',
      explanation: 'Dừng 2 giây ở đỉnh giúp chữa lành tật gù lưng vai tròn (Forward Head & Rounded Shoulders) cho người ngồi bàn giấy nhiều.',
    },
    biomechanicalCue: 'Mục tiêu là xoay bàn tay ra sau hai bên tai, mở rộng khớp vai tối đa.',
    safetyWarning: 'Không dùng tạ nặng đến mức phải đung đưa lưng dưới. Động tác chuẩn mang lại giá trị gấp 10 lần mức tạ nặng.',
  },

  // 5. ĐẨY NGỰC NGANG TẠ ĐƠN (FLAT DB BENCH PRESS)
  'flat-db-press': {
    id: 'flat-db-press',
    nameVi: 'Đẩy Ngực Ngang Tạ Đơn',
    nameEn: 'Flat Dumbbell Press',
    category: 'Ngực (Chest / Pectoralis Major)',
    equipment: 'Ghế bằng (Flat Bench) + Cặp tạ đơn (Dumbbells)',
    targetMuscles: {
      primary: 'Cơ ngực lớn (Toàn bộ thân ngực)',
      secondary: 'Cơ delta trước (Anterior Deltoid), Cơ tam đầu tay sau (Triceps)',
    },
    equipmentSetup: {
      benchSetting: 'Ghế nằm phẳng 180° so với mặt đất, đệm mút chắc chắn không trơn trượt.',
      padPosition: 'Bàn chân chạm hoàn toàn xuống sàn nhà, gót chân ấn chặt tạo lực đẩy (Leg Drive).',
      weightSelectionAdvice: 'Chọn mức tạ bạn có thể tự kiểm soát hạ sâu ngang mép ngực mà không bị rung lắc mất thăng bằng.',
    },
    startingPosture: [
      'Ngồi trên đầu ghế, đặt 2 quả tạ đơn dựng đứng trên đùi gần đầu gối.',
      'Ngả người ra sau đồng thời dùng đầu gối hất từng quả tạ lên vị trí trước ngực.',
      'Khóa 5 điểm tiếp xúc: 2 bàn chân trên sàn, mông trên ghế, lưng trên/bả vai trên ghế, đầu tựa thoải mái.',
      'Rút và khóa bả vai (Retract & Depress Scapula) chặt vào mặt ghế tạo vòm cong tự nhiên ở thắt lưng (Arch).',
    ],
    executionSteps: [
      {
        phase: '1. Hạ tạ xuống (Eccentric)',
        description: 'Hạ tạ từ từ trong 2–3 giây, mở cùi chỏ sang hai bên ở góc 45°–60° so với thân người (góc mũi tên Arrowhead). Hạ đến khi tạ ngang tầm ngực và cảm nhận cơ ngực căng hết cỡ.',
        cue: 'Không bao giờ mở cùi chỏ 90° vuông góc với thân (dáng chữ T) vì sẽ làm rách sụn viền vai.',
      },
      {
        phase: '2. Đẩy lên (Concentric)',
        description: 'Dùng lực ép của cơ ngực đẩy 2 quả tạ lên theo hình vòng cung hội tụ nhẹ về phía trên đỉnh ngực, tay duỗi thẳng nhưng KHÔNG khóa khớp cùi chỏ.',
        cue: 'Hãy nghĩ về việc ép hai cùi chỏ lại gần nhau, chứ không phải đẩy bàn tay.',
      },
      {
        phase: '3. Đỉnh chuyển động (Top Position)',
        description: 'Dừng ở đỉnh 0.5s, không để 2 quả tạ va vào nhau keng keng làm tiêu tán lực căng.',
        cue: 'Cơ ngực co bóp tối đa.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Cùi chỏ mở vuông góc 90° so với người (T-pose)',
        consequence: 'Kẹt khớp vai (Shoulder Impingement) và rách cơ chóp xoay dưới lực nặng.',
        fix: 'Luôn khép cùi chỏ góc 45-60° tạo hình mũi tên hướng xuống.',
      },
      {
        mistake: 'Nhấc mông hoặc nhấc bàn chân khỏi sàn khi đẩy nặng',
        consequence: 'Mất điểm tựa sinh học, nguy cơ lật ghế chấn thương.',
        fix: 'Đạp gót chân chặt xuống sàn để tạo phản lực truyền qua đùi lên thân trên.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Hít sâu nén chặt lồng ngực khi hạ tạ xuống đáy → Giữ hơi qua điểm khó nhất (Sticking Point) → Thở ra khi tạ lên đến 2/3 đường đẩy.',
      tempo: '3 - 1 - 1 - 0 (3 giây hạ kiểm soát, 1 giây giữ đáy căng ngực, 1 giây đẩy lên dứt khoát).',
      explanation: 'Dừng 1 giây ở đáy giúp triệt tiêu phản xạ đàn hồi cơ bắp, bắt cơ ngực phải hoạt động 100%.',
    },
    biomechanicalCue: 'Tưởng tượng bạn đang cố gập cong thanh đòn vô hình hoặc ép hai bắp tay chạm vào nhau.',
    safetyWarning: 'Khi kết thúc hiệp, co hai đầu gối lên đón tạ rồi bật ngồi dậy, không bao giờ thả rơi tạ từ trên cao xuống sàn.',
  },

  // 6. ĐẨY NGỰC DỐC LÊN TẠ ĐƠN (INCLINE DB PRESS)
  'incline-db-press': {
    id: 'incline-db-press',
    nameVi: 'Đẩy Ngực Dốc Lên Tạ Đơn',
    nameEn: 'Incline Dumbbell Press',
    category: 'Ngực Trên (Clavicular Head)',
    equipment: 'Ghế dốc điều chỉnh (Adjustable Bench) + Cặp tạ đơn',
    targetMuscles: {
      primary: 'Cơ ngực trên (xương quai xanh)',
      secondary: 'Cơ delta trước (Front Delts), Tay sau (Triceps)',
    },
    equipmentSetup: {
      benchSetting: 'CHỈNH GÓC DỐC GHẾ TỪ 30° ĐẾN 45° (lý tưởng nhất là 30° - nấc thứ 2 hoặc 3 của ghế). Nếu chỉnh ghế quá 45°-60°, bài tập sẽ biến thành đẩy vai!',
      padPosition: 'Chỉnh đệm ngồi hơi dốc lên nhẹ (Incline seat pad) để tránh trượt mông ra trước khi cầm tạ nặng.',
      weightSelectionAdvice: 'Mức tạ nhẹ hơn khoảng 15–20% so với mức tạ đẩy ghế bằng.',
    },
    startingPosture: [
      'Ngồi vững chắc trên ghế dốc, tựa lưng sát vào đệm.',
      'Khóa 2 bả vai ép chặt vào thành ghế (Retraction & Depression).',
      'Đưa 2 quả tạ lên ngang xương quai xanh ngực trên, cùi chỏ mở góc 45° so với thân người.',
      'Chân đạp vững trên sàn.',
    ],
    executionSteps: [
      {
        phase: '1. Hạ tạ xuống (Eccentric)',
        description: 'Hạ tạ chậm rãi trong 3 giây theo góc chéo tự nhiên hướng về mép ngoài của ngực trên (xương quai xanh).',
        cue: 'Cảm nhận phần ngực sát cổ và xương quai xanh được kéo căng tối đa.',
      },
      {
        phase: '2. Đẩy tạ lên (Concentric)',
        description: 'Đẩy tạ dứt khoát theo phương thẳng đứng hướng nhẹ vào trong, thẳng trên trần nhà.',
        cue: 'Giữ bả vai dán chặt trên ghế suốt pha đẩy, không vươn vai lên theo tạ.',
      },
      {
        phase: '3. Đỉnh (Top)',
        description: 'Siết ngực trên 1 giây ở đỉnh, tay không khóa cứng cùi chỏ.',
        cue: 'Giữ độ căng trên ngực trên.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Ghế dốc quá cao (> 60 độ)',
        consequence: 'Toàn bộ lực dồn vào vai trước (Front Delt), ngực trên hầu như không phát triển.',
        fix: 'Hạ ghế xuống nấc 30 độ.',
      },
      {
        mistake: 'Vươn vai về trước ở đỉnh đẩy (Protraction)',
        consequence: 'Mất vị trí khóa an toàn của khớp vai, dễ viêm gân vai.',
        fix: 'Luôn giữ hai bả vai khóa cứng dán chặt vào mặt đệm ghế.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Hít sâu khi hạ tạ xuống ngực trên → Thở ra khi đẩy tạ lên cao.',
      tempo: '3 - 0 - 1 - 0 (3 giây hạ chậm, 1 giây đẩy mạnh lên).',
      explanation: 'Tập trung hạ chậm để kích thích tối đa sợi cơ ngực trên.',
    },
    biomechanicalCue: 'Cùi chỏ đi theo góc 45°, đẩy tạ như hội tụ về một điểm trên trần nhà ngay trước trán.',
    safetyWarning: 'Không để tạ rơi chệch hướng về phía mặt khi cơ đã mỏi.',
  },

  // 7. GOBLET SQUAT (NGỒI XỔM ÔM TẠ)
  'goblet-squat': {
    id: 'goblet-squat',
    nameVi: 'Goblet Squat (Ngồi Xổm Ôm Tạ Trước Ngực)',
    nameEn: 'Dumbbell Goblet Squat',
    category: 'Đùi Trước & Mông (Quads & Glutes)',
    equipment: '1 quả tạ đơn vừa (8kg–16kg) hoặc Tạ ấm (Kettlebell)',
    targetMuscles: {
      primary: 'Cơ tứ đầu đùi (Quads), Cơ mông lớn (Gluteus Maximus)',
      secondary: 'Cơ khép đùi (Adductors), Cơ lõi (Core/Abs), Đùi sau (Hamstrings)',
    },
    equipmentSetup: {
      benchSetting: 'Không dùng ghế (hoặc dùng ghế bằng đặt phía sau làm cữ ngồi đo độ sâu nếu mới tập).',
      padPosition: 'Chân đứng rộng bằng vai hoặc rộng hơn vai 10-15cm. Mũi chân mở chéo ra ngoài một góc 20°–30° theo hướng xoay tự nhiên của khớp hông.',
      weightSelectionAdvice: 'Bắt đầu với quả tạ 8kg–12kg để hoàn thiện biên độ sâu trước khi tăng tạ.',
    },
    startingPosture: [
      'Hai tay bưng quả tạ đơn thẳng đứng trước xương ức (như bưng chiếc cúp chén Goblet).',
      'Quả tạ áp sát vào ngực suốt cả bài tập. Cùi chỏ hướng thẳng xuống đất.',
      'Gồng cứng cơ bụng (Brace Core), mắt nhìn thẳng về trước (không ngửa cổ nhìn trần, không cúi nhìn đất).',
      'Phân bổ đều trọng tâm lên 3 điểm của bàn chân: gót chân, gốc ngón cái, gốc ngón út (Foot Tripod).',
    ],
    executionSteps: [
      {
        phase: '1. Hạ người xuống (Eccentric)',
        description: 'Đồng thời gập hông và gập gối, hạ mông xuống giữa hai gót chân như ngồi vào chiếc ghế thấp. Đầu gối MỞ THEO HƯỚNG MŨI CHÂN.',
        cue: 'Để hai cùi chỏ lọt vào giữa hai đầu gối ở đáy chuyển động.',
      },
      {
        phase: '2. Đáy squat (Parallel / Deep)',
        description: 'Hạ sâu cho đến khi nếp gấp hông nằm ngang bằng hoặc thấp hơn đỉnh đầu gối (đùi song song sàn). Lưng vẫn giữ thẳng tắp.',
        cue: 'Ngực luôn ưỡn cao, tạ vẫn áp sát ngực, không để tạ kéo ngả chúi người ra trước.',
      },
      {
        phase: '3. Đạp lên (Concentric)',
        description: 'Đạp mạnh toàn bộ bàn chân xuống sàn, đẩy hông thẳng lên trên và trở về tư thế đứng ban đầu. Siết nhẹ cơ mông ở đỉnh.',
        cue: 'Đẩy cả người lên như một khối thống nhất, không nhấc mông lên trước ngực.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Đầu gối chụm vào trong (Knee Valgus)',
        consequence: 'Dây chằng chéo trước (ACL) và sụn chêm khớp gối bị vặn xoắn chịu lực rất nguy hiểm.',
        fix: 'Luôn chủ động đẩy hai đầu gối hướng ra ngoài theo ngón chân cái.',
      },
      {
        mistake: 'Nhón gót chân lên khỏi mặt đất khi ngồi xuống',
        consequence: 'Dồn áp lực cực đại vào gân bánh chè gây đau buốt đầu gối.',
        fix: 'Đạp phẳng toàn bộ bàn chân xuống đất, nếu gân cổ chân cứng có thể kê nhẹ 1 miếng tạ mỏng dưới gót.',
      },
      {
        mistake: 'Cong lưng dưới (Butt Wink)',
        consequence: 'Gây đau thắt lưng.',
        fix: 'Chỉ squat sâu đến biên độ mà lưng vẫn giữ được độ thẳng tự nhiên.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Đứng thẳng hít sâu phồng bụng nén hơi (Valsalva) → Nín thở gồng bụng hạ xuống đáy → Vượt qua nửa đường đẩy lên thì thở ra.',
      tempo: '3 - 1 - 1 - 0 (3 giây hạ sâu từ từ, 1 giây giữ thăng bằng ở đáy, 1 giây đạp mạnh đứng dậy).',
      explanation: 'Ôm tạ trước ngực tạo đối trọng hoàn hảo giúp người mới tập giữ lưng thẳng tự nhiên dễ dàng nhất.',
    },
    biomechanicalCue: 'Tưởng tượng bạn đang ngồi xổm xuống giữa hai chân chứ không phải ngồi ra sau.',
    safetyWarning: 'Nếu mất thăng bằng, hãy đẩy quả tạ rơi ra phía trước và lùi người lại, không ôm tạ ngã theo.',
  },

  // 8. BƯỚC CHÙNG CHÂN TẠ ĐƠN (WALKING LUNGE)
  'walking-lunge': {
    id: 'walking-lunge',
    nameVi: 'Bước Chùng Chân Tạ Đơn',
    nameEn: 'Dumbbell Walking / Static Lunge',
    category: 'Đùi Trước & Mông (Unilateral Quads & Glutes)',
    equipment: 'Cặp tạ đơn vừa (4kg–10kg mỗi bên)',
    targetMuscles: {
      primary: 'Cơ đùi trước (Quads), Cơ mông lớn (Glutes)',
      secondary: 'Cơ đùi sau, Bắp chuối, Cơ thăng bằng cơ lõi',
    },
    equipmentSetup: {
      padPosition: 'Không gian đi lại bằng phẳng dài từ 5m–10m hoặc tập tại chỗ.',
      distance: 'Độ dài bước chân: Bước một bước dài khoảng 2 đến 2.5 bàn chân sao cho khi hạ xuống, cả 2 đầu gối đều tạo góc khoảng 90°.',
      weightSelectionAdvice: 'Bắt đầu bằng trọng lượng cơ thể (Bodyweight) trước khi cầm tạ đơn.',
    },
    startingPosture: [
      'Đứng thẳng người, hai tay cầm hai quả tạ buông xuôi hai bên hông.',
      'Hai chân mở rộng bằng hông (không đứng trên một đường thẳng kẻ chỉ để giữ thăng bằng).',
      'Mắt nhìn về phía trước, vai thả lỏng, siết cơ bụng.',
    ],
    executionSteps: [
      {
        phase: '1. Bước và Hạ (Eccentric)',
        description: 'Bước một chân dài về phía trước, đặt bàn chân phẳng xuống sàn. Hạ hông thẳng đứng xuống đất sao cho đầu gối chân sau gập vuông góc 90° và cách mặt sàn 2–3cm.',
        cue: 'Đầu gối chân trước nằm thẳng trục với cổ chân, không xiên vẹo.',
      },
      {
        phase: '2. Vị trí đáy',
        description: 'Dừng lại 0.5s ở đáy. Thân người hơi nghiêng nhẹ về trước 10° để tăng tải trọng vào cơ mông chân trước.',
        cue: 'Cảm nhận đùi trước và mông chân trước gánh 80% trọng lượng.',
      },
      {
        phase: '3. Đạp lên (Concentric)',
        description: 'Dồn lực đạp gót chân trước xuống sàn để đẩy người đứng dậy, bước chân sau lên tiếp nối bước tiếp theo.',
        cue: 'Đạp bằng chân trước, không dùng mũi chân sau giậm đẩy người lên.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Bước chân quá ngắn làm đầu gối trước nhao quá xa vượt mũi chân',
        consequence: 'Gây áp lực lớn lên khớp gối trước.',
        fix: 'Bước dài hơn một chút để cẳng chân trước giữ gần như vuông góc với sàn.',
      },
      {
        mistake: 'Bước hai chân trên cùng một đường thẳng như đi trên dây',
        consequence: 'Mất thăng bằng, chao đảo ngã sang hai bên.',
        fix: 'Giữ khoảng cách hai chân rộng bằng chiều rộng khung xương chậu (ray tàu hỏa).',
      },
    ],
    breathingAndTempo: {
      breathing: 'Hít sâu khi bước chân và hạ gối xuống → Thở ra khi đạp gót chân trước đứng dậy.',
      tempo: '2 - 0 - 1 - 0 (2 giây hạ kiểm soát, 1 giây bước lên).',
      explanation: 'Kiểm soát nhịp độ giúp các nhóm cơ giữ thăng bằng nhỏ ở khớp cổ chân và hông được kích hoạt.',
    },
    biomechanicalCue: 'Trọng tâm hạ thẳng đứng như thang máy, không lao xô về phía trước như tàu lượn.',
    safetyWarning: 'Không để đầu gối sau đập mạnh xuống sàn xi măng gây chấn thương xương bánh chè.',
  },

  // 9. DUMBBELL ROMANIAN DEADLIFT (RDL)
  'dumbbell-rdl': {
    id: 'dumbbell-rdl',
    nameVi: 'Bản Lề Hông RDL Với Tạ Đơn',
    nameEn: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'Đùi Sau & Mông (Hamstrings & Glutes / Posterior Chain)',
    equipment: 'Cặp tạ đơn vừa (6kg–14kg mỗi bên)',
    targetMuscles: {
      primary: 'Cơ đùi sau (Hamstrings), Cơ mông lớn (Gluteus Maximus)',
      secondary: 'Cơ dựng gai cột sống (Erector Spinae), Lưng trên',
    },
    equipmentSetup: {
      padPosition: 'Đứng trên mặt sàn phẳng chắc chắn.',
      distance: 'Hai chân đứng rộng bằng hông, hai bàn chân song song hoặc hơi mở nhẹ 5°.',
      weightSelectionAdvice: 'Chọn mức tạ bạn có thể cầm chắc mà lưng không bị cong vòng.',
    },
    startingPosture: [
      'Đứng thẳng, hai tay cầm hai quả tạ đặt ngay trước mặt đùi.',
      'Khóa bả vai về sau (Retraction), ưỡn ngực, giữ lưng thẳng tắp.',
      'Đầu gối hơi MỞ KHÓA NHẸ (chùng nhẹ khoảng 15°) và KHÓA CỐ ĐỊNH góc gối này suốt toàn bộ bài tập.',
    ],
    executionSteps: [
      {
        phase: '1. Đẩy hông ra sau (Hip Hinge / Eccentric)',
        description: 'Chủ động ĐẨY MÔNG RA PHÍA SAU như đang dùng mông đóng cánh cửa xe ô tô. Để hai quả tạ lướt SÁT ỐNG CHÂN đi xuống.',
        cue: 'Đây là chuyển động gập bản lề hông (Hinge), KHÔNG PHẢI chuyển động ngồi xổm (Squat). Đầu gối không được gập thêm.',
      },
      {
        phase: '2. Điểm căng đùi sau (Stretch Point)',
        description: 'Hạ tạ đến ngang dưới đầu gối hoặc giữa cẳng chân cho đến khi bạn cảm thấy cơ đùi sau CĂNG CỰC ĐẠI. Dừng lại 1 giây.',
        cue: 'Lưng dưới vẫn phải phẳng tuyệt đối như mặt bàn, không cúi thêm bằng cách gù lưng.',
      },
      {
        phase: '3. Siết hông về trước (Concentric)',
        description: 'Siết chặt cơ mông và đùi sau, đẩy hông về phía trước để đưa thân người đứng thẳng trở lại.',
        cue: 'Đứng thẳng lên, KHÔNG ưỡn ngửa thắt lưng quá đà ở đỉnh (No hyperextension).',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Gù lưng tôm để với tạ chạm sàn',
        consequence: 'Dồn toàn bộ tải trọng tạ vào đĩa đệm lưng dưới, nguyên nhân số 1 gây thoát vị khi tập Deadlift.',
        fix: 'Tạ chỉ cần xuống ngang dưới đầu gối. Điểm dừng là khi đùi sau căng hết cỡ, không phải chạm đất.',
      },
      {
        mistake: 'Để tạ trôi xa khỏi cẳng chân',
        consequence: 'Tạo cánh tay đòn dài làm tăng gấp 3 lần áp lực bẻ cong cột sống thắt lưng.',
        fix: 'Luôn giữ tạ cọ sát vào đùi và ống chân trong suốt hành trình.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Đứng thẳng hít sâu nén bụng → Đẩy mông ra sau nín thở giữ lưng vững → Đẩy hông lên gần thẳng thì thở ra.',
      tempo: '3 - 1 - 1 - 0 (3 giây hạ trượt chậm căng đùi sau, 1 giây giữ căng, 1 giây kéo lên mạnh mẽ).',
      explanation: 'Pha eccentric 3 giây kéo căng cơ đùi sau tạo kích thích phì đại cơ bắp (Hypertrophy) mạnh nhất.',
    },
    biomechanicalCue: 'Hãy tưởng tượng có một sợi dây buộc vào hông bạn và đang kéo hông bạn giật lùi về bức tường phía sau.',
    safetyWarning: 'Ngay khi cảm thấy lưng dưới bắt đầu cong nhẹ, hãy dừng lại và đẩy người lên ngay lập tức.',
  },

  // 10. GÁNH TẠ ĐÒN TRONG KHUNG (BARBELL BACK SQUAT)
  'barbell-back-squat': {
    id: 'barbell-back-squat',
    nameVi: 'Gánh Tạ Đòn Trong Khung (Barbell Back Squat)',
    nameEn: 'Barbell Back Squat',
    category: 'Đùi & Toàn Thân (Full Lower Body Compound)',
    equipment: 'Khung gánh tạ an toàn (Power Rack) + Thanh đòn Olympic 20kg',
    targetMuscles: {
      primary: 'Cơ tứ đầu đùi (Quads), Cơ mông (Glutes)',
      secondary: 'Cơ khép, Đùi sau, Cơ dựng sống, Cơ bụng',
    },
    equipmentSetup: {
      cableSetting: 'Thanh đòn đặt trên móc J-hooks ở chiều cao ngang nách/ngực trên (không đặt quá cao phải kiễng chân lấy tạ).',
      attachment: 'Thanh đòn Olympic 2.2m (20kg) kèm chốt khóa kẹp tạ (Collars) hai đầu bắt buộc.',
      padPosition: 'Chốt thanh an toàn (Safety Pins) đặt ở độ cao thấp hơn đáy squat của bạn khoảng 5cm để đỡ tạ nếu bị đuối sức.',
      weightSelectionAdvice: 'Khởi động với đòn không 20kg để làm nóng khớp gối và hông.',
    },
    startingPosture: [
      'Chui dưới đòn, đặt thanh đòn vững chãi trên khối cơ cầu vai (High Bar) hoặc gai xương bả vai (Low Bar). TUYỆT ĐỐI không đặt đè lên đốt sống cổ C7.',
      'Hai tay nắm thanh đòn hẹp nhất có thể trong giới hạn linh hoạt khớp vai để ép cứng bả vai tạo giá đỡ đệm thịt.',
      'Đứng thẳng nhấc tạ ra khỏi giá, lùi lại 2 bước chân dứt khoát (Walkout 3 bước chuẩn mực).',
      'Chân rộng bằng vai, mũi chân mở 20-30°, hít một hơi thật sâu xuống khoang bụng và gồng cứng cơ hoành (Valsalva 360°).',
    ],
    executionSteps: [
      {
        phase: '1. Hạ tạ (Eccentric)',
        description: 'Mở hông và đầu gối đồng thời, hạ thân người xuống có kiểm soát trong 3 giây. Đầu gối mở theo hướng mũi chân.',
        cue: 'Giữ thanh đòn di chuyển theo một đường thẳng đứng tuyệt đối rơi trên giữa bàn chân (Mid-foot).',
      },
      {
        phase: '2. Đáy squat (Parallel / Below Parallel)',
        description: 'Hạ sâu cho đến khi nếp gấp hông ngang hoặc sâu hơn mặt trên đầu gối. Ngực mở, thân người giữ độ nghiêng vững chắc.',
        cue: 'Không nảy tạ bằng cách thả lỏng khớp ở đáy.',
      },
      {
        phase: '3. Đạp lên (Concentric)',
        description: 'Đạp mạnh mẽ cả bàn chân xuống sàn nhà, đẩy ngực và hông lên cùng tốc độ cho đến khi đứng thẳng hoàn toàn.',
        cue: 'Nghĩ về việc dùng chân đạp đất ra xa khỏi bạn.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Khóa gối ưỡn ngược khớp ở đỉnh (Knee hyperextension)',
        consequence: 'Gây mòn sụn chêm đầu gối.',
        fix: 'Đứng thẳng siết nhẹ mông, giữ khớp gối mở mềm mại.',
      },
      {
        mistake: 'Good Morning Squat (Mông bắn lên trước còn ngực đổ gục về trước)',
        consequence: 'Biến bài squat thành gánh tạ bằng thắt lưng, gãy form nguy hiểm.',
        fix: 'Tập trung đẩy ngực lên trước khi đạp đáy, giảm tải trọng tạ.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Hít sâu nén bụng ở đỉnh → Nín thở suốt quá trình hạ và vượt qua điểm nặng → Thở ra khi gần đứng thẳng.',
      tempo: '3 - 1 - 1 - 0 (3s hạ, 1s dừng đáy, 1s đạp lên dứt khoát).',
      explanation: 'Nén khí Valsalva tạo áp lực nội ổ bụng (IAP) như túi khí bảo vệ cột sống khỏi lực nén.',
    },
    biomechanicalCue: 'Giữ trọng tâm đòn tạ luôn nằm trên đường thẳng cắt qua giữa mu bàn chân trong suốt toàn bộ chu kỳ chuyển động.',
    safetyWarning: 'Luôn cài thanh đỡ an toàn (Safety bars) khi tập một mình trong khung Power Rack.',
  },

  // 11. BULGARIAN SPLIT SQUAT (GÁC CHÂN LÊN GHẾ)
  'bulgarian-split-squat': {
    id: 'bulgarian-split-squat',
    nameVi: 'Bulgarian Split Squat (Gác Chân Lên Ghế)',
    nameEn: 'Bulgarian Split Squat',
    category: 'Mông & Đùi Từng Chân (Glutes & Quads)',
    equipment: 'Ghế bằng (Flat Bench) + Cặp tạ đơn vừa',
    targetMuscles: {
      primary: 'Cơ mông lớn (Gluteus Maximus), Cơ đùi trước (Quads)',
      secondary: 'Cơ khép đùi, Cơ bắp chân, Cơ thăng bằng',
    },
    equipmentSetup: {
      benchSetting: 'Ghế bằng phẳng chiều cao khoảng 35–45cm (ngang tầm dưới đầu gối).',
      distance: 'Đứng cách ghế khoảng 2 đến 3 bước chân. Mu bàn chân sau gác lên mặt đệm ghế.',
      weightSelectionAdvice: 'Khởi động không tạ để tìm cự ly chân phù hợp.',
    },
    startingPosture: [
      'Gác mu bàn chân sau lên ghế. Bàn chân trước đặt vững chãi phía trước.',
      'Hai tay cầm tạ đơn buông hai bên hoặc ôm một quả tạ trước ngực.',
      'Thân người hơi ngả về trước một góc 15° để kéo giãn và nhắm trúng cơ mông chân trước.',
    ],
    executionSteps: [
      {
        phase: '1. Hạ xuống (Eccentric)',
        description: 'Hạ hông xuống và hơi chếch ra sau theo đường chéo cho đến khi đùi chân trước song song với mặt sàn.',
        cue: '85% trọng lượng dồn lên gót chân trước, chân sau chỉ đóng vai trò điểm tựa giữ thăng bằng.',
      },
      {
        phase: '2. Đáy',
        description: 'Dừng lại 1 giây ở đáy khi cảm nhận cơ mông chân trước căng tột độ.',
        cue: 'Đầu gối chân trước ổn định, không rung lắc.',
      },
      {
        phase: '3. Đạp lên (Concentric)',
        description: 'Đạp mạnh gót chân trước xuống sàn đẩy người đứng lên trở lại vị trí ban đầu.',
        cue: 'Tập trung phát lực hoàn toàn từ cơ mông và đùi chân trước.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Dồn quá nhiều trọng lượng vào chân sau gác trên ghế',
        consequence: 'Gây đau thắt cơ gập hông (Hip flexor) chân sau.',
        fix: 'Thả lỏng chân sau, dồn 85% tâm trí và lực vào bàn chân trước.',
      },
      {
        mistake: 'Thân người ưỡn thẳng đứng cứng ngắc',
        consequence: 'Làm căng khớp gối và giảm kích hoạt cơ mông.',
        fix: 'Chủ động nghiêng nhẹ thân người về trước 15 độ.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Hít sâu khi hạ người xuống → Thở ra khi đạp chân trước đứng dậy.',
      tempo: '3 - 1 - 1 - 0 (3s hạ chậm rãi, 1s giữ đáy, 1s đạp lên).',
      explanation: 'Đây là bài tập khắc phục lệch cơ 2 bên chân hiệu quả nhất.',
    },
    biomechanicalCue: 'Nghĩ về việc hạ hông xuống và ra sau như thể bạn muốn chạm mông vào chiếc ghế phía sau.',
    safetyWarning: 'Nếu thấy mất thăng bằng, hãy tập gần cột hoặc tường để có thể vịn tay khi cần.',
  },

  // 12. DANG TẠ ĐƠN SANG NGANG (LATERAL RAISE)
  'lateral-raise': {
    id: 'lateral-raise',
    nameVi: 'Dang Tạ Đơn Sang Ngang',
    nameEn: 'Dumbbell Lateral Raise',
    category: 'Vai Giữa (Lateral Deltoid)',
    equipment: 'Cặp tạ đơn nhẹ (2kg–6kg)',
    targetMuscles: {
      primary: 'Cơ delta giữa (Lateral Deltoid - Tạo độ rộng bờ vai)',
      secondary: 'Cơ cầu vai trên (Upper Trapezius), Cơ trên gai (Supraspinatus)',
    },
    equipmentSetup: {
      padPosition: 'Đứng thẳng hoặc ngồi trên mép ghế bằng.',
      weightSelectionAdvice: 'BẮT BUỘC DÙNG TẠ NHẸ. Cơ vai giữa là bó cơ nhỏ, tập nặng sẽ bị cầu vai cướp lực hoàn toàn.',
    },
    startingPosture: [
      'Hai tay cầm tạ đơn để trước đùi, lòng bàn tay hướng vào nhau.',
      'Hai chân mở rộng bằng vai, gối hơi chùng nhẹ, thân người HƠI ĐỔ VỀ TRƯỚC 10°–15°.',
      'Cùi chỏ hơi cong nhẹ một góc 15° và KHÓA CỨNG góc này (không co duỗi khuỷu tay trong khi dang).',
      'Hạ xương bả vai xuống (Depress Scapula) để loại bỏ cơ cầu vai.',
    ],
    executionSteps: [
      {
        phase: '1. Dang tạ lên (Concentric)',
        description: 'Dang hai quả tạ sang hai bên theo mặt phẳng xương bả vai (Scaption Plane - chếch về phía trước khoảng 15°-20° so với thân, không dang thẳng tưng ngang 180°).',
        cue: 'Dẫn đường bằng cùi chỏ. Cùi chỏ luôn cao hơn hoặc ngang bằng cổ tay.',
      },
      {
        phase: '2. Đỉnh (Top)',
        description: 'Nâng tạ đến khi cánh tay song song với mặt sàn (ngang tầm vai). Dừng lại 1 giây.',
        cue: 'Tưởng tượng bạn đang rót nước từ hai bình nước (ngón út hơi nhấc cao hơn ngón cái một chút).',
      },
      {
        phase: '3. Hạ tạ xuống (Eccentric)',
        description: 'Hạ tạ thật chậm rãi trong 3 giây chống lại trọng lực.',
        cue: 'Dừng tạ khi cách đùi khoảng 10cm để giữ lực căng liên tục, không để tạ chạm đùi nghỉ ngơi.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Nhún gối lắc hông lấy đà (Cheating swing)',
        consequence: 'Dùng lực quán tính đẩy tạ, vai giữa không nhận được kích thích.',
        fix: 'Đứng dựa lưng vào tường hoặc ngồi trên ghế để triệt tiêu đà quán tính.',
      },
      {
        mistake: 'Cổ tay giơ cao hơn cùi chỏ',
        consequence: 'Kích hoạt cơ vai trước và cẳng tay, giảm lực tác động lên vai giữa.',
        fix: 'Luôn luôn tập trung nâng cùi chỏ lên trước.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Thở ra khi dang tạ lên ngang vai → Hít vào khi hạ tạ từ từ xuống đùi.',
      tempo: '3 - 1 - 1 - 0 (3s hạ chậm, 1s giữ ngang vai, 1s dang lên).',
      explanation: 'Pha hạ chậm 3 giây là bí quyết làm bờ vai bùng nổ cơ bắp.',
    },
    biomechanicalCue: 'Hãy nghĩ về việc đẩy hai quả tạ ra xa hai bên bức tường chứ không phải nhấc chúng lên trời.',
    safetyWarning: 'Không nâng tạ cao quá tầm vai vì sẽ chèn ép gân cơ trên gai vào mỏm cùng vai.',
  },

  // 13. CUỐN TẠ ĐƠN TƯ THẾ BÚA (HAMMER CURL)
  'hammer-curl': {
    id: 'hammer-curl',
    nameVi: 'Cuốn Tạ Đơn Tư Thế Búa',
    nameEn: 'Dumbbell Hammer Curl',
    category: 'Tay Trước & Cẳng Tay (Brachialis & Forearms)',
    equipment: 'Cặp tạ đơn',
    targetMuscles: {
      primary: 'Cơ cánh tay (Brachialis), Cơ cánh tay quay (Brachioradialis - cẳng tay)',
      secondary: 'Cơ nhị đầu bắp tay (Biceps Brachii)',
    },
    equipmentSetup: {
      weightSelectionAdvice: 'Chọn mức tạ bạn có thể cuốn mà không cần ngả người ra sau lấy đà.',
    },
    startingPosture: [
      'Đứng thẳng người hoặc ngồi ghế, hai tay cầm tạ đơn xuôi theo thân.',
      'Hai lòng bàn tay quay vào nhau đối diện (Neutral Grip) như đang cầm cán búa.',
      'Khóa chặt cùi chỏ sát vào hai bên mạn sườn, vai hạ thấp ra sau.',
    ],
    executionSteps: [
      {
        phase: '1. Cuốn lên (Concentric)',
        description: 'Cuốn tạ lên phía trước ngực trong khi vẫn giữ nguyên lòng bàn tay hướng vào nhau.',
        cue: 'Cùi chỏ giữ nguyên vị trí, không được đưa ra trước.',
      },
      {
        phase: '2. Đỉnh co (Peak)',
        description: 'Cuốn lên đến khi tạ gần chạm vai trước. Siết chặt bắp tay và cẳng tay trong 1 giây.',
        cue: 'Cảm nhận khối cơ nằm giữa bắp tay và tay sau (Brachialis) căng cứng.',
      },
      {
        phase: '3. Hạ tạ xuống (Eccentric)',
        description: 'Hạ tạ chậm rãi trong 2–3 giây cho đến khi tay duỗi thẳng hoàn toàn.',
        cue: 'Kiểm soát đường hạ tạ.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Vung vẩy cùi chỏ về trước để đỡ tạ',
        consequence: 'Dùng vai trước chịu lực thay vì bắp tay.',
        fix: 'Dán chặt cùi chỏ vào xương sườn.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Thở ra khi cuốn tạ lên → Hít vào khi hạ tạ xuống.',
      tempo: '2 - 1 - 1 - 0 (2s hạ, 1s siết đỉnh, 1s cuốn lên).',
      explanation: 'Tập bài Hammer Curl giúp làm dày bắp tay khi nhìn từ phía trước và tăng sức mạnh cầm nắm.',
    },
    biomechanicalCue: 'Tưởng tượng bạn đang dùng quả tạ đóng chiếc đinh thẳng đứng trước mặt.',
    safetyWarning: 'Không xoay vặn cổ tay trong suốt quá trình cuốn.',
  },

  // 14. CUỐN TẠ ĐÒN (BARBELL CURL)
  'barbell-curl': {
    id: 'barbell-curl',
    nameVi: 'Cuốn Tạ Đòn Ngắn',
    nameEn: 'EZ-Bar / Barbell Curl',
    category: 'Bắp Tay Trước (Biceps Brachii)',
    equipment: 'Thanh đòn ngắn thẳng hoặc đòn ziczac EZ-Bar',
    targetMuscles: {
      primary: 'Cơ nhị đầu bắp tay trước - Đầu ngắn và đầu dài (Biceps Short & Long Head)',
      secondary: 'Cơ cẳng tay',
    },
    equipmentSetup: {
      attachment: 'Khuyến khích dùng đòn EZ-Bar vì góc uốn cong giúp giảm áp lực xoắn lên khớp cổ tay.',
      weightSelectionAdvice: 'Chọn mức tạ kiểm soát để không dùng đà hông.',
    },
    startingPosture: [
      'Đứng thẳng, hai chân mở rộng bằng vai, hai tay nắm thanh đòn ngửa lòng bàn tay lên (Supinated Grip).',
      'Độ rộng tay bằng chiều rộng của vai.',
      'Cùi chỏ ép nhẹ hai bên sườn, vai kéo ra sau hạ thấp.',
    ],
    executionSteps: [
      {
        phase: '1. Cuốn lên (Concentric)',
        description: 'Dùng lực bắp tay cuốn thanh đòn theo hình bán nguyệt lên phía trên ngực.',
        cue: 'Giữ thân mình bất động, chỉ có cẳng tay gập lên.',
      },
      {
        phase: '2. Đỉnh',
        description: 'Dừng 1 giây ở điểm cao nhất, siết cứng hai quả chuột bắp tay.',
        cue: 'Không để thanh đòn chạm vào ngực nghỉ ngơi.',
      },
      {
        phase: '3. Hạ tạ (Eccentric)',
        description: 'Hạ thanh đòn xuống từ từ trong 3 giây cho đến khi bắp tay duỗi thẳng gần như hoàn toàn.',
        cue: 'Cảm nhận cơ bắp tay căng chịu lực suốt pha hạ.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Ngửa người ra sau giật tạ (Back swing)',
        consequence: 'Gây đau lưng dưới và làm mất tác dụng lên bắp tay.',
        fix: 'Gồng chặt cơ mông và cơ bụng, đứng thẳng tắp.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Thở ra khi cuốn thanh đòn lên → Hít sâu khi hạ thanh đòn xuống.',
      tempo: '3 - 1 - 1 - 0 (3s hạ chậm, 1s siết đỉnh, 1s cuốn lên).',
      explanation: 'Giúp xây dựng đỉnh con chuột bắp tay (Bicep Peak) cao và nét.',
    },
    biomechanicalCue: 'Cố định cùi chỏ như chiếc bản lề cửa sổ, chỉ xoay quanh một trục duy nhất.',
    safetyWarning: 'Nếu thấy đau nhói cẳng tay gần cổ tay với đòn thẳng, hãy đổi ngay sang đòn EZ-bar cong.',
  },

  // 15. DUỖI TAY SAU QUA ĐẦU VỚI CÁP (OVERHEAD TRICEP EXTENSION)
  'overhead-tricep-extension': {
    id: 'overhead-tricep-extension',
    nameVi: 'Duỗi Tay Sau Qua Đầu Với Cáp',
    nameEn: 'Cable Overhead Tricep Extension',
    category: 'Tay Sau - Đầu Dài (Triceps Long Head)',
    equipment: 'Giàn cáp đơn + Dây thừng (Rope)',
    targetMuscles: {
      primary: 'Đầu dài cơ tam đầu bắp tay sau (Long Head - bó cơ lớn nhất của tay sau)',
      secondary: 'Cơ vai, Cơ lõi',
    },
    equipmentSetup: {
      cableSetting: 'Chốt ròng rọc cáp ở tầm ngang ngực hoặc tầm thấp.',
      attachment: 'Dây thừng đôi (Rope).',
      distance: 'Quay lưng lại với giàn cáp, bước một chân lên trước một chân sau để đứng vững.',
      weightSelectionAdvice: 'Mức tạ vừa phải để kiểm soát được độ căng sau đầu.',
    },
    startingPosture: [
      'Quay lưng về phía máy cáp, cầm dây thừng đưa ra phía sau gáy.',
      'Hai cùi chỏ hướng về phía trước và áp sát hai bên thái dương/tai.',
      'Thân người nghiêng về trước một góc 30°–45°, một chân trước một chân sau vững vàng.',
    ],
    executionSteps: [
      {
        phase: '1. Đẩy duỗi tay (Concentric)',
        description: 'Duỗi thẳng cẳng tay về phía trước theo hướng chéo lên trên cho đến khi cánh tay duỗi thẳng.',
        cue: 'Cùi chỏ giữ nguyên vị trí cạnh tai, không mở bè sang hai bên.',
      },
      {
        phase: '2. Tách dây ở đỉnh',
        description: 'Tách nhẹ hai đầu dây thừng ở vị trí duỗi thẳng hoàn toàn, siết chặt tay sau 1 giây.',
        cue: 'Cảm nhận đầu dài cơ tam đầu căng cứng.',
      },
      {
        phase: '3. Hạ tạ về sau gáy (Eccentric)',
        description: 'Gập cẳng tay chậm rãi về lại sau gáy trong 3 giây cho đến khi cảm thấy cơ tay sau kéo giãn sâu.',
        cue: 'Càng giãn sâu ở sau đầu, đầu dài cơ tay sau càng phát triển mạnh mẽ.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Cùi chỏ mở banh rộng sang hai bên tai',
        consequence: 'Giảm độ giãn của đầu dài và tăng áp lực bẻ khớp khuỷu tay.',
        fix: 'Chủ động khép hai cùi chỏ hướng về phía trước song song nhau.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Thở ra khi đẩy duỗi tay ra trước → Hít sâu khi gập tay về sau gáy.',
      tempo: '3 - 1 - 1 - 0 (3s gập sau gáy kéo giãn, 1s dừng giãn, 1s duỗi thẳng tay).',
      explanation: 'Đầu dài cơ tay sau chỉ được kéo giãn tối đa khi cánh tay đưa qua đầu.',
    },
    biomechanicalCue: 'Giữ cùi chỏ cố định hướng về phía trước như hai nòng súng ngắm.',
    safetyWarning: 'Không để tạ giật mạnh làm quặt khớp khuỷu tay về sau gáy.',
  },

  // 16. CUỐN ĐÙI SAU (LEG CURL)
  'leg-curl': {
    id: 'leg-curl',
    nameVi: 'Cuốn Đùi Sau',
    nameEn: 'Lying / Seated Leg Curl',
    category: 'Đùi Sau (Hamstrings)',
    equipment: 'Máy cuốn đùi sau (Leg Curl Machine)',
    targetMuscles: {
      primary: 'Toàn bộ nhóm cơ gân kheo đùi sau (Biceps Femoris, Semitendinosus, Semimembranosus)',
      secondary: 'Bắp chuối (Gastrocnemius)',
    },
    equipmentSetup: {
      padPosition: 'Chỉnh con lăn đệm chân tì ngay dưới bắp chuối, ngay TRÊN gân gót Achilles khoảng 2-3cm. Tuyệt đối không để con lăn đè lên gót chân hoặc khớp mắt cá.',
      benchSetting: 'Nếu máy nằm: Chỉnh bản lề quay của máy thẳng hàng với trục khớp gối của bạn. Nếu máy ngồi: Chỉnh đệm đùi ép chặt xuống để khóa đùi không bị nhấc lên.',
      weightSelectionAdvice: 'Chọn mức tạ bạn có thể cuốn chạm đùi mà không cần giật hông lên.',
    },
    startingPosture: [
      'Nằm sấp áp sát bụng và xương chậu lên mặt đệm (hoặc ngồi thẳng lưng với máy ngồi).',
      'Hai tay nắm chặt tay cầm của máy để ghì chặt thân dưới dính vào đệm.',
      'Cổ chân giữ ở tư thế gập góc 90° (Dorsiflexion - mũi chân hướng về cẳng chân) để tăng lực co.',
    ],
    executionSteps: [
      {
        phase: '1. Cuốn lên (Concentric)',
        description: 'Dùng lực cơ đùi sau cuốn mạnh con lăn về phía mông đến khi chạm gần sát mông.',
        cue: 'Ép chặt xương chậu xuống mặt đệm, không để mông bị nhấc bổng lên.',
      },
      {
        phase: '2. Đỉnh co',
        description: 'Giữ tạ ở điểm sát mông 1 đến 1.5 giây, siết cứng toàn bộ cơ đùi sau.',
        cue: 'Cảm nhận cơ gân kheo co thắt tối đa.',
      },
      {
        phase: '3. Trả tạ (Eccentric)',
        description: 'Hạ tạ từ từ có kiểm soát trong 3 giây cho đến khi chân duỗi thẳng gần hết (không khóa khớp gối).',
        cue: 'Chống lại sức nặng của tạ suốt quá trình hạ.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Nhấc mông và cong thắt lưng lên khỏi đệm khi cuốn',
        consequence: 'Dùng lưng dưới kéo tạ thay vì đùi sau, dễ chấn thương thắt lưng.',
        fix: 'Ghì chặt hông xuống đệm bằng cách bám chắc hai tay cầm kéo ngược lên.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Thở ra dứt khoát khi cuốn tạ về mông → Hít vào chậm rãi khi duỗi chân trở lại.',
      tempo: '3 - 1 - 1 - 0 (3s duỗi chân chậm, 1s siết ở mông, 1s cuốn nhanh).',
      explanation: 'Cô lập hoàn hảo cơ đùi sau giúp cân bằng lực với cơ đùi trước, bảo vệ dây chằng chéo trước ACL.',
    },
    biomechanicalCue: 'Tưởng tượng trục gối của bạn và trục quay của máy là một khối đồng trục hoàn hảo.',
    safetyWarning: 'Không để tạ rơi tự do đập chạm vào khung ở cuối hành trình.',
  },

  // 17. NHÓN BẮP CHUỐI ĐỨNG (STANDING CALF RAISE)
  'standing-calf-raise': {
    id: 'standing-calf-raise',
    nameVi: 'Nhón Bắp Chuối Đứng',
    nameEn: 'Standing Calf Raise',
    category: 'Bắp Chuối (Gastrocnemius & Soleus)',
    equipment: 'Bục đứng cao / Máy nhón bắp chuối / Cặp tạ đơn',
    targetMuscles: {
      primary: 'Cơ bụng chân bắp chuối (Gastrocnemius), Cơ dép (Soleus)',
      secondary: 'Gân gót chân (Achilles Tendon)',
    },
    equipmentSetup: {
      padPosition: 'Đứng nửa bàn chân trước (Ball of foot) lên mép bục, để gót chân tự do lơ lửng ngoài mép bục.',
      weightSelectionAdvice: 'Tập trung vào biên độ chuyển động cực đại (Full ROM) thay vì tạ quá nặng nhấp nhấp.',
    },
    startingPosture: [
      'Đứng thẳng người trên bục, một tay vịn tường hoặc máy để giữ thăng bằng tuyệt đối, tay kia cầm tạ đơn.',
      'Khớp gối giữ thẳng nhưng không khóa khớp (khóa gối làm giảm kích hoạt cơ).',
    ],
    executionSteps: [
      {
        phase: '1. Nhón lên cao tối đa (Concentric)',
        description: 'Đạp mạnh mu bàn chân đẩy toàn bộ cơ thể lên cao hết mức có thể, như một vũ công ba lê kiễng chân.',
        cue: 'Dồn lực qua ngón chân cái và ngón thứ hai để kích hoạt đều cả hai đầu bắp chuối.',
      },
      {
        phase: '2. Dừng ở đỉnh (Peak Contraction)',
        description: 'DỪNG LẠI 2 GIÂY TRỌN VẸN ở điểm cao nhất. Siết cứng bắp chuối.',
        cue: 'Cảm nhận cơ bắp chân co thắt bỏng rát.',
      },
      {
        phase: '3. Hạ sâu hết cỡ (Eccentric & Stretch)',
        description: 'Hạ gót chân từ từ xuống thấp hơn mặt bục trong 3 giây cho đến khi cảm nhận gân gót và bắp chuối được kéo giãn sâu hoàn toàn.',
        cue: 'DỪNG LẠI 1-2 GIÂY ở đáy để triệt tiêu năng lượng đàn hồi của gân gót Achilles.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Nhấp nhấp nhanh như lò xo (Bouncing)',
        consequence: 'Gân gót Achilles tự đàn hồi đẩy người lên mà cơ bắp chuối hầu như không phải làm việc.',
        fix: 'Bắt buộc phải dừng 2 giây ở đỉnh và dừng 2 giây ở đáy kéo giãn.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Thở ra khi nhón lên cao → Hít vào khi hạ sâu gót chân.',
      tempo: '3 - 2 - 1 - 2 (3s hạ sâu, 2s dừng giãn đáy, 1s nhón lên, 2s siết cứng đỉnh).',
      explanation: 'Dừng ở đáy là chìa khóa duy nhất để phá vỡ độ trơ lì của cơ bắp chuối.',
    },
    biomechanicalCue: 'Đẩy gót chân lên cao nhất có thể như bạn đang cố chạm đỉnh đầu vào trần nhà.',
    safetyWarning: 'Không để trượt chân khỏi mép bục gây chấn thương cổ chân.',
  },

  // 18. NÂNG GỐI TREO NGƯỜI (HANGING KNEE RAISE)
  'hanging-knee-raise': {
    id: 'hanging-knee-raise',
    nameVi: 'Nâng Gối Treo Người',
    nameEn: 'Hanging Knee Raise',
    category: 'Cơ Bụng Dưới & Cơ Lõi (Lower Abs & Core)',
    equipment: 'Thanh xà đơn treo tường (Pull-up bar) hoặc Khung thuyền trưởng (Captains Chair)',
    targetMuscles: {
      primary: 'Cơ thẳng bụng dưới (Rectus Abdominis), Cơ gập hông (Iliopsoas)',
      secondary: 'Cơ liên sườn (Obliques), Cơ xô và cẳng tay bám xà',
    },
    equipmentSetup: {
      attachment: 'Xà đơn độ cao vừa tầm với.',
    },
    startingPosture: [
      'Hai tay bám chắc vào xà đơn, độ rộng bằng vai, thả lỏng toàn bộ thân người.',
      'Chủ động rút nhẹ bả vai xuống (Active Hang) để bảo vệ khớp vai không bị giật.',
      'Hai chân khép sát nhau, mũi chân duỗi nhẹ.',
    ],
    executionSteps: [
      {
        phase: '1. Cuộn gối lên (Concentric)',
        description: 'Gập đầu gối và CUỘN XƯƠNG CHẬU VỀ PHÍA NGỰC (Posterior Pelvic Tilt). Đưa đầu gối lên cao ngang ngực hoặc cao hơn rốn.',
        cue: 'Không chỉ đơn thuần nhấc chân lên, mà phải CUỘN XƯƠNG CÙNG HƯỚNG VỀ PHÍA NÁCH.',
      },
      {
        phase: '2. Siết bụng ở đỉnh',
        description: 'Dừng lại 1 giây ở điểm cao nhất, thở hết không khí ra để cơ bụng dưới ép lại tối đa.',
        cue: 'Cảm nhận cơ bụng dưới cuộn chặt.',
      },
      {
        phase: '3. Hạ chân xuống kiểm soát (Eccentric)',
        description: 'Hạ chân từ từ trở về vị trí ban đầu trong 2–3 giây mà KHÔNG để thân người đung đưa lấy đà.',
        cue: 'Gồng chắc bụng để triệt tiêu đà quán tính.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Lấy đà đung đưa người như con lắc đồng hồ',
        consequence: 'Dùng lực quán tính vung chân, cơ bụng không hoạt động và dễ tuột tay khỏi xà.',
        fix: 'Dừng hẳn lại 1 giây ở đáy trước khi bắt đầu rep tiếp theo.',
      },
      {
        mistake: 'Chỉ nhấc đùi lên mà không cuộn xương chậu',
        consequence: 'Chỉ ăn vào cơ gập hông (Hip flexor) gây mỏi háng và võng lưng.',
        fix: 'Tưởng tượng bạn đang cố cuộn tròn phần xương chậu chạm vào xương sườn dưới.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Thở hắt ra khi cuộn gối lên ngực → Hít sâu vào khi duỗi chân hạ xuống.',
      tempo: '2 - 1 - 1 - 1 (2s hạ, 1s dừng đáy chống đung đưa, 1s cuộn lên, 1s siết đỉnh).',
      explanation: 'Cuộn xương chậu là động tác duy nhất kích hoạt thực sự các múi bụng dưới.',
    },
    biomechanicalCue: 'Nghĩ về việc đưa đầu gối chạm vào cùi chỏ của bạn.',
    safetyWarning: 'Nếu lực nắm cẳng tay bị đuối trước khi bụng mỏi, hãy dùng đai quấn cổ tay hỗ trợ.',
  },

  // 19. PLANK GỒNG BỤNG TĨNH (RKC PLANK)
  'rkc-plank': {
    id: 'rkc-plank',
    nameVi: 'Plank Gồng Bụng Tĩnh (RKC Plank Chuẩn Sinh Học)',
    nameEn: 'RKC Plank (Russian Kettlebell Challenge Plank)',
    category: 'Cơ Lõi Toàn Diện (Full Core Stability)',
    equipment: 'Thảm sàn tập gym',
    targetMuscles: {
      primary: 'Cơ bụng ngang (Transverse Abdominis), Cơ thẳng bụng, Cơ mông',
      secondary: 'Cơ delta trước, Cơ đùi trước, Lưng trên',
    },
    equipmentSetup: {
      padPosition: 'Trải thảm êm ái dưới hai cùi chỏ.',
    },
    startingPosture: [
      'Nằm sấp, chống hai cùi chỏ vuông góc 90° ngay dưới khớp vai.',
      'Hai bàn tay nắm chặt lại thành nắm đấm, hai cùi chỏ cách nhau bằng vai.',
      'Hai chân duỗi thẳng, mũi chân chống xuống sàn, hai bàn chân khép sát nhau.',
    ],
    executionSteps: [
      {
        phase: '1. Khóa tư thế chuẩn sinh học RKC',
        description: 'Nâng người lên tạo thành một đường thẳng tắp từ đỉnh đầu đến gót chân. SIẾT CHẶT CƠ MÔNG CỰC ĐẠI và xoay xương chậu về sau (khóa thắt lưng phẳng tuyệt đối, không võng lưng).',
        cue: 'Siết mông chặt đến mức không ai có thể đẩy bạn lệch hướng.',
      },
      {
        phase: '2. Tạo lực kéo đẳng trường đối kháng (Isometric Tension)',
        description: 'Chủ động KÉO GHÌ HAI CÙI CHỎ VỀ PHÍA MŨI CHÂN, đồng thời ĐẨY MŨI CHÂN VỀ PHÍA CÙI CHỎ (hai điểm không di chuyển nhưng tạo lực kéo ngầm cực mạnh vào nhau).',
        cue: 'Cả cơ thể sẽ run bần bật sau 15–20 giây vì lực co đẳng trường tối đa.',
      },
      {
        phase: '3. Duy trì',
        description: 'Giữ chặt lực gồng này trong 20–30 giây cho mỗi hiệp.',
        cue: 'Chất lượng 20 giây RKC Plank ăn đứt 2 phút plank thả lỏng thông thường.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Võng lưng dưới bụng sà xuống đất',
        consequence: 'Dồn toàn bộ trọng lượng cơ thể bẻ gập cột sống thắt lưng, gây đau lưng dữ dội.',
        fix: 'Ngay lập tức siết chặt mông và cuộn xương chậu phẳng lại, nếu mỏi hãy hạ gối xuống nghỉ.',
      },
      {
        mistake: 'Chổng mông lên trời thành hình chữ V',
        consequence: 'Chuyển lực sang vai, cơ bụng hoàn toàn không phải gánh chịu tải trọng.',
        fix: 'Hạ mông xuống tạo thành đường thẳng với lưng.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Thở nông và dứt khoát từng nhịp ngắn qua kẽ răng, duy trì áp lực nén bụng 100% suốt thời gian giữ.',
      tempo: 'Giữ căng đẳng trường 20s–40s / hiệp.',
      explanation: 'RKC Plank huấn luyện cơ lõi tạo độ cứng bảo vệ cột sống trong các bài tập tạ nặng như Squat và Deadlift.',
    },
    biomechanicalCue: 'Kéo cùi chỏ về phía ngón chân và kéo ngón chân về phía cùi chỏ.',
    safetyWarning: 'Không bao giờ nín thở hoàn toàn đến mức đỏ mặt choáng váng tăng huyết áp.',
  },

  // 20. HÍT ĐẤT CHUẨN (STANDARD PUSH-UP)
  'pushup': {
    id: 'pushup',
    nameVi: 'Hít Đất Chuẩn Form',
    nameEn: 'Standard Push-up',
    category: 'Ngực, Vai & Tay Sau (Chest & Triceps)',
    equipment: 'Trọng lượng cơ thể (Bodyweight) + Thảm sàn',
    targetMuscles: {
      primary: 'Cơ ngực lớn (Pectoralis Major)',
      secondary: 'Cơ tam đầu tay sau (Triceps), Cơ delta trước, Cơ lõi (Core)',
    },
    equipmentSetup: {
      padPosition: 'Mặt sàn phẳng không trơn trượt.',
    },
    startingPosture: [
      'Chống hai bàn tay xuống sàn, độ rộng hơn vai một chút (khoảng 1.2 lần vai).',
      'Xoay nhẹ bàn tay hướng ra ngoài một góc 10°–15° để giải tỏa áp lực khớp cổ tay.',
      'Hai chân khép hoặc mở bằng hông, siết chặt cơ mông và cơ bụng để cơ thể tạo thành một tấm ván thẳng tắp.',
    ],
    executionSteps: [
      {
        phase: '1. Hạ người xuống (Eccentric)',
        description: 'Hạ người chậm rãi trong 2–3 giây, cùi chỏ mở góc 45° so với thân người (hình mũi tên). Hạ đến khi ngực chạm nhẹ sàn nhà hoặc cách sàn 2cm.',
        cue: 'Cả cơ thể đi xuống như một khối đồng nhất.',
      },
      {
        phase: '2. Đáy',
        description: 'Dừng lại 0.5s ở sát mặt đất, cảm nhận cơ ngực căng tối đa.',
        cue: 'Không để bụng hoặc đùi chạm sàn trước ngực.',
      },
      {
        phase: '3. Đẩy lên (Concentric)',
        description: 'Đạp mạnh lòng bàn tay xuống sàn, đẩy toàn bộ cơ thể thẳng lên trở lại vị trí ban đầu.',
        cue: 'Tưởng tượng bạn đang đẩy trái đất ra xa khỏi bạn.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Cùi chỏ mở sang ngang 90 độ (T-pose)',
        consequence: 'Làm rách sụn vai và viêm gân mỏm cùng vai.',
        fix: 'Luôn giữ cùi chỏ khép góc 45 độ hướng về phía sau.',
      },
      {
        mistake: 'Võng lưng dưới như con rắn hổ mang',
        consequence: 'Gây đau thắt lưng và giảm kích hoạt cơ ngực.',
        fix: 'Siết cứng cơ mông và bụng suốt bài tập.',
      },
    ],
    breathingAndTempo: {
      breathing: 'Hít sâu khi hạ người xuống → Thở ra mạnh mẽ khi đẩy người lên.',
      tempo: '2 - 0 - 1 - 0 (2s hạ kiểm soát, 1s đẩy lên).',
      explanation: 'Hít đất chuẩn form là bài kiểm tra sức mạnh chức năng cơ thể tốt nhất.',
    },
    biomechanicalCue: 'Xoay cổ tay như vặn hai chiếc nắp chai ra ngoài để khóa chặt khớp vai.',
    safetyWarning: 'Nếu cổ tay bị đau, hãy dùng tay cầm hít đất (Push-up bars) hoặc chống bằng nắm đấm.',
  },
};

/**
 * Helper to look up technique details by exercise name (Vietnamese or English)
 */
export function findTechniqueDetail(exerciseName: string): BiomechanicalTechniqueDetail | null {
  if (!exerciseName) return null;
  const name = exerciseName.toLowerCase().trim();

  // Direct matching by key
  for (const [key, detail] of Object.entries(EXERCISE_TECHNIQUE_DETAILS)) {
    if (key === name) return detail;
  }

  // Matching by nameVi or nameEn contains
  for (const detail of Object.values(EXERCISE_TECHNIQUE_DETAILS)) {
    const vi = detail.nameVi.toLowerCase();
    const en = detail.nameEn.toLowerCase();

    if (name.includes('lat pulldown') || (name.includes('kéo cáp') && name.includes('xô'))) {
      return EXERCISE_TECHNIQUE_DETAILS['lat-pulldown'];
    }
    if (name.includes('cable row') || (name.includes('kéo cáp') && name.includes('chèo thuyền'))) {
      return EXERCISE_TECHNIQUE_DETAILS['seated-cable-row'];
    }
    if (name.includes('tricep') && (name.includes('pushdown') || name.includes('duỗi tay sau'))) {
      if (name.includes('overhead') || name.includes('qua đầu')) {
        return EXERCISE_TECHNIQUE_DETAILS['overhead-tricep-extension'];
      }
      return EXERCISE_TECHNIQUE_DETAILS['tricep-pushdown'];
    }
    if (name.includes('overhead') && (name.includes('tricep') || name.includes('tay sau'))) {
      return EXERCISE_TECHNIQUE_DETAILS['overhead-tricep-extension'];
    }
    if (name.includes('face pull') || name.includes('ngang trán')) {
      return EXERCISE_TECHNIQUE_DETAILS['face-pull'];
    }
    if (name.includes('incline') && (name.includes('press') || name.includes('ngực'))) {
      return EXERCISE_TECHNIQUE_DETAILS['incline-db-press'];
    }
    if ((name.includes('flat') || name.includes('ngang')) && (name.includes('press') || name.includes('ngực'))) {
      return EXERCISE_TECHNIQUE_DETAILS['flat-db-press'];
    }
    if (name.includes('goblet') || (name.includes('squat') && name.includes('ôm tạ'))) {
      return EXERCISE_TECHNIQUE_DETAILS['goblet-squat'];
    }
    if (name.includes('bulgarian') || name.includes('gác chân')) {
      return EXERCISE_TECHNIQUE_DETAILS['bulgarian-split-squat'];
    }
    if (name.includes('barbell') && name.includes('squat') || name.includes('gánh tạ')) {
      return EXERCISE_TECHNIQUE_DETAILS['barbell-back-squat'];
    }
    if (name.includes('squat')) {
      return EXERCISE_TECHNIQUE_DETAILS['goblet-squat'];
    }
    if (name.includes('lunge') || name.includes('chùng chân')) {
      return EXERCISE_TECHNIQUE_DETAILS['walking-lunge'];
    }
    if (name.includes('rdl') || name.includes('romanian') || name.includes('deadlift')) {
      return EXERCISE_TECHNIQUE_DETAILS['dumbbell-rdl'];
    }
    if (name.includes('lateral raise') || name.includes('dang tạ')) {
      return EXERCISE_TECHNIQUE_DETAILS['lateral-raise'];
    }
    if (name.includes('hammer') || name.includes('tư thế búa')) {
      return EXERCISE_TECHNIQUE_DETAILS['hammer-curl'];
    }
    if (name.includes('curl') && (name.includes('barbell') || name.includes('đòn ngắn') || name.includes('ez'))) {
      return EXERCISE_TECHNIQUE_DETAILS['barbell-curl'];
    }
    if (name.includes('leg curl') || name.includes('đùi sau')) {
      return EXERCISE_TECHNIQUE_DETAILS['leg-curl'];
    }
    if (name.includes('calf') || name.includes('bắp chuối')) {
      return EXERCISE_TECHNIQUE_DETAILS['standing-calf-raise'];
    }
    if (name.includes('knee raise') || name.includes('treo người')) {
      return EXERCISE_TECHNIQUE_DETAILS['hanging-knee-raise'];
    }
    if (name.includes('plank')) {
      return EXERCISE_TECHNIQUE_DETAILS['rkc-plank'];
    }
    if (name.includes('push') || name.includes('hít đất')) {
      return EXERCISE_TECHNIQUE_DETAILS['pushup'];
    }
    if (name.includes(vi) || vi.includes(name) || name.includes(en) || en.includes(name)) {
      return detail;
    }
  }

  return null;
}
