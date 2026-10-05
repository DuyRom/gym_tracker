import { NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { ScheduleService } from '@/services/schedule.service';

export async function GET() {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const [days, logs] = await Promise.all([
      ScheduleService.getUserSchedule(user.id),
      ScheduleService.getActivityLogs(user.id, 20),
    ]);

    return NextResponse.json({ success: true, days, logs });
  } catch (error: any) {
    console.error('API /api/schedule error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
