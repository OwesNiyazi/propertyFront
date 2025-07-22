import React, { useEffect, useState } from 'react';
import { apiService, User } from '@/services/api';
import { Loader2 } from 'lucide-react';

const initialForm = { username: '', email: '', password: '', isAdmin: false };

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState<any>(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAllUsers();
      setUsers(data);
    } catch (e) {
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiService.adminCreateUser(form);
      setShowAdd(false);
      setForm(initialForm);
      fetchUsers();
    } catch (e: any) {
      setError(e.message || 'Failed to add user');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiService.adminUpdateUser(editId!, form);
      setShowEdit(false);
      setForm(initialForm);
      setEditId(null);
      fetchUsers();
    } catch (e: any) {
      setError(e.message || 'Failed to update user');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await apiService.deleteUser(id);
      fetchUsers();
    } catch (e) {
      setError('Failed to delete user');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <button className="mb-4 px-4 py-2 bg-primary text-white rounded" onClick={() => { setShowAdd(true); setForm(initialForm); }}>Add User</button>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        </div>
      ) : (
        <table className="min-w-full bg-card/50 border rounded-lg">
          <thead>
            <tr>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Admin</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                <td className="p-2">
                  <button className="px-2 py-1 bg-blue-500 text-white rounded mr-2" onClick={() => { setShowEdit(true); setEditId(user._id); setForm({ username: user.username, email: user.email, password: '', isAdmin: user.isAdmin }); }}>Edit</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-white p-8 rounded shadow-lg min-w-[320px] space-y-4" onSubmit={handleAdd}>
            <h2 className="text-xl font-bold mb-2">Add User</h2>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <input className="w-full border p-2 rounded" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isAdmin} onChange={e => setForm({ ...form, isAdmin: e.target.checked })} />
              Admin
            </label>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="flex-1 bg-primary text-white px-4 py-2 rounded">Add</button>
              <button type="button" className="flex-1 bg-gray-300 px-4 py-2 rounded" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Edit User Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-white p-8 rounded shadow-lg min-w-[320px] space-y-4" onSubmit={handleEdit}>
            <h2 className="text-xl font-bold mb-2">Edit User</h2>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <input className="w-full border p-2 rounded" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input className="w-full border p-2 rounded" placeholder="Password (leave blank to keep)" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isAdmin} onChange={e => setForm({ ...form, isAdmin: e.target.checked })} />
              Admin
            </label>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="flex-1 bg-primary text-white px-4 py-2 rounded">Save</button>
              <button type="button" className="flex-1 bg-gray-300 px-4 py-2 rounded" onClick={() => { setShowEdit(false); setEditId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 