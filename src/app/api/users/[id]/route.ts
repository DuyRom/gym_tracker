import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUserOrDemo, hashPassword, DEFAULT_ADMIN_EMAIL } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAuthenticatedUserOrDemo();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Chỉ Admin mới có quyền xóa người dùng' }, { status: 403 });
    }

    const { id } = await params;

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
    }

    if (targetUser.email === DEFAULT_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Không thể xóa tài khoản Quản Trị Viên mặc định của hệ thống' },
        { status: 400 }
      );
    }

    if (targetUser.id === currentUser.id) {
      return NextResponse.json(
        { error: 'Không thể tự xóa tài khoản đang đăng nhập' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Đã xóa người dùng thành công' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAuthenticatedUserOrDemo();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Chỉ Admin mới có quyền cập nhật người dùng' }, { status: 403 });
    }

    const { id } = await params;
    const { name, role, newPassword } = await req.json();

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (role && ['ADMIN', 'MEMBER'].includes(role)) {
      if (targetUser.email === DEFAULT_ADMIN_EMAIL && role !== 'ADMIN') {
        return NextResponse.json({ error: 'Không thể hạ quyền Admin mặc định' }, { status: 400 });
      }
      updateData.role = role;
    }
    if (newPassword && newPassword.length >= 6) {
      updateData.password = await hashPassword(newPassword);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
