import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    [key: string]: unknown;
  };
}

export const NO_CACHE_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export function apiSuccess<T>(data: T, meta?: Record<string, unknown>, status = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    {
      status,
      headers: NO_CACHE_HEADERS,
    }
  );
}

export function apiError(message: string, status = 400, meta?: Record<string, unknown>): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    {
      status,
      headers: NO_CACHE_HEADERS,
    }
  );
}
