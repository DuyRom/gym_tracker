import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Tính năng tự động đăng ký đã bị vô hiệu hóa. Tài khoản thành viên chỉ được khởi tạo bởi Quản Trị Viên (Admin).',
    },
    { status: 403 }
  );
}
