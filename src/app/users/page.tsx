'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Trash2, Key, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { formatDateVi } from '@/lib/utils';

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MEMBER';
  createdAt: string;
  totalSessions: number;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // New user form state
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER');

  // Reset password form state
  const [resetPassword, setResetPassword] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/users');
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Không thể tải danh sách người dùng');
      } else {
        setUsers(data.users || []);
      }
    } catch {
      setError('Lỗi kết nối khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Lỗi tạo người dùng');
      } else {
        setSuccessMsg(`Tạo tài khoản thành công cho ${data.user.email}!`);
        setIsAddModalOpen(false);
        setNewEmail('');
        setNewName('');
        setNewPassword('');
        setNewRole('MEMBER');
        loadUsers();
      }
    } catch {
      setError('Lỗi kết nối khi tạo người dùng');
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa người dùng: ${user.email} không?`);
    if (!confirmDelete) return;

    try {
      setError('');
      setSuccessMsg('');
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Lỗi khi xóa người dùng');
      } else {
        setSuccessMsg(`Đã xóa người dùng ${user.email} thành công!`);
        loadUsers();
      }
    } catch {
      setError('Lỗi kết nối khi xóa người dùng');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Lỗi khi đặt lại mật khẩu');
      } else {
        setSuccessMsg(`Đã đổi mật khẩu mới cho ${selectedUser.email}!`);
        setIsResetModalOpen(false);
        setResetPassword('');
        setSelectedUser(null);
      }
    } catch {
      setError('Lỗi kết nối khi cập nhật mật khẩu');
    }
  };

  return (
    <main className="container">
      {/* Header Banner */}
      <section className="hero-card">
        <div className="hero-top">
          <div className="title-area">
            <div className="badge-group" style={{ marginBottom: 8 }}>
              <span className="badge badge-purple">
                <Shield size={12} />
                QUẢN TRỊ VIÊN
              </span>
              <span className="badge badge-cyan">QUẢN LÝ THÀNH VIÊN</span>
            </div>
            <h1>Quản Lý Người Dùng & Phân Quyền</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 680 }}>
              Hệ thống áp dụng chính sách cấp tài khoản nội bộ (không mở đăng ký công khai). Chỉ Quản Trị Viên mới có quyền khởi tạo thành viên và cấp quyền.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '12px 20px' }}
          >
            <UserPlus size={16} />
            <span>Thêm Thành Viên Mới</span>
          </button>
        </div>
      </section>

      {/* Messages */}
      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 12, color: '#FDA4AF', fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, color: '#6EE7B7', fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Users Table */}
      <section className="day-card">
        <div className="day-header">
          <div className="day-title">
            <span className="day-tag">DANH SÁCH THÀNH VIÊN</span>
            <div className="day-name">Tất Cả Tài Khoản ({users.length})</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Đang tải danh sách người dùng...
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Thành Viên</th>
                  <th>Email</th>
                  <th>Vai Trò</th>
                  <th style={{ textAlign: 'center' }}>Số Buổi Đã Tập</th>
                  <th>Ngày Tạo</th>
                  <th style={{ textAlign: 'center' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isAdmin = u.role === 'ADMIN';
                  const isDefaultAdmin = u.email === 'duyrnt09@gmail.com';

                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: isAdmin
                                ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                                : 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span style={{ fontWeight: 600, color: '#fff' }}>{u.name || 'Chưa đặt tên'}</span>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono', color: '#E2E8F0', fontSize: 13 }}>
                          {u.email}
                        </span>
                      </td>

                      <td>
                        {isAdmin ? (
                          <span className="badge badge-purple" style={{ gap: 4 }}>
                            <Shield size={12} />
                            ADMIN
                          </span>
                        ) : (
                          <span className="badge badge-cyan">MEMBER</span>
                        )}
                      </td>

                      <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#10B981' }}>
                        {u.totalSessions} buổi
                      </td>

                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        {formatDateVi(u.createdAt)}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setIsResetModalOpen(true);
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: 12 }}
                            title="Đặt lại mật khẩu"
                          >
                            <Key size={13} />
                            <span>Đổi Mật Khẩu</span>
                          </button>

                          {!isDefaultAdmin && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="btn btn-danger"
                              style={{ padding: '6px 10px', fontSize: 12 }}
                              title="Xóa người dùng"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal: Thêm Thành Viên Mới */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Thêm Thành Viên Mới</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Email đăng nhập
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Mật khẩu khởi tạo
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Vai trò (Phân quyền)
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="input-field"
                  style={{ background: '#0F172A' }}
                >
                  <option value="MEMBER">MEMBER (Người tập)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên toàn quyền)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5 }}
                >
                  Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Đổi Mật Khẩu Cho Thành Viên */}
      {isResetModalOpen && selectedUser && (
        <div className="modal-overlay" onClick={() => setIsResetModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Đổi Mật Khẩu Thành Viên</h3>
              <button className="modal-close" onClick={() => setIsResetModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleResetPassword} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 12, background: 'rgba(255, 255, 255, 0.04)', borderRadius: 10, fontSize: 13 }}>
                <div><strong>Tài khoản:</strong> {selectedUser.name}</div>
                <div style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{selectedUser.email}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  required
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Nhập ít nhất 6 ký tự"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsResetModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5 }}
                >
                  Cập Nhật Mật Khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
