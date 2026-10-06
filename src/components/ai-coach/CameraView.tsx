'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface CameraViewProps {
  onFrame: (video: HTMLVideoElement, canvas: HTMLCanvasElement) => void;
  isActive: boolean;
  facingMode?: 'user' | 'environment';
  onFacingModeChange?: (mode: 'user' | 'environment') => void;
}

export default function CameraView({
  onFrame,
  isActive,
  facingMode = 'user',
  onFacingModeChange,
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const animFrameIdRef = useRef<number | null>(null);

  const startStream = useCallback(async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      setPermissionState('denied');
      setErrorMessage('Thiết bị hoặc trình duyệt không hỗ trợ Camera API.');
      return;
    }

    try {
      setErrorMessage(null);
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30, max: 30 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setPermissionState('granted');
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setPermissionState('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Quyền truy cập Camera bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.');
      } else if (err.name === 'NotFoundError') {
        setErrorMessage('Không tìm thấy Camera khả dụng trên thiết bị.');
      } else {
        setErrorMessage(`Lỗi camera: ${err.message || 'Không thể mở luồng video'}`);
      }
    }
  }, [facingMode]);

  const stopStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      startStream();
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isActive, startStream, stopStream]);

  // Frame processing loop
  useEffect(() => {
    if (!isActive || !isStreaming) return;

    let isSubscribed = true;
    const processLoop = () => {
      if (!isSubscribed) return;
      if (
        videoRef.current &&
        canvasRef.current &&
        videoRef.current.readyState >= 2
      ) {
        onFrame(videoRef.current, canvasRef.current);
      }
      animFrameIdRef.current = requestAnimationFrame(processLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(processLoop);

    return () => {
      isSubscribed = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isActive, isStreaming, onFrame]);

  const toggleCamera = () => {
    stopStream();
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    if (onFacingModeChange) {
      onFacingModeChange(nextMode);
    }
  };

  return (
    <div className="ai-camera-container">
      {/* Hidden/Active Video Feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`ai-camera-video ${facingMode === 'user' ? 'flipped' : ''}`}
        onLoadedMetadata={() => {
          if (videoRef.current && canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth || 640;
            canvasRef.current.height = videoRef.current.videoHeight || 480;
          }
        }}
      />

      {/* Canvas Overlay for Skeleton and Indicators */}
      <canvas
        ref={canvasRef}
        className="ai-camera-canvas"
      />

      {/* Switch Camera Button */}
      {isStreaming && (
        <button
          onClick={toggleCamera}
          className="ai-camera-switch-btn"
          type="button"
          title="Đổi camera trước / sau"
        >
          <RefreshCw size={14} />
          <span>{facingMode === 'user' ? 'Cam Trước' : 'Cam Sau'}</span>
        </button>
      )}

      {/* Permission Denied / Error State */}
      {permissionState === 'denied' && (
        <div className="ai-camera-overlay">
          <AlertCircle size={48} color="#F43F5E" style={{ marginBottom: 8 }} />
          <h3>Chưa có quyền Camera</h3>
          <p>
            {errorMessage || 'Ứng dụng cần quyền Camera để AI phân tích tư thế và đếm reps theo thời gian thực.'}
          </p>
          <button
            onClick={startStream}
            className="ai-btn-primary"
            style={{ maxWidth: 220 }}
            type="button"
          >
            <Camera size={18} />
            <span>Thử lại & Cấp quyền</span>
          </button>
        </div>
      )}

      {/* Prompt / Loading State */}
      {isActive && !isStreaming && permissionState !== 'denied' && (
        <div className="ai-camera-overlay">
          <div className="ai-spinner" style={{ width: 36, height: 36, borderWidth: 3, marginBottom: 14 }} />
          <p style={{ color: 'var(--text-main)', fontWeight: 600 }}>Đang khởi động Camera AI...</p>
        </div>
      )}
    </div>
  );
}
