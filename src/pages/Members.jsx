import { useState } from 'react';
import { Plus, Search, Phone, MapPin, ChevronDown, ChevronRight, Users } from 'lucide-react';

const leadersData = [
  {
    id: 1,
    name: 'Pastor Michael',
    role: 'Senior Pastor',
    branch: 'Main Branch',
    members: [
      { id: 1, name: 'John Smith', cellNumber: 'CEL-001', phone: '+1234567890', status: 'Active' },
      { id: 2, name: 'Mary Johnson', cellNumber: 'CEL-002', phone: '+1234567891', status: 'Active' },
      { id: 3, name: 'David Williams', cellNumber: 'CEL-003', phone: '+1234567892', status: 'New' },
    ],
  },
  {
    id: 2,
    name: 'Deborah Sarah',
    role: 'Ministry Leader',
    branch: 'North Branch',
    members: [
      { id: 4, name: 'Sarah Brown', cellNumber: 'CEL-004', phone: '+1234567893', status: 'Active' },
      { id: 5, name: 'Michael Davis', cellNumber: 'CEL-005', phone: '+1234567894', status: 'Active' },
    ],
  },
  {
    id: 3,
    name: 'Elder David',
    role: 'Elder',
    branch: 'South Branch',
    members: [
      { id: 6, name: 'Emily Wilson', cellNumber: 'CEL-006', phone: '+1234567895', status: 'Active' },
      { id: 7, name: 'James Taylor', cellNumber: 'CEL-007', phone: '+1234567896', status: 'Inactive' },
    ],
  },
  {
    id: 4,
    name: 'Sister Grace',
    role: 'Ministry Leader',
    branch: 'East Branch',
    members: [
      { id: 8, name: 'Lisa Anderson', cellNumber: 'CEL-008', phone: '+1234567897', status: 'New' },
    ],
  },
  {
    id: 5,
    name: 'Brother James',
    role: 'Youth Leader',
    branch: 'West Branch',
    members: [
      { id: 9, name: 'Robert Martinez', cellNumber: 'CEL-009', phone: '+1234567898', status: 'Active' },
      { id: 10, name: 'Jennifer Lee', cellNumber: 'CEL-010', phone: '+1234567899', status: 'Active' },
    ],
  },
];

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedLeaders, setExpandedLeaders] = useState({});

  const toggleLeader = (leaderId) => {
    setExpandedLeaders(prev => ({
      ...prev,
      [leaderId]: !prev[leaderId]
    }));
  };

  const filteredLeaders = leadersData.filter(leader => {
    const matchesSearch = leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leader.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leader.members.some(member => 
                           member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.cellNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
          {filteredLeaders.map((leader) => (
            <div key={leader.id} className="border-b border-gray-100 last:border-0">
              <button
                onClick={() => toggleLeader(leader.id)}
                className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-gray-900 font-semibold">{leader.name}</h3>
                      <span className="text-red-600 text-sm">{leader.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin size={14} />
                      {leader.branch}
                      <span className="text-gray-300">•</span>
                      <Users size={14} />
                      {leader.members.length} {leader.members.length === 1 ? 'member' : 'members'}
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
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <span className="text-gray-900 text-sm">{member.name}</span>
                              </div>
                            </td>
                            <td className="py-3 text-gray-600 text-sm">{member.cellNumber}</td>
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
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Member</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Assign to Leader</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200">
                  <option value="">Select leader</option>
                  {leadersData.map(leader => (
                    <option key={leader.id} value={leader.id}>{leader.name} - {leader.branch}</option>
                  ))}
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
