import { useState, useEffect } from 'react';
import { Search, Phone, MapPin, Calendar, Check, Plus, ChevronDown, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function FollowUps() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [expandedLeaders, setExpandedLeaders] = useState({});
  const [leaders, setLeaders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    leaderId: '',
    memberName: '',
    type: '',
    priority: 'medium',
    notes: '',
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
          .from('follow_ups')
          .select('*')
          .eq('leader_id', leaderId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setLeaders(prev => prev.map(leader => 
          leader.id === leaderId 
            ? { ...leader, followUps: data || [] }
            : leader
        ));
      } catch (error) {
        console.error('Error fetching follow-ups:', error);
      }
    }
  };

  const filteredLeaders = leaders.filter(leader => {
    const matchesSearch = leader.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leader.branch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leader.followUps?.some(followUp => 
                           followUp.member_name?.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = filterStatus === 'all' || 
                          leader.followUps?.some(followUp => 
                            followUp.status?.toLowerCase() === filterStatus.toLowerCase()
                          );
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPendingCount = (leader) => {
    return leader.followUps?.filter(f => f.status === 'Pending').length || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from('follow_ups').insert({
        leader_id: formData.leaderId,
        member_name: formData.memberName,
        type: formData.type,
        priority: formData.priority,
        notes: formData.notes,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        last_contact: 'Just now',
      });

      if (error) throw error;

      alert('Follow-up added successfully!');
      setShowAddModal(false);
      setFormData({ leaderId: '', memberName: '', type: '', priority: 'medium', notes: '' });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error adding follow-up:', error);
      alert('Error adding follow-up. Please try again.');
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
        <h2 className="text-2xl font-bold text-gray-900">Follow-ups</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
        >
          <Plus size={20} />
          Add Follow-up
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search leaders or members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 text-gray-900 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredLeaders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
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
                          {getPendingCount(leader) > 0 && (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                              <AlertCircle size={12} />
                              {getPendingCount(leader)} pending
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin size={14} />
                          {branch?.name || 'No branch'}
                          <span className="text-gray-300">•</span>
                          {leader.followUps?.length || 0} {leader.followUps?.length === 1 ? 'follow-up' : 'follow-ups'}
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
                        {leader.followUps?.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No follow-ups yet</p>
                        ) : (
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-gray-500 text-xs uppercase">
                                <th className="pb-2 font-medium">Member</th>
                                <th className="pb-2 font-medium">Type</th>
                                <th className="pb-2 font-medium">Status</th>
                                <th className="pb-2 font-medium">Priority</th>
                                <th className="pb-2 font-medium">Last Contact</th>
                                <th className="pb-2 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {leader.followUps.map((followUp) => (
                                <tr key={followUp.id} className="border-t border-gray-200">
                                  <td className="py-3">
                                    <div>
                                      <p className="text-gray-900 text-sm font-medium">{followUp.member_name}</p>
                                      <p className="text-gray-500 text-xs">{followUp.notes}</p>
                                    </div>
                                  </td>
                                  <td className="py-3 text-gray-600 text-sm">{followUp.type}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(followUp.status)}`}>
                                      {followUp.status}
                                    </span>
                                  </td>
                                  <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(followUp.priority)}`}>
                                      {followUp.priority}
                                    </span>
                                  </td>
                                  <td className="py-3 text-gray-600 text-sm">{followUp.last_contact}</td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-1">
                                      <button 
                                        onClick={() => setSelectedFollowUp(followUp)}
                                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                        title="View Details"
                                      >
                                        <Calendar size={16} className="text-gray-500" />
                                      </button>
                                      <button 
                                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                        title="Call"
                                      >
                                        <Phone size={16} className="text-gray-500" />
                                      </button>
                                      <button 
                                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                        title="Visit"
                                      >
                                        <MapPin size={16} className="text-gray-500" />
                                      </button>
                                      <button 
                                        className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                                        title="Mark Complete"
                                      >
                                        <Check size={16} className="text-green-600" />
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
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Follow-up</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Member Name</label>
                <input
                  type="text"
                  value={formData.memberName}
                  onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter member name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Follow-up Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  required
                >
                  <option value="">Select type</option>
                  <option value="First Visit">First Visit</option>
                  <option value="Follow-up Call">Follow-up Call</option>
                  <option value="Home Visit">Home Visit</option>
                  <option value="Hospital Visit">Hospital Visit</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Priority</label>
                <select 
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
                  placeholder="Add notes..."
                  rows={3}
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
                  Add Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedFollowUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Follow-up Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member:</span>
                <span className="text-gray-900 font-medium">{selectedFollowUp.member_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Type:</span>
                <span className="text-gray-900 font-medium">{selectedFollowUp.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedFollowUp.status)}`}>
                  {selectedFollowUp.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Priority:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedFollowUp.priority)}`}>
                  {selectedFollowUp.priority}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900 font-medium">{selectedFollowUp.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Contact:</span>
                <span className="text-gray-900 font-medium">{selectedFollowUp.last_contact}</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-2">Notes:</span>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-xl">{selectedFollowUp.notes}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedFollowUp(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl transition-colors"
              >
                Close
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors shadow-md">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
