import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminUsers from './AdminUsers';
import AdminCards from './AdminCards';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'users' | 'cards'>('users');

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card/80 border-r border-border p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <button
          className={`text-left px-4 py-2 rounded transition-colors ${tab === 'users' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
          onClick={() => setTab('users')}
        >
          Users
        </button>
        <button
          className={`text-left px-4 py-2 rounded transition-colors ${tab === 'cards' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
          onClick={() => setTab('cards')}
        >
          Cards
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {tab === 'users' && <AdminUsers />}
        {tab === 'cards' && <AdminCards />}
      </main>
    </div>
  );
};

export default AdminDashboard; 