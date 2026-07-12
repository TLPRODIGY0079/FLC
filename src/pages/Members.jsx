import { useState, useEffect } from 'react';
import { Plus, Search, Phone, MapPin, ChevronDown, ChevronRight, Users, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedLeaders, setExpandedLeaders] = useState({});
  const [leaders, setLeaders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    leaderId: '',
  });

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

  const toggleLeader = async (leaderId) => {
    setExpandedLeaders(prev => ({
      ...prev,
      [leaderId]: !prev[leaderId]
    }));

    if (!expandedLeaders[leaderId]) {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('leader_id', leaderId);

        if (error) throw error;

        setLeaders(prev => prev.map(leader => 
          leader.id === leaderId 
            ? { ...leader, members: data || [] }
            : leader
        ));
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    }
  };

  const filteredLeaders = leaders.filter(leader => {
    const matchesSearch = leader.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leader.branch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leader.members?.some(member => 
                           member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.cell_number?.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Inactive': return 'bg-red-100 text-red-700';
      case 'New': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from('members').insert({
        leader_id: formData.leaderId,
        full_name: formData.fullName,
        phone: formData.phone,
        cell_number: `CEL-${Math.floor(Math.random() * 10000)}`,
        status: 'New',
      });

      if (error) throw error;

      alert('Member added successfully!');
      setShowAddModal(false);
      setFormData({ fullName: '', phone: '', leaderId: '' });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member. Please try again.');
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900">Members</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search leaders or members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredLeaders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No leaders found</p>
            </div>
          ) : (
            filteredLeaders.map((leader) => {
              const branch = branches.find(b => b.id === leader.branch_id);
              return (
                <div key={leader.id} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => toggleLeader(leader.id)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold">
                          {leader.full_name?.split(' ').map(n => n[0]).join('') || 'L'}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="text-gray-900 font-semibold">{leader.full_name}</h3>
                          <span className="text-red-600 text-sm capitalize">{leader.role}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin size={14} />
                          {branch?.name || 'No branch'}
                          <span className="text-gray-300">•</span>
                          <Users size={14} />
                          {leader.members?.length || 0} {leader.members?.length === 1 ? 'member' : 'members'}
                        </div>
                      </div>
                    </div>
                    {expandedLeaders[leader.id] ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </button>

                  {expandedLeaders[leader.id] && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      <div className="p-4">
                        {leader.members?.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No members yet</p>
                        ) : (
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-gray-500 text-xs uppercase">
                                <th className="pb-2 font-medium">Name</th>
                                <th className="pb-2 font-medium">Cell Number</th>
                                <th className="pb-2 font-medium">Phone</th>
                                <th className="pb-2 font-medium">Status</th>
                                <th className="pb-2 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {leader.members.map((member) => (
                                <tr key={member.id} className="border-t border-gray-200">
                                  <td className="py-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold">
                                          {member.full_name?.split(' ').map(n => n[0]).join('') || 'M'}
                                        </span>
                                      </div>
                                      <span className="text-gray-900 text-sm">{member.full_name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 text-gray-600 text-sm">{member.cell_number}</td>
                                  <td className="py-3 text-gray-600 text-sm">{member.phone}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                                      {member.status}
                                    </span>
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-1">
                                      <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                                        <Phone size={16} className="text-gray-500" />
                                      </button>
                                      <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                                        <MapPin size={16} className="text-gray-500" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Member</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Assign to Leader</label>
                <select 
                  value={formData.leaderId}
                  onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  required
                >
                  <option value="">Select leader</option>
                  {leaders.map(leader => {
                    const branch = branches.find(b => b.id === leader.branch_id);
                    return (
                      <option key={leader.id} value={leader.id}>{leader.full_name} - {branch?.name || 'No branch'}</option>
                    );
                  })}
                </select>
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
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
