export interface Point2D {
  x: number;
  y: number;
  score?: number;
}

/**
 * Calculates the angle (in degrees) formed by three points: A - B - C,
 * with B as the vertex.
 *
 *       A
 *      /
 *     B ---- C
 *
 * Returns angle in degrees [0, 180].
 */
export function calculateAngle(a: Point2D, b: Point2D, c: Point2D): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle * 10) / 10;
}

/**
 * MoveNet standard 17 keypoint indices:
 * 0: nose, 1: left_eye, 2: right_eye, 3: left_ear, 4: right_ear
 * 5: left_shoulder, 6: right_shoulder, 7: left_elbow, 8: right_elbow
 * 9: left_wrist, 10: right_wrist, 11: left_hip, 12: right_hip
 * 13: left_knee, 14: right_knee, 15: left_ankle, 16: right_ankle
 */
export const KEYPOINT_INDEX = {
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,
  LEFT_ELBOW: 7,
  RIGHT_ELBOW: 8,
  LEFT_WRIST: 9,
  RIGHT_WRIST: 10,
  LEFT_HIP: 11,
  RIGHT_HIP: 12,
  LEFT_KNEE: 13,
  RIGHT_KNEE: 14,
  LEFT_ANKLE: 15,
  RIGHT_ANKLE: 16,
};

export function getSquatAngles(keypoints: Point2D[]) {
  const leftHip = keypoints[KEYPOINT_INDEX.LEFT_HIP];
  const leftKnee = keypoints[KEYPOINT_INDEX.LEFT_KNEE];
  const leftAnkle = keypoints[KEYPOINT_INDEX.LEFT_ANKLE];
  const leftShoulder = keypoints[KEYPOINT_INDEX.LEFT_SHOULDER];

  const rightHip = keypoints[KEYPOINT_INDEX.RIGHT_HIP];
  const rightKnee = keypoints[KEYPOINT_INDEX.RIGHT_KNEE];
  const rightAnkle = keypoints[KEYPOINT_INDEX.RIGHT_ANKLE];
  const rightShoulder = keypoints[KEYPOINT_INDEX.RIGHT_SHOULDER];

  const kneeAngleL = calculateAngle(leftHip, leftKnee, leftAnkle);
  const kneeAngleR = calculateAngle(rightHip, rightKnee, rightAnkle);
  const hipAngleL = calculateAngle(leftShoulder, leftHip, leftKnee);
  const hipAngleR = calculateAngle(rightShoulder, rightHip, rightKnee);

  // Pick the side with higher average keypoint confidence
  const leftScore = ((leftHip.score || 0) + (leftKnee.score || 0) + (leftAnkle.score || 0)) / 3;
  const rightScore = ((rightHip.score || 0) + (rightKnee.score || 0) + (rightAnkle.score || 0)) / 3;
  const preferredSide = rightScore > leftScore ? 'right' : 'left';

  return {
    primaryKneeAngle: preferredSide === 'right' ? kneeAngleR : kneeAngleL,
    primaryHipAngle: preferredSide === 'right' ? hipAngleR : hipAngleL,
    kneeAngleL,
    kneeAngleR,
    hipAngleL,
    hipAngleR,
    symmetryDelta: Math.abs(kneeAngleL - kneeAngleR),
    preferredSide,
  };
}

export function getBicepCurlAngles(keypoints: Point2D[]) {
  const leftShoulder = keypoints[KEYPOINT_INDEX.LEFT_SHOULDER];
  const leftElbow = keypoints[KEYPOINT_INDEX.LEFT_ELBOW];
  const leftWrist = keypoints[KEYPOINT_INDEX.LEFT_WRIST];

  const rightShoulder = keypoints[KEYPOINT_INDEX.RIGHT_SHOULDER];
  const rightElbow = keypoints[KEYPOINT_INDEX.RIGHT_ELBOW];
  const rightWrist = keypoints[KEYPOINT_INDEX.RIGHT_WRIST];

  const elbowAngleL = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const elbowAngleR = calculateAngle(rightShoulder, rightElbow, rightWrist);

  const leftScore = ((leftShoulder.score || 0) + (leftElbow.score || 0) + (leftWrist.score || 0)) / 3;
  const rightScore = ((rightShoulder.score || 0) + (rightElbow.score || 0) + (rightWrist.score || 0)) / 3;
  const preferredSide = rightScore > leftScore ? 'right' : 'left';

  return {
    primaryElbowAngle: preferredSide === 'right' ? elbowAngleR : elbowAngleL,
    elbowAngleL,
    elbowAngleR,
    preferredSide,
  };
}

export function getShoulderPressAngles(keypoints: Point2D[]) {
  const leftShoulder = keypoints[KEYPOINT_INDEX.LEFT_SHOULDER];
  const leftElbow = keypoints[KEYPOINT_INDEX.LEFT_ELBOW];
  const leftWrist = keypoints[KEYPOINT_INDEX.LEFT_WRIST];

  const rightShoulder = keypoints[KEYPOINT_INDEX.RIGHT_SHOULDER];
  const rightElbow = keypoints[KEYPOINT_INDEX.RIGHT_ELBOW];
  const rightWrist = keypoints[KEYPOINT_INDEX.RIGHT_WRIST];

  const elbowAngleL = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const elbowAngleR = calculateAngle(rightShoulder, rightElbow, rightWrist);

  return {
    primaryElbowAngle: (elbowAngleL + elbowAngleR) / 2,
    elbowAngleL,
    elbowAngleR,
    symmetryDelta: Math.abs(elbowAngleL - elbowAngleR),
  };
}

export function getPushupAngles(keypoints: Point2D[]) {
  const leftShoulder = keypoints[KEYPOINT_INDEX.LEFT_SHOULDER];
  const leftElbow = keypoints[KEYPOINT_INDEX.LEFT_ELBOW];
  const leftWrist = keypoints[KEYPOINT_INDEX.LEFT_WRIST];
  const leftHip = keypoints[KEYPOINT_INDEX.LEFT_HIP];
  const leftAnkle = keypoints[KEYPOINT_INDEX.LEFT_ANKLE];

  const rightShoulder = keypoints[KEYPOINT_INDEX.RIGHT_SHOULDER];
  const rightElbow = keypoints[KEYPOINT_INDEX.RIGHT_ELBOW];
  const rightWrist = keypoints[KEYPOINT_INDEX.RIGHT_WRIST];

  const elbowAngleL = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const elbowAngleR = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const bodyLineAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);

  const leftScore = ((leftShoulder.score || 0) + (leftElbow.score || 0) + (leftWrist.score || 0)) / 3;
  const rightScore = ((rightShoulder.score || 0) + (rightElbow.score || 0) + (rightWrist.score || 0)) / 3;
  const preferredSide = rightScore > leftScore ? 'right' : 'left';

  return {
    primaryElbowAngle: preferredSide === 'right' ? elbowAngleR : elbowAngleL,
    elbowAngleL,
    elbowAngleR,
    bodyLineAngle,
    preferredSide,
  };
}
