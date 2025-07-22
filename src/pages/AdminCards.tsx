import React, { useEffect, useState } from 'react';
import { apiService, ImageCard, User } from '@/services/api';
import { Loader2 } from 'lucide-react';

const initialForm = {
  title: '',
  description: '',
  price: '',
  type: '',
  propertyType: 'Sale',
  location: '',
  userId: '',
  imageFile: undefined as File | undefined,
};

const AdminCards: React.FC = () => {
  const [cards, setCards] = useState<ImageCard[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState<any>(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAllImages();
      setCards(data);
    } catch (e) {
      setError('Failed to load cards');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await apiService.getAllUsers();
      setUsers(data);
    } catch (e) {
      setError('Failed to load users');
    }
  };

  useEffect(() => { fetchCards(); fetchUsers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('propertyType', form.propertyType);
      formData.append('price', form.price);
      formData.append('location', form.location);
      formData.append('createdBy', form.userId);
      if (form.imageFile) formData.append('image', form.imageFile);
      await fetch('/api/images/admin/upload', {
        method: 'POST',
        headers: apiService.getHeaders(),
        body: formData,
      });
      setShowAdd(false);
      setForm(initialForm);
      fetchCards();
    } catch (e: any) {
      setError(e.message || 'Failed to add card');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiService.updateImage(
        editId!,
        form.title,
        form.description,
        form.price,
        form.type,
        form.location,
        form.imageFile,
        form.propertyType
      );
      setShowEdit(false);
      setForm(initialForm);
      setEditId(null);
      fetchCards();
    } catch (e: any) {
      setError(e.message || 'Failed to update card');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this card?')) return;
    try {
      await apiService.deleteImage(id);
      fetchCards();
    } catch (e) {
      setError('Failed to delete card');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Cards</h1>
      <button className="mb-4 px-4 py-2 bg-primary text-white rounded" onClick={() => { setShowAdd(true); setForm(initialForm); }}>Add Card</button>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        </div>
      ) : (
        <table className="min-w-full bg-card/50 border rounded-lg">
          <thead>
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Property Type</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card._id} className="border-t">
                <td className="p-2">{card.title}</td>
                <td className="p-2">{card.propertyType}</td>
                <td className="p-2">{typeof card.createdBy === 'object' ? card.createdBy.username : card.createdBy}</td>
                <td className="p-2">
                  <button className="px-2 py-1 bg-blue-500 text-white rounded mr-2" onClick={() => { setShowEdit(true); setEditId(card._id); setForm({ ...card, userId: typeof card.createdBy === 'object' ? card.createdBy._id : card.createdBy, imageFile: undefined }); }}>Edit</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(card._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add Card Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-white p-8 rounded shadow-lg min-w-[320px] space-y-4" onSubmit={handleAdd}>
            <h2 className="text-xl font-bold mb-2">Add Card</h2>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <input className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <input className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input className="w-full border p-2 rounded" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input className="w-full border p-2 rounded" placeholder="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
            <select className="w-full border p-2 rounded" value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })} required>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>
            <input className="w-full border p-2 rounded" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <select className="w-full border p-2 rounded" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required>
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.username} ({user.email})</option>
              ))}
            </select>
            <input className="w-full border p-2 rounded" type="file" accept="image/*" onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] })} />
            <div className="flex gap-2 mt-4">
              <button type="submit" className="flex-1 bg-primary text-white px-4 py-2 rounded">Add</button>
              <button type="button" className="flex-1 bg-gray-300 px-4 py-2 rounded" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Edit Card Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-white p-8 rounded shadow-lg min-w-[320px] space-y-4" onSubmit={handleEdit}>
            <h2 className="text-xl font-bold mb-2">Edit Card</h2>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <input className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <input className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input className="w-full border p-2 rounded" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input className="w-full border p-2 rounded" placeholder="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
            <select className="w-full border p-2 rounded" value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })} required>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>
            <input className="w-full border p-2 rounded" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <select className="w-full border p-2 rounded" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required>
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.username} ({user.email})</option>
              ))}
            </select>
            <input className="w-full border p-2 rounded" type="file" accept="image/*" onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] })} />
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

export default AdminCards; 