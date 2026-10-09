import { NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { ScheduleService } from '@/services/schedule.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/schedule/exercises — Add exercise to day
 */
export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const body = await req.json();
    const { dayId, nameVi, nameEn, equipment, sets, repsMin, repsMax, rir, techniqueNote, videoUrl } = body;

    if (!dayId || !nameVi) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc (dayId, nameVi)' }, { status: 400 });
    }

    const days = await ScheduleService.addExercise(user.id, dayId, {
      nameVi,
      nameEn,
      equipment,
      sets,
      repsMin,
      repsMax,
      rir,
      techniqueNote,
      videoUrl,
    });

    return NextResponse.json({ success: true, days });
  } catch (error: any) {
    console.error('API POST /api/schedule/exercises error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

/**
 * PUT /api/schedule/exercises — Edit an exercise
 */
export async function PUT(req: Request) {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const body = await req.json();
    const { exerciseId, ...updateData } = body;

    if (!exerciseId) {
      return NextResponse.json({ error: 'Thiếu exerciseId' }, { status: 400 });
    }

    const days = await ScheduleService.updateExercise(user.id, exerciseId, updateData);
    return NextResponse.json({ success: true, days });
  } catch (error: any) {
    console.error('API PUT /api/schedule/exercises error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

/**
 * DELETE /api/schedule/exercises — Delete an exercise
 */
export async function DELETE(req: Request) {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json({ error: 'Thiếu exerciseId' }, { status: 400 });
    }

    const days = await ScheduleService.deleteExercise(user.id, exerciseId);
    return NextResponse.json({ success: true, days });
  } catch (error: any) {
    console.error('API DELETE /api/schedule/exercises error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
