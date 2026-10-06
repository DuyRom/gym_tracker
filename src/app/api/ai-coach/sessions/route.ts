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

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 50));
    const exerciseType = searchParams.get('exerciseType');

    const whereClause: any = { userId: user.id };
    if (exerciseType && exerciseType !== 'all') {
      whereClause.exerciseType = exerciseType;
    }

    const [sessions, allUserSessions] = await Promise.all([
      (prisma as any).aiCoachSession.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      (prisma as any).aiCoachSession.findMany({
        where: { userId: user.id },
        select: {
          exerciseType: true,
          totalReps: true,
          goodReps: true,
          avgFormScore: true,
          durationSec: true,
        },
      }),
    ]);

    // Compute aggregated summary stats
    const totalSessions = allUserSessions.length;
    let totalReps = 0;
    let totalGoodReps = 0;
    let totalScoreSum = 0;
    let totalDurationSec = 0;

    const exerciseMap: Record<
      string,
      { count: number; totalReps: number; goodReps: number; scoreSum: number; bestScore: number }
    > = {};

    for (const s of allUserSessions) {
      totalReps += s.totalReps || 0;
      totalGoodReps += s.goodReps || 0;
      totalScoreSum += s.avgFormScore || 0;
      totalDurationSec += s.durationSec || 0;

      const ex = s.exerciseType || 'unknown';
      if (!exerciseMap[ex]) {
        exerciseMap[ex] = { count: 0, totalReps: 0, goodReps: 0, scoreSum: 0, bestScore: 0 };
      }
      exerciseMap[ex].count += 1;
      exerciseMap[ex].totalReps += s.totalReps || 0;
      exerciseMap[ex].goodReps += s.goodReps || 0;
      exerciseMap[ex].scoreSum += s.avgFormScore || 0;
      if (s.avgFormScore > exerciseMap[ex].bestScore) {
        exerciseMap[ex].bestScore = Math.round(s.avgFormScore * 10) / 10;
      }
    }

    const stats = {
      totalSessions,
      totalReps,
      totalGoodReps,
      goodRepsRate: totalReps > 0 ? Math.round((totalGoodReps / totalReps) * 1000) / 10 : 0,
      overallAvgFormScore:
        totalSessions > 0 ? Math.round((totalScoreSum / totalSessions) * 10) / 10 : 0,
      totalDurationSec,
      exerciseBreakdown: Object.entries(exerciseMap).map(([type, data]) => ({
        exerciseType: type,
        sessionCount: data.count,
        totalReps: data.totalReps,
        goodReps: data.goodReps,
        avgScore: data.count > 0 ? Math.round((data.scoreSum / data.count) * 10) / 10 : 0,
        bestScore: data.bestScore,
      })),
    };

    return apiSuccess({ sessions, stats });
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
