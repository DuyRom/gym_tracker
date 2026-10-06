import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import { Point2D } from './angle-calculator';

let detectorInstance: poseDetection.PoseDetector | null = null;
let isInitializing = false;

export async function initPoseDetector(): Promise<poseDetection.PoseDetector> {
  if (detectorInstance) return detectorInstance;
  if (isInitializing) {
    // Wait until existing initialization finishes
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (detectorInstance) return detectorInstance;
  }

  isInitializing = true;
  try {
    // Attempt WebGL acceleration first; fall back to CPU if not supported
    try {
      await tf.setBackend('webgl');
    } catch {
      console.warn('WebGL backend failed, falling back to CPU backend');
      await tf.setBackend('cpu');
    }
    await tf.ready();

    detectorInstance = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
        minPoseScore: 0.25,
      }
    );

    return detectorInstance;
  } finally {
    isInitializing = false;
  }
}

export async function detectPose(
  video: HTMLVideoElement
): Promise<Point2D[] | null> {
  if (!detectorInstance) {
    await initPoseDetector();
  }

  if (!detectorInstance || !video || video.readyState < 2) {
    return null;
  }

  try {
    const poses = await detectorInstance.estimatePoses(video, {
      flipHorizontal: false,
    });

    if (poses && poses.length > 0 && poses[0].keypoints) {
      return poses[0].keypoints.map((kp) => ({
        x: kp.x,
        y: kp.y,
        score: kp.score,
      }));
    }
    return null;
  } catch (err) {
    console.error('Pose estimation error:', err);
    return null;
  }
}

export function disposePoseDetector() {
  if (detectorInstance) {
    try {
      detectorInstance.dispose();
    } catch (e) {
      console.debug('Detector dispose error:', e);
    }
    detectorInstance = null;
  }
}
