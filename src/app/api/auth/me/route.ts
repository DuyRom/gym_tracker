import { NextResponse } from 'next/server';
import { getAuthenticatedUserOrDemo } from '@/lib/auth';

export async function GET() {
  const user = await getAuthenticatedUserOrDemo();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'MEMBER',
      avatarUrl: user.avatarUrl,
    },
  });
}
