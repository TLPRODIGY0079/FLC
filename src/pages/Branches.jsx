import { useState } from 'react';
import { Plus, MapPin, Users } from 'lucide-react';

const branchesData = [
  { id: 1, name: 'North Branch', leader: 'Pastor Michael', soulsWon: 45, visits: 32, members: 25 },
  { id: 2, name: 'South Branch', leader: 'Deborah Sarah', soulsWon: 38, visits: 28, members: 20 },
  { id: 3, name: 'East Branch', leader: 'Elder David', soulsWon: 52, visits: 40, members: 30 },
  { id: 4, name: 'West Branch', leader: 'Sister Grace', soulsWon: 41, visits: 35, members: 22 },
  { id: 5, name: 'Central Branch', leader: 'Brother James', soulsWon: 48, visits: 38, members: 28 },
];

export default function Branches() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Branches</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
        >
          <Plus size={20} />
          Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branchesData.map((branch) => (
          <div key={branch.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-purple-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                <p className="text-gray-600 text-sm">Leader: {branch.leader}</p>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
                <MapPin size={20} className="text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{branch.soulsWon}</p>
                <p className="text-gray-500 text-xs">Souls Won</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{branch.visits}</p>
                <p className="text-gray-500 text-xs">Visits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{branch.members}</p>
                <p className="text-gray-500 text-xs">Members</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users size={16} />
                <span>{branch.members} Active Members</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Branch</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Branch Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter branch name"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Branch Leader</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter leader name"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter location"
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
                  Add Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
