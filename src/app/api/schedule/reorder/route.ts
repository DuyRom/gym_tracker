import { NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { ScheduleService } from '@/services/schedule.service';

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const body = await req.json();
    const { dayId, orderedExerciseIds } = body;

    if (!dayId || !Array.isArray(orderedExerciseIds)) {
      return NextResponse.json({ error: 'Thiếu dayId hoặc orderedExerciseIds' }, { status: 400 });
    }

    const days = await ScheduleService.reorderExercises(user.id, dayId, orderedExerciseIds);
    return NextResponse.json({ success: true, days });
  } catch (error: any) {
    console.error('API /api/schedule/reorder error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
