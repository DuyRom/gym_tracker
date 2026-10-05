import { NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { ScheduleService } from '@/services/schedule.service';

export async function GET() {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const logs = await ScheduleService.getActivityLogs(user.id, 50);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('API /api/schedule/logs error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
