import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { SessionService } from '@/services/session.service';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const result = await SessionService.resetAllSessions(user.id);
    return NextResponse.json({
      success: true,
      message: 'Đã xóa toàn bộ lịch sử tập luyện và đặt lại chỉ số về 0.',
      count: result.count,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
