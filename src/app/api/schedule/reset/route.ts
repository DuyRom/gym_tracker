import { NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { ScheduleService } from '@/services/schedule.service';

export async function POST() {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const days = await ScheduleService.resetScheduleToDefault(user.id);
    return NextResponse.json({ success: true, days });
  } catch (error: any) {
    console.error('API /api/schedule/reset error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
