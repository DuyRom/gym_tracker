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
    const { exerciseId, targetDayId, targetOrderIndex } = body;

    if (!exerciseId || !targetDayId) {
      return NextResponse.json({ error: 'Thiếu exerciseId hoặc targetDayId' }, { status: 400 });
    }

    const days = await ScheduleService.moveExercise(
      user.id,
      exerciseId,
      targetDayId,
      targetOrderIndex
    );

    return NextResponse.json({ success: true, days });
  } catch (error: any) {
    console.error('API /api/schedule/move error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
