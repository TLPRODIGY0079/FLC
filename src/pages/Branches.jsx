import { useState, useEffect } from 'react';
import { Plus, MapPin, Users, Loader2, FolderKanban, Landmark } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Branches({ title = 'Fellowships', entityLabel = 'Fellowship' }) {
  const { isAdmin } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    leader: '',
  });

  const isCouncilView = title === 'Councils';

  useEffect(() => {
    fetchBranches();
  }, [title]);

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase.from('branches').select('*');
      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('branches').insert({
        name: formData.name,
        location: formData.location,
      });

      if (error) throw error;

      alert(`${entityLabel} added successfully!`);
      setShowAddModal(false);
      setFormData({ name: '', location: '', leader: '' });
      fetchBranches();
    } catch (error) {
      console.error('Error adding data:', error);
      alert(`Error adding ${entityLabel.toLowerCase()}. Please try again.`);
    }
  };

  const emptyStateText = `No ${entityLabel.toLowerCase()}s yet`;
  const addButtonText = `Add ${entityLabel}`;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="text-red-600 animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-red-600 font-semibold">{isCouncilView ? 'Council management' : 'Fellowship management'}</p>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {isCouncilView ? <Landmark size={16} /> : <FolderKanban size={16} />}
            <span>{isCouncilView ? 'A council is a collection of fellowships under 1 leader' : 'Fellowship data and weekly records'}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-red-50 p-4">
          <p className="text-sm text-red-700">Total {title}</p>
          <p className="text-2xl font-bold text-gray-900">{branches.length}</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-sm text-blue-700">Active leaders</p>
          <p className="text-2xl font-bold text-gray-900">{branches.length || 0}</p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4">
          <p className="text-sm text-green-700">Report deadline</p>
          <p className="text-2xl font-bold text-gray-900">Fri 23:00</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title} Overview</h3>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
          >
            <Plus size={20} />
            {addButtonText}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
            <p>{emptyStateText}</p>
          </div>
        ) : (
          branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-red-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                  <p className="text-gray-600 text-sm">{branch.location || 'No location provided'}</p>
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
                  <MapPin size={20} className="text-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">0</p>
                  <p className="text-gray-500 text-xs">Souls Won</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-gray-500 text-xs">Visits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-gray-500 text-xs">Members</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Users size={16} />
                  <span>{isCouncilView ? 'Council Leader: Not assigned' : 'Fellowship Leader: Not assigned'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New {entityLabel}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">{entityLabel} Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder={`Enter ${entityLabel.toLowerCase()} name`}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter location"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Leader</label>
                <input
                  type="text"
                  value={formData.leader}
                  onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder={isCouncilView ? 'Enter council leader name' : 'Enter fellowship leader name'}
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
                  {addButtonText}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
