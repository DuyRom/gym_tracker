export interface FormFeedback {
  score: number;           // 0 - 100
  isGoodRep: boolean;      // score >= 75
  statusText: string;      // Short headline status (vi)
  tips: string[];          // Bullet point coaching cues (vi)
}

export function analyzeSquatForm(data: {
  kneeAngle: number;
  hipAngle: number;
  symmetryDelta: number;
}): FormFeedback {
  let score = 100;
  const tips: string[] = [];

  // Depth check
  if (data.kneeAngle > 115) {
    score -= 25;
    tips.push('Chưa đủ độ sâu (xuống ngang đùi ~90°-100°)');
  } else if (data.kneeAngle <= 95) {
    tips.push('Độ sâu tuyệt vời! Cố gắng duy trì');
  }

  // Torso / Hip angle check
  if (data.hipAngle < 55) {
    score -= 25;
    tips.push('Thân người gập quá nhiều, mở ngực và giữ lưng thẳng');
  }

  // Left/Right symmetry check
  if (data.symmetryDelta > 16) {
    score -= 15;
    tips.push('Hai chân dồn lực chưa đều, chú ý cân bằng gối');
  }

  const isGoodRep = score >= 75;
  let statusText = 'Form rất tốt! 🔥';
  if (score < 60) {
    statusText = 'Cần điều chỉnh tư thế ⚠️';
  } else if (score < 75) {
    statusText = 'Khá tốt, hãy chú ý độ sâu 👍';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isGoodRep,
    statusText,
    tips: tips.slice(0, 2),
  };
}

export function analyzeBicepCurlForm(data: {
  minElbowAngle: number;
  maxElbowAngle: number;
}): FormFeedback {
  let score = 100;
  const tips: string[] = [];

  // Range of Motion - Contraction
  if (data.minElbowAngle > 65) {
    score -= 25;
    tips.push('Gập tay cao hơn để siết trọn đỉnh cơ tay trước');
  } else {
    tips.push('Độ co bóp cơ tay trước rất tốt!');
  }

  // Range of Motion - Extension
  if (data.maxElbowAngle < 145) {
    score -= 20;
    tips.push('Hạ tạ duỗi thẳng tay hơn để giãn biên độ tối đa');
  }

  const isGoodRep = score >= 75;
  let statusText = 'Cuốn tay rất chuẩn! 💪';
  if (score < 60) {
    statusText = 'Biên độ chưa đủ đầy ⚠️';
  } else if (score < 75) {
    statusText = 'Tốt, siết thêm ở đỉnh 👍';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isGoodRep,
    statusText,
    tips: tips.slice(0, 2),
  };
}

export function analyzeShoulderPressForm(data: {
  minElbowAngle: number;
  maxElbowAngle: number;
  symmetryDelta: number;
}): FormFeedback {
  let score = 100;
  const tips: string[] = [];

  // Overhead lockout
  if (data.maxElbowAngle < 155) {
    score -= 20;
    tips.push('Đẩy thẳng tay qua đầu để hoàn thành hiệp');
  }

  // Bottom depth
  if (data.minElbowAngle > 95) {
    score -= 20;
    tips.push('Hạ tạ xuống ngang tai/cằm trước khi đẩy lên');
  }

  // Symmetry
  if (data.symmetryDelta > 18) {
    score -= 15;
    tips.push('Hai tay đẩy chưa đều nhịp, giữ tốc độ đồng bộ');
  }

  const isGoodRep = score >= 75;
  let statusText = 'Đẩy vai dứt khoát! 🚀';
  if (score < 60) {
    statusText = 'Biên độ chưa chuẩn ⚠️';
  } else if (score < 75) {
    statusText = 'Tốt, chú ý duỗi thẳng tay 👍';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isGoodRep,
    statusText,
    tips: tips.slice(0, 2),
  };
}

export function analyzePushupForm(data: {
  minElbowAngle: number;
  bodyLineAngle: number;
}): FormFeedback {
  let score = 100;
  const tips: string[] = [];

  // Depth
  if (data.minElbowAngle > 95) {
    score -= 30;
    tips.push('Hạ ngực sát mặt đất hơn (~90° khuỷu tay)');
  }

  // Core alignment (shoulder - hip - ankle line ~170-180°)
  if (data.bodyLineAngle < 155) {
    score -= 25;
    tips.push('Siết cơ bụng, tránh võng lưng hoặc nhô mông cao');
  }

  const isGoodRep = score >= 75;
  let statusText = 'Hít đất cực chuẩn! ⚡';
  if (score < 60) {
    statusText = 'Lưng võng hoặc chưa đủ sâu ⚠️';
  } else if (score < 75) {
    statusText = 'Khá tốt, hãy hạ thấp thêm 👍';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isGoodRep,
    statusText,
    tips: tips.slice(0, 2),
  };
}

export function analyzeDeadliftForm(data: {
  hipAngle: number;
  kneeAngle: number;
}): FormFeedback {
  let score = 100;
  const tips: string[] = [];

  // Hip hinge depth
  if (data.hipAngle > 125) {
    score -= 20;
    tips.push('Chưa gập hông đủ sâu (đẩy mông ra sau nhiều hơn)');
  }

  // Squatting instead of hinging (knee bent too much)
  if (data.kneeAngle < 100) {
    score -= 25;
    tips.push('Đầu gối gập quá nhiều giống Squat — giữ cẳng chân gần thẳng đứng');
  }

  // Back rounding risk
  if (data.hipAngle < 65) {
    score -= 25;
    tips.push('Thân người gập quá thấp, mở ngực và giữ thẳng cột sống');
  }

  const isGoodRep = score >= 75;
  let statusText = 'Kéo tạ rất chuẩn! 🏋️‍♂️';
  if (score < 60) {
    statusText = 'Chú ý tư thế hông & lưng ⚠️';
  } else if (score < 75) {
    statusText = 'Khá tốt, hãy đẩy hông rõ hơn 👍';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isGoodRep,
    statusText,
    tips: tips.slice(0, 2),
  };
}

export function analyzeLungeForm(data: {
  frontKneeAngle: number;
  backKneeAngle: number;
  torsoAngle: number;
}): FormFeedback {
  let score = 100;
  const tips: string[] = [];

  // Front knee depth (~90-100 deg)
  if (data.frontKneeAngle > 120) {
    score -= 25;
    tips.push('Chưa đủ độ sâu — hạ gối trước vuông góc ~90°');
  }

  // Torso upright check
  if (data.torsoAngle < 65) {
    score -= 20;
    tips.push('Thân người nghiêng quá nhiều — siết bụng và giữ ngực thẳng');
  }

  const isGoodRep = score >= 75;
  let statusText = 'Bước chùng chân chuẩn! 🦵';
  if (score < 60) {
    statusText = 'Cần hạ sâu và giữ thăng bằng ⚠️';
  } else if (score < 75) {
    statusText = 'Tốt, chú ý độ vuông góc gối 👍';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isGoodRep,
    statusText,
    tips: tips.slice(0, 2),
  };
}

export function analyzeLatPulldownForm(data: {
  minElbowAngle: number;
  maxElbowAngle: number;
  symmetryDelta: number;
}): FormFeedback {
  let score = 100;
  const tips: string[] = [];

  // Bottom pull depth (pull down to upper chest)
  if (data.minElbowAngle > 92) {
    score -= 25;
    tips.push('Chưa kéo đủ sâu — kéo thanh đòn xuống sát ngang cằm/xương quai xanh');
  } else if (data.minElbowAngle <= 78) {
    tips.push('Độ co cơ lưng xô tuyệt vời!');
  }

  // Top stretch extension
  if (data.maxElbowAngle < 148) {
    score -= 20;
    tips.push('Nhả tạ duỗi thẳng tay hơn để giãn hoàn toàn cơ lưng xô');
  }

  // Symmetry
  if (data.symmetryDelta > 18) {
    score -= 15;
    tips.push('Hai tay kéo lực chưa đều, giữ cân bằng thanh đòn');
  }

  const isGoodRep = score >= 75;
  let statusText = 'Kéo xô rất chuẩn! 🦅';
  if (score < 60) {
    statusText = 'Biên độ chưa trọn vẹn ⚠️';
  } else if (score < 75) {
    statusText = 'Tốt, chú ý kéo sâu về ngực 👍';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isGoodRep,
    statusText,
    tips: tips.slice(0, 2),
  };
}

export function analyzeCableRowForm(data: {
  minElbowAngle: number;
  maxElbowAngle: number;
  torsoAngle: number;
}): FormFeedback {
  let score = 100;
  const tips: string[] = [];

  // Pull back contraction
  if (data.minElbowAngle > 90) {
    score -= 25;
    tips.push('Kéo cùi chỏ ra sau nhiều hơn, siết chặt hai bả vai');
  } else {
    tips.push('Độ siết lưng giữa rất tốt!');
  }

  // Forward stretch
  if (data.maxElbowAngle < 142) {
    score -= 20;
    tips.push('Thả tay về phía trước nhiều hơn để giãn cơ lưng');
  }

  // Torso swinging / excessive lean
  if (data.torsoAngle < 65 || data.torsoAngle > 118) {
    score -= 20;
    tips.push('Hạn chế ngả đu người lấy đà — cố định thân trên vuông góc sàn');
  }

  const isGoodRep = score >= 75;
  let statusText = 'Chèo cáp chắc chắn! 🚣‍♂️';
  if (score < 60) {
    statusText = 'Tránh đu người giật tạ ⚠️';
  } else if (score < 75) {
    statusText = 'Khá tốt, hãy kéo sâu cùi chỏ 👍';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isGoodRep,
    statusText,
    tips: tips.slice(0, 2),
  };
}

export function analyzeLateralRaiseForm(data: {
  abductionAvg: number;
  symmetryDelta: number;
}): FormFeedback {
  let score = 100;
  const tips: string[] = [];

  // Height / elevation (~80°-95°)
  if (data.abductionAvg < 75) {
    score -= 25;
    tips.push('Chưa nâng đủ cao — nâng khuỷu tay ngang vai (~85°-90°)');
  } else if (data.abductionAvg > 105) {
    score -= 20;
    tips.push('Không nâng quá cao qua vai để tránh ăn vào cơ cầu vai');
  } else {
    tips.push('Độ cao ngang vai chuẩn xác!');
  }

  // Symmetry
  if (data.symmetryDelta > 16) {
    score -= 15;
    tips.push('Hai tay dang chưa đều, đồng bộ nhịp độ hai bên');
  }

  const isGoodRep = score >= 75;
  let statusText = 'Dang vai rất đẹp! 🕊️';
  if (score < 60) {
    statusText = 'Biên độ chưa chuẩn ⚠️';
  } else if (score < 75) {
    statusText = 'Tốt, chú ý nâng ngang vai 👍';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isGoodRep,
    statusText,
    tips: tips.slice(0, 2),
  };
}
