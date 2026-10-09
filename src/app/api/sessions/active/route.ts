import { NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { SessionService } from '@/services/session.service';
import { NO_CACHE_HEADERS } from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401, headers: NO_CACHE_HEADERS });
    }

    const activeSession = await SessionService.getActiveSession(user.id);
    return NextResponse.json({ success: true, session: activeSession }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
