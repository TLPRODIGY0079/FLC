import { useState } from 'react';
import { Plus, Search, Phone, MapPin } from 'lucide-react';

const membersData = [
  { id: 1, name: 'John Smith', cellNumber: 'CEL-001', phone: '+1234567890', status: 'Active', branch: 'North Branch' },
  { id: 2, name: 'Mary Johnson', cellNumber: 'CEL-002', phone: '+1234567891', status: 'Active', branch: 'South Branch' },
  { id: 3, name: 'David Williams', cellNumber: 'CEL-003', phone: '+1234567892', status: 'Inactive', branch: 'East Branch' },
  { id: 4, name: 'Sarah Brown', cellNumber: 'CEL-004', phone: '+1234567893', status: 'Active', branch: 'West Branch' },
  { id: 5, name: 'Michael Davis', cellNumber: 'CEL-005', phone: '+1234567894', status: 'Active', branch: 'North Branch' },
  { id: 6, name: 'Emily Wilson', cellNumber: 'CEL-006', phone: '+1234567895', status: 'New', branch: 'South Branch' },
];

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredMembers = membersData.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.cellNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Members</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
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
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Name</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Cell Number</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Phone</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Branch</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Status</th>
                <th className="text-left text-gray-600 font-medium px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{member.cellNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{member.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{member.branch}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      member.status === 'Active' ? 'bg-green-100 text-green-700' :
                      member.status === 'Inactive' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone size={18} className="text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MapPin size={18} className="text-gray-500" />
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
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Member</h3>
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
                <label className="block text-gray-600 text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Branch</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                  <option value="">Select branch</option>
                  <option value="north">North Branch</option>
                  <option value="south">South Branch</option>
                  <option value="east">East Branch</option>
                  <option value="west">West Branch</option>
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-colors shadow-md"
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
