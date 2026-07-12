import { useState, useEffect } from 'react';
import { Search, Phone, MapPin, Mail, Edit, Plus, Award, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Leaders() {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadersRes, branchesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'leader'),
        supabase.from('branches').select('*'),
      ]);

      if (leadersRes.error) throw leadersRes.error;
      if (branchesRes.error) throw branchesRes.error;

      setLeaders(leadersRes.data || []);
      setBranches(branchesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaders = leaders.filter(leader => {
    const branch = branches.find(b => b.id === leader.branch_id);
    return leader.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           leader.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           branch?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="text-red-600 animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Leaders</h2>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
          >
            <Plus size={20} />
            Add Leader
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search leaders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredLeaders.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">
              <Award size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No leaders found</p>
            </div>
          ) : (
            filteredLeaders.map((leader) => {
              const branch = branches.find(b => b.id === leader.branch_id);
              return (
                <div key={leader.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-xl font-bold">
                          {leader.full_name?.split(' ').map(n => n[0]).join('') || 'L'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{leader.full_name}</h3>
                        <p className="text-red-600 text-sm font-medium capitalize">{leader.role}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setEditingLeader(leader)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Edit Leader"
                      >
                        <Edit size={18} className="text-gray-500" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin size={16} />
                      <span>{branch?.name || 'No branch'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone size={16} />
                      <span>{leader.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Mail size={16} />
                      <span>{leader.email || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-600">0</p>
                      <p className="text-gray-500 text-xs">Souls</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">0</p>
                      <p className="text-gray-500 text-xs">Visits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">0</p>
                      <p className="text-gray-500 text-xs">Calls</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600">0</p>
                      <p className="text-gray-500 text-xs">Fellowships</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showAddModal && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Leader</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              // Handle add leader with Supabase
              alert('Leader management requires user account creation. This will be implemented with authentication.');
              setShowAddModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Role</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200" required>
                  <option value="">Select role</option>
                  <option value="Senior Pastor">Senior Pastor</option>
                  <option value="Associate Pastor">Associate Pastor</option>
                  <option value="Elder">Elder</option>
                  <option value="Ministry Leader">Ministry Leader</option>
                  <option value="Youth Leader">Youth Leader</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Branch</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200" required>
                  <option value="">Select branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors shadow-md"
                >
                  Add Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingLeader && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Leader</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              // Handle update with Supabase
              alert('Leader update will be implemented with Supabase.');
              setEditingLeader(null);
            }} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={editingLeader.full_name}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Role</label>
                <select 
                  defaultValue={editingLeader.role}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  onChange={(e) => setIsCustomRole(e.target.value === 'custom')}
                >
                  <option value="">Select role</option>
                  <option value="Senior Pastor">Senior Pastor</option>
                  <option value="Associate Pastor">Associate Pastor</option>
                  <option value="Elder">Elder</option>
                  <option value="Ministry Leader">Ministry Leader</option>
                  <option value="Youth Leader">Youth Leader</option>
                  <option value="Worship Leader">Worship Leader</option>
                  <option value="Prayer Team">Prayer Team</option>
                  <option value="custom">Custom Role...</option>
                </select>
                {isCustomRole && (
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 mt-2"
                    placeholder="Enter custom role"
                  />
                )}
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Branch</label>
                <select 
                  defaultValue={editingLeader.branch_id}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                >
                  <option value="">Select branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={editingLeader.phone}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={editingLeader.email}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingLeader(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
