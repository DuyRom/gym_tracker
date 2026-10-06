import { Point2D, KEYPOINT_INDEX } from './angle-calculator';

export type FramingStatus =
  | 'no_person'
  | 'too_close'
  | 'too_far'
  | 'out_of_bounds'
  | 'missing_joints'
  | 'optimal';

export interface FramingFeedback {
  status: FramingStatus;
  isOptimal: boolean;
  message: string;
  advice: string;
  heightRatio: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExercisePresetGuide {
  id: string;
  categoryName: string;
  exercises: string[]; // keys like 'squat', 'deadlift', etc.
  distance: string; // e.g. "2.0m - 2.5m"
  angle: string; // e.g. "Chếch 45° hoặc nhìn ngang 90°"
  height: string; // e.g. "Ngang gối / hông (~60 - 80cm)"
  gymTip: string;
  idealFramingText: string;
}

export const EXERCISE_SETUP_PRESETS: ExercisePresetGuide[] = [
  {
    id: 'full_body',
    categoryName: 'Chân & Toàn thân (Squat / Deadlift / Lunge)',
    exercises: ['squat', 'deadlift', 'lunge'],
    distance: '2.0m – 2.5m',
    angle: 'Chếch 45° hoặc ngang sườn 90°',
    height: 'Ngang đầu gối / hông (~60 - 80cm)',
    gymTip: 'Dựng điện thoại tựa vào tạ ấm (Kettlebell) hoặc mép ghế tập (Flat Bench).',
    idealFramingText: 'Thấy rõ từ đỉnh đầu đến mũi chân, không bị tạ che khuất hông.',
  },
  {
    id: 'upper_standing',
    categoryName: 'Thân trên đứng (Bicep Curl / Press / Lateral Raise)',
    exercises: ['bicep_curl', 'shoulder_press', 'lateral_raise'],
    distance: '1.5m – 2.0m',
    angle: 'Trực diện (Front 0°) hoặc chếch nhẹ 30°',
    height: 'Ngang ngực / thắt lưng (~1.0m - 1.2m)',
    gymTip: 'Đặt điện thoại trên giá để tạ đôi (Dumbbell rack) hoặc bệ máy tập bên cạnh.',
    idealFramingText: 'Thấy từ thắt lưng lên trên đỉnh đầu khi tạ đẩy cao nhất.',
  },
  {
    id: 'floor_core',
    categoryName: 'Tập sàn (Hít đất Push-up)',
    exercises: ['pushup'],
    distance: '1.8m – 2.2m',
    angle: 'Ngang sườn 90° (Side view)',
    height: 'Sát mặt sàn (~15 - 30cm), ngửa nhẹ lên',
    gymTip: 'Tựa điện thoại vào mép đĩa tạ 10kg/20kg hoặc bình nước trên sàn.',
    idealFramingText: 'Thấy toàn bộ thân người từ đầu đến gót chân trong tư thế plank.',
  },
  {
    id: 'cable_machine',
    categoryName: 'Máy kéo cáp (Lat Pulldown / Cable Row)',
    exercises: ['lat_pulldown', 'cable_row'],
    distance: '1.8m – 2.2m',
    angle: 'Chếch ngang 60° – 90°',
    height: 'Ngang ngực khi ngồi ghế (~80cm - 1.0m)',
    gymTip: 'Đặt điện thoại ở góc chếch để cọc tạ hoặc dây cáp không che khuất cùi chỏ.',
    idealFramingText: 'Thấy rõ thân trên và chuyển động kéo của cùi chỏ ra sau.',
  },
];

export function getPresetForExercise(exerciseKey: string): ExercisePresetGuide {
  const found = EXERCISE_SETUP_PRESETS.find((p) => p.exercises.includes(exerciseKey));
  return found || EXERCISE_SETUP_PRESETS[0];
}

/**
 * Evaluates whether the user is properly framed in the camera viewport
 * based on MoveNet keypoint coordinates and exercise requirements.
 */
export function evaluateFraming(
  keypoints: Point2D[],
  frameWidth: number,
  frameHeight: number,
  exerciseKey: string = 'squat'
): FramingFeedback {
  if (!keypoints || keypoints.length < 17 || frameWidth <= 0 || frameHeight <= 0) {
    return {
      status: 'no_person',
      isOptimal: false,
      message: 'Chưa nhận diện được người',
      advice: 'Vui lòng đứng vào vùng nhìn thấy của camera',
      heightRatio: 0,
    };
  }

  // Filter keypoints with sufficient confidence
  const validPoints = keypoints.filter((p) => (p.score ?? 0) >= 0.25);
  if (validPoints.length < 5) {
    return {
      status: 'no_person',
      isOptimal: false,
      message: 'Chưa rõ bóng người',
      advice: 'Hãy đứng thẳng vào trước camera để AI quét tư thế',
      heightRatio: 0,
    };
  }

  // Compute bounding box
  const xs = validPoints.map((p) => p.x);
  const ys = validPoints.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const boxWidth = maxX - minX;
  const boxHeight = maxY - minY;
  const heightRatio = boxHeight / frameHeight;

  const boundingBox = {
    x: minX,
    y: minY,
    width: boxWidth,
    height: boxHeight,
  };

  // Check out-of-frame boundaries
  const isCutAtTop = minY < frameHeight * 0.03;
  const isCutAtBottom = maxY > frameHeight * 0.97;
  const isCutAtLeft = minX < frameWidth * 0.02;
  const isCutAtRight = maxX > frameWidth * 0.98;

  // Exercise specific required keypoint checks
  const isFullBodyExercise = ['squat', 'deadlift', 'lunge'].includes(exerciseKey);
  const isFloorExercise = ['pushup'].includes(exerciseKey);

  if (isFullBodyExercise) {
    const leftAnkle = keypoints[KEYPOINT_INDEX.LEFT_ANKLE];
    const rightAnkle = keypoints[KEYPOINT_INDEX.RIGHT_ANKLE];
    const hasAnkles =
      (leftAnkle && (leftAnkle.score ?? 0) >= 0.25) ||
      (rightAnkle && (rightAnkle.score ?? 0) >= 0.25);

    if (!hasAnkles || isCutAtBottom) {
      return {
        status: 'missing_joints',
        isOptimal: false,
        message: 'Chưa thấy bàn chân',
        advice: 'Lùi ra sau hoặc hạ thấp camera để AI thấy trọn chân & gối',
        heightRatio,
        boundingBox,
      };
    }
  }

  // Too Close / Too Far check
  if (heightRatio > 0.92 || isCutAtTop || (heightRatio > 0.85 && isFullBodyExercise)) {
    return {
      status: 'too_close',
      isOptimal: false,
      message: 'Đứng hơi gần camera',
      advice: 'Lùi ra sau khoảng 0.5m – 1m để thấy toàn thân',
      heightRatio,
      boundingBox,
    };
  }

  if (heightRatio < 0.25 && !isFloorExercise) {
    return {
      status: 'too_far',
      isOptimal: false,
      message: 'Đứng hơi xa camera',
      advice: 'Tiến lại gần hơn để AI đo góc khớp chuẩn xác',
      heightRatio,
      boundingBox,
    };
  }

  if (isCutAtLeft || isCutAtRight) {
    return {
      status: 'out_of_bounds',
      isOptimal: false,
      message: 'Gần sát mép khung hình',
      advice: 'Di chuyển vào vị trí chính giữa màn hình',
      heightRatio,
      boundingBox,
    };
  }

  // All checks passed!
  return {
    status: 'optimal',
    isOptimal: true,
    message: 'Khoảng cách hoàn hảo! ✨',
    advice: 'Vị trí đã chuẩn. Bạn có thể bắt đầu tập ngay!',
    heightRatio,
    boundingBox,
  };
}
