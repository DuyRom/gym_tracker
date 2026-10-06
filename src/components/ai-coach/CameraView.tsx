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
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center min-h-[360px] sm:min-h-[460px]">
      {/* Hidden/Active Video Feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`w-full h-full object-cover rounded-2xl ${
          facingMode === 'user' ? 'scale-x-[-1]' : ''
        }`}
        style={{ maxHeight: '70vh' }}
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
        className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-2xl"
        style={{ maxHeight: '70vh' }}
      />

      {/* Switch Camera Button */}
      {isStreaming && (
        <button
          onClick={toggleCamera}
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-sky-400 border border-slate-700/60 backdrop-blur-md shadow-lg transition-all active:scale-95"
          type="button"
          title="Đổi camera trước / sau"
        >
          <RefreshCw size={14} className="animate-spin-slow" />
          <span>{facingMode === 'user' ? 'Cam Trước' : 'Cam Sau'}</span>
        </button>
      )}

      {/* Permission Denied / Error State */}
      {permissionState === 'denied' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 backdrop-blur-lg">
          <AlertCircle size={48} className="text-rose-500 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Chưa có quyền Camera</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-5 leading-relaxed">
            {errorMessage || 'Ứng dụng cần quyền Camera để AI phân tích tư thế và đếm reps theo thời gian thực.'}
          </p>
          <button
            onClick={startStream}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
            type="button"
          >
            <Camera size={18} />
            <span>Thử lại & Cấp quyền</span>
          </button>
        </div>
      )}

      {/* Prompt / Loading State */}
      {isActive && !isStreaming && permissionState !== 'denied' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-slate-300">Đang khởi động Camera AI...</p>
        </div>
      )}
    </div>
  );
}
