import { useState } from 'react';
import { Search, Phone, MapPin, Mail, Edit, Plus, Award } from 'lucide-react';

const leadersData = [
  {
    id: 1,
    name: 'Pastor Michael',
    role: 'Senior Pastor',
    branch: 'Main Branch',
    phone: '+1 234 567 8901',
    email: 'michael@church.com',
    soulsWon: 156,
    visits: 89,
    calls: 234,
    fellowships: 45,
    avatar: 'PM',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Deborah Sarah',
    role: 'Associate Pastor',
    branch: 'North Branch',
    phone: '+1 234 567 8902',
    email: 'deborah@church.com',
    soulsWon: 134,
    visits: 76,
    calls: 198,
    fellowships: 38,
    avatar: 'DS',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Elder David',
    role: 'Elder',
    branch: 'South Branch',
    phone: '+1 234 567 8903',
    email: 'david@church.com',
    soulsWon: 98,
    visits: 65,
    calls: 156,
    fellowships: 28,
    avatar: 'ED',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Sister Grace',
    role: 'Ministry Leader',
    branch: 'East Branch',
    phone: '+1 234 567 8904',
    email: 'grace@church.com',
    soulsWon: 87,
    visits: 54,
    calls: 134,
    fellowships: 22,
    avatar: 'SG',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Brother James',
    role: 'Youth Leader',
    branch: 'West Branch',
    phone: '+1 234 567 8905',
    email: 'james@church.com',
    soulsWon: 76,
    visits: 48,
    calls: 112,
    fellowships: 19,
    avatar: 'BJ',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Pastor John',
    role: 'Senior Pastor',
    branch: 'Central Branch',
    phone: '+1 234 567 8906',
    email: 'john@church.com',
    soulsWon: 145,
    visits: 82,
    calls: 210,
    fellowships: 41,
    avatar: 'PJ',
    status: 'Active',
  },
];

export default function Leaders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);

  const filteredLeaders = leadersData.filter(leader =>
    leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Leaders</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
        >
          <Plus size={20} />
          Add Leader
        </button>
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
              className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredLeaders.map((leader) => (
            <div key={leader.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-xl font-bold">{leader.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{leader.name}</h3>
                    <p className="text-purple-600 text-sm font-medium">{leader.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingLeader(leader)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Edit Leader"
                >
                  <Edit size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin size={16} />
                  <span>{leader.branch}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone size={16} />
                  <span>{leader.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail size={16} />
                  <span>{leader.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{leader.soulsWon}</p>
                  <p className="text-gray-500 text-xs">Souls</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{leader.visits}</p>
                  <p className="text-gray-500 text-xs">Visits</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{leader.calls}</p>
                  <p className="text-gray-500 text-xs">Calls</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-500">{leader.fellowships}</p>
                  <p className="text-gray-500 text-xs">Fellowships</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  leader.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {leader.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Leader</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Role</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                  <option value="">Select role</option>
                  <option value="senior-pastor">Senior Pastor</option>
                  <option value="associate-pastor">Associate Pastor</option>
                  <option value="elder">Elder</option>
                  <option value="ministry-leader">Ministry Leader</option>
                  <option value="youth-leader">Youth Leader</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Branch</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                  <option value="">Select branch</option>
                  <option value="main">Main Branch</option>
                  <option value="north">North Branch</option>
                  <option value="south">South Branch</option>
                  <option value="east">East Branch</option>
                  <option value="west">West Branch</option>
                  <option value="central">Central Branch</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter email"
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
                  Add Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingLeader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Leader</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={editingLeader.name}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Role</label>
                <select 
                  defaultValue={editingLeader.role}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
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
                <select 
                  defaultValue={editingLeader.branch}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="">Select branch</option>
                  <option value="Main Branch">Main Branch</option>
                  <option value="North Branch">North Branch</option>
                  <option value="South Branch">South Branch</option>
                  <option value="East Branch">East Branch</option>
                  <option value="West Branch">West Branch</option>
                  <option value="Central Branch">Central Branch</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={editingLeader.phone}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={editingLeader.email}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Status</label>
                <select 
                  defaultValue={editingLeader.status}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-colors shadow-md"
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
