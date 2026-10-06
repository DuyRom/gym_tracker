import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUserOrDemo(req);
    if (!user) {
      return apiError('Chưa xác thực người dùng', 401);
    }

    const sessions = await (prisma as any).aiCoachSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return apiSuccess({ sessions });
  } catch (error: any) {
    console.error('Fetch AI Coach sessions error:', error);
    return apiError(error.message || 'Lỗi lấy dữ liệu AI Coach', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUserOrDemo(req);
    if (!user) {
      return apiError('Chưa xác thực người dùng', 401);
    }

    const body = await req.json();
    const {
      exerciseType,
      exerciseName,
      totalReps,
      goodReps,
      avgFormScore,
      durationSec,
      feedbackSummary,
    } = body;

    if (!exerciseType || totalReps === undefined) {
      return apiError('Thiếu thông tin bài tập hoặc số reps', 400);
    }

    const session = await (prisma as any).aiCoachSession.create({
      data: {
        userId: user.id,
        exerciseType: String(exerciseType),
        exerciseName: String(exerciseName || exerciseType),
        totalReps: Number(totalReps) || 0,
        goodReps: Number(goodReps) || 0,
        avgFormScore: Number(avgFormScore) || 0,
        durationSec: Number(durationSec) || 0,
        feedbackSummary: feedbackSummary ? String(feedbackSummary) : null,
      },
    });

    return apiSuccess({ session }, {}, 201);
  } catch (error: any) {
    console.error('Save AI Coach session error:', error);
    return apiError(error.message || 'Lỗi lưu phiên tập AI Coach', 500);
  }
}
