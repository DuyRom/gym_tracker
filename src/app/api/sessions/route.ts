import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { SessionService } from '@/services/session.service';
import { NO_CACHE_HEADERS } from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401, headers: NO_CACHE_HEADERS });
    }

    const sessions = await SessionService.getHistory(user.id);
    return NextResponse.json({ success: true, sessions }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { workoutDayId, date } = await req.json();
    if (!workoutDayId) {
      return NextResponse.json({ error: 'workoutDayId là bắt buộc' }, { status: 400 });
    }

    const session = await SessionService.startSession(user.id, workoutDayId, date);
    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
