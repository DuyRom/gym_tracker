import { Point2D } from './angle-calculator';

// MoveNet standard 17 skeletal bone segments
export const SKELETON_CONNECTIONS: [number, number][] = [
  // Upper body
  [5, 6], // left_shoulder - right_shoulder
  [5, 7], // left_shoulder - left_elbow
  [7, 9], // left_elbow - left_wrist
  [6, 8], // right_shoulder - right_elbow
  [8, 10], // right_elbow - right_wrist
  // Torso
  [5, 11], // left_shoulder - left_hip
  [6, 12], // right_shoulder - right_hip
  [11, 12], // left_hip - right_hip
  // Legs
  [11, 13], // left_hip - left_knee
  [13, 15], // left_knee - left_ankle
  [12, 14], // right_hip - right_knee
  [14, 16], // right_knee - right_ankle
];

export interface RenderOptions {
  formScore?: number;
  highlightAngle?: {
    jointIndex: number;
    angle: number;
    label?: string;
  };
  minConfidence?: number;
  mirror?: boolean;
}

export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  keypoints: Point2D[],
  width: number,
  height: number,
  options: RenderOptions = {}
) {
  const {
    formScore = 85,
    highlightAngle,
    minConfidence = 0.25,
    mirror = false,
  } = options;

  ctx.clearRect(0, 0, width, height);

  if (!keypoints || keypoints.length < 17) return;

  // Determine theme color based on form rating
  let strokeColor = '#38bdf8'; // Sky blue default
  let glowColor = 'rgba(56, 189, 248, 0.4)';

  if (formScore >= 80) {
    strokeColor = '#10b981'; // Emerald Green
    glowColor = 'rgba(16, 185, 129, 0.4)';
  } else if (formScore >= 60) {
    strokeColor = '#f59e0b'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
  } else {
    strokeColor = '#ef4444'; // Red
    glowColor = 'rgba(239, 68, 68, 0.4)';
  }

  ctx.save();
  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  // 1. Draw Bones / Connections
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.strokeStyle = strokeColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 10;

  for (const [i, j] of SKELETON_CONNECTIONS) {
    const kpA = keypoints[i];
    const kpB = keypoints[j];

    if (
      kpA &&
      kpB &&
      (kpA.score === undefined || kpA.score >= minConfidence) &&
      (kpB.score === undefined || kpB.score >= minConfidence)
    ) {
      ctx.beginPath();
      ctx.moveTo(kpA.x, kpA.y);
      ctx.lineTo(kpB.x, kpB.y);
      ctx.stroke();
    }
  }

  // 2. Draw Joints / Keypoints
  for (let i = 0; i < keypoints.length; i++) {
    const kp = keypoints[i];
    if (kp && (kp.score === undefined || kp.score >= minConfidence)) {
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 8;
      ctx.fill();

      // Outer ring
      ctx.lineWidth = 2;
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }
  }

  ctx.restore();

  // 3. Draw Angle Badge if highlighted
  if (highlightAngle) {
    const joint = keypoints[highlightAngle.jointIndex];
    if (joint && (joint.score === undefined || joint.score >= minConfidence)) {
      const renderX = mirror ? width - joint.x : joint.x;
      const renderY = joint.y;

      const text = `${Math.round(highlightAngle.angle)}°`;
      ctx.save();
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(text).width;

      // Badge background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 6;

      const badgeX = renderX + 12;
      const badgeY = renderY - 14;
      const padX = 8;
      const padY = 5;

      ctx.beginPath();
      ctx.roundRect(
        badgeX - padX,
        badgeY - 14 - padY,
        textWidth + padX * 2,
        22 + padY,
        6
      );
      ctx.fill();
      ctx.stroke();

      // Badge text
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(text, badgeX, badgeY);
      ctx.restore();
    }
  }
}
