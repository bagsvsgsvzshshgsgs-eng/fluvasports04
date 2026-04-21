"use client";

import { useStore, AdminUser, Role } from "@/components/StoreContext";
import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Shield, User as UserIcon } from "lucide-react";

export default function UsersAdmin() {
  const { settings, updateSettings, adminUser: currentUser } = useStore();
  const users = settings.adminUsers || [];
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AdminUser>>({});

  const handleEdit = (user: AdminUser) => {
    setEditingId(user.id);
    setFormData(user);
  };

  const handleDelete = (id: string) => {
    if (currentUser?.id === id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (confirm("Are you sure you want to delete this user?")) {
      updateSettings({ adminUsers: users.filter(u => u.id !== id) });
      if (editingId === id) setEditingId(null);
    }
  };

  const handleAddNew = () => {
    const newUser: AdminUser = {
      id: `admin_${Date.now()}`,
      name: "New User",
      email: "user@fluvasport.com",
      role: "Editor",
      status: "Active",
    };
    updateSettings({ adminUsers: [...users, newUser] });
    handleEdit(newUser);
  };

  const handleSave = () => {
    if (!editingId) return;
    updateSettings({
      adminUsers: users.map(u => u.id === editingId ? { ...u, ...formData } as AdminUser : u)
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Staff Accounts</h1>
          <p className="text-gray-400 text-sm">Manage dashboard access and assign roles to your team members.</p>
        </div>
        <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black border border-gray-900 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-900">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900 text-sm">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name} {currentUser?.id === user.id && "(You)"}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-gray-300">
                        {user.role === 'SuperAdmin' ? <Shield size={14} className="text-orange-500" /> : <UserIcon size={14} className="text-blue-500" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold ${
                        user.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(user)} className="p-2 text-orange-500 hover:bg-orange-500/10 rounded-md transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1">
          {editingId ? (
            <div className="bg-black border border-gray-900 rounded-xl p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif text-white">Edit User</h3>
                <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Role</label>
                  <select value={formData.role || 'Editor'} onChange={e => setFormData({...formData, role: e.target.value as Role})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none">
                    <option value="Editor">Editor</option>
                    <option value="SuperAdmin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Status</label>
                  <select value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none">
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <button onClick={handleSave} className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex justify-center items-center gap-2 mt-4">
                  <Save size={16} /> Save User
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/30 border border-gray-900 rounded-xl p-8 flex flex-col items-center justify-center text-center h-64 sticky top-24">
              <UserIcon size={32} className="text-gray-600 mb-4" />
              <p className="text-gray-500 text-sm">Select a user to edit their permissions or create a new account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
