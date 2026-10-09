import { NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { ScheduleService } from '@/services/schedule.service';
import prisma from '@/lib/prisma';
import { NO_CACHE_HEADERS } from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const user = await getAuthenticatedUserOrDemo();

    if (user) {
      const days = await ScheduleService.getUserSchedule(user.id);
      return NextResponse.json({ success: true, days }, { headers: NO_CACHE_HEADERS });
    }

    // Fallback: return default template days
    const templateDays = await prisma.workoutDay.findMany({
      where: { userId: null },
      orderBy: { dayOfWeek: 'asc' },
      include: {
        exercises: {
          where: { isArchived: false },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    return NextResponse.json({ success: true, days: templateDays });
  } catch (error: any) {
    console.error('Failed to get exercises/schedule:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
