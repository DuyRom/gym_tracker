import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';
import { SessionService } from '@/services/session.service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUserOrDemo();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { id } = await params;
    const { exerciseId, completed, actualSets, actualReps, actualWeightKg, notes } = await req.json();

    if (!exerciseId) {
      return NextResponse.json({ error: 'exerciseId là bắt buộc' }, { status: 400 });
    }

    const updated = await SessionService.logExercise(id, exerciseId, {
      completed,
      actualSets: actualSets !== undefined ? Number(actualSets) : undefined,
      actualReps: actualReps !== undefined ? String(actualReps) : undefined,
      actualWeightKg: actualWeightKg !== undefined && actualWeightKg !== null ? Number(actualWeightKg) : undefined,
      notes,
    });

    return NextResponse.json({ success: true, exercise: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
