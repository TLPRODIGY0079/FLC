import { useState } from 'react';
import { Search, Phone, MapPin, Calendar, Check, Plus } from 'lucide-react';

const followUpsData = [
  {
    id: 1,
    memberName: 'John Doe',
    leader: 'Pastor Michael',
    type: 'First Visit',
    status: 'Pending',
    date: '2025-07-08',
    notes: 'New member from Sunday service',
    lastContact: '2 days ago',
    priority: 'High',
  },
  {
    id: 2,
    memberName: 'Jane Smith',
    leader: 'Deborah Sarah',
    type: 'Follow-up Call',
    status: 'Completed',
    date: '2025-07-07',
    notes: 'Discussed joining small group',
    lastContact: 'Yesterday',
    priority: 'Medium',
  },
  {
    id: 3,
    memberName: 'Robert Johnson',
    leader: 'Elder David',
    type: 'Home Visit',
    status: 'In Progress',
    date: '2025-07-06',
    notes: 'Family needs prayer support',
    lastContact: '3 days ago',
    priority: 'High',
  },
  {
    id: 4,
    memberName: 'Maria Garcia',
    leader: 'Sister Grace',
    type: 'Hospital Visit',
    status: 'Pending',
    date: '2025-07-05',
    notes: 'Recovering from surgery',
    lastContact: '1 week ago',
    priority: 'Urgent',
  },
  {
    id: 5,
    memberName: 'James Wilson',
    leader: 'Brother James',
    type: 'Follow-up Call',
    status: 'Completed',
    date: '2025-07-04',
    notes: 'Interested in baptism',
    lastContact: '4 days ago',
    priority: 'Medium',
  },
  {
    id: 6,
    memberName: 'Sarah Brown',
    leader: 'Pastor Michael',
    type: 'First Visit',
    status: 'Pending',
    date: '2025-07-08',
    notes: 'First time visitor',
    lastContact: 'Today',
    priority: 'High',
  },
];

export default function FollowUps() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);

  const filteredFollowUps = followUpsData.filter(followUp => {
    const matchesSearch = followUp.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         followUp.leader.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || followUp.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Follow-ups</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
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
                placeholder="Search follow-ups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 text-gray-900 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Member</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Leader</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Type</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Status</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Priority</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Last Contact</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFollowUps.map((followUp) => (
                <tr key={followUp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900 font-medium">{followUp.memberName}</p>
                      <p className="text-gray-500 text-sm">{followUp.notes}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{followUp.leader}</td>
                  <td className="px-6 py-4 text-gray-600">{followUp.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(followUp.status)}`}>
                      {followUp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(followUp.priority)}`}>
                      {followUp.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{followUp.lastContact}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedFollowUp(followUp)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Calendar size={18} className="text-gray-500" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Call"
                      >
                        <Phone size={18} className="text-gray-500" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Visit"
                      >
                        <MapPin size={18} className="text-gray-500" />
                      </button>
                      <button 
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Mark Complete"
                      >
                        <Check size={18} className="text-green-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Follow-up</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Member Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter member name"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Follow-up Type</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                  <option value="">Select type</option>
                  <option value="first-visit">First Visit</option>
                  <option value="follow-up-call">Follow-up Call</option>
                  <option value="home-visit">Home Visit</option>
                  <option value="hospital-visit">Hospital Visit</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Priority</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Notes</label>
                <textarea
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-colors shadow-md"
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
                <span className="text-gray-900 font-medium">{selectedFollowUp.memberName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Leader:</span>
                <span className="text-gray-900 font-medium">{selectedFollowUp.leader}</span>
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
                <span className="text-gray-900 font-medium">{selectedFollowUp.lastContact}</span>
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
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-colors shadow-md">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
