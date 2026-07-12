import { useState, useEffect } from 'react';
import { Plus, MapPin, Users, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Branches() {
  const { isAdmin } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase.from('branches').select('*');
      
      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
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

      alert('Branch added successfully!');
      setShowAddModal(false);
      setFormData({ name: '', location: '' });
      
      // Refresh data
      fetchBranches();
    } catch (error) {
      console.error('Error adding branch:', error);
      alert('Error adding branch. Please try again.');
    }
  };

  const getBranchStats = async (branchId) => {
    try {
      const [membersRes, reportsRes] = await Promise.all([
        supabase.from('members').select('*').eq('branch_id', branchId),
        supabase.from('reports').select('souls_won').eq('branch_id', branchId),
      ]);

      const membersCount = membersRes.data?.length || 0;
      const soulsWon = reportsRes.data?.reduce((sum, r) => sum + (r.souls_won || 0), 0) || 0;
      const visits = reportsRes.data?.length || 0;

      return { membersCount, soulsWon, visits };
    } catch (error) {
      console.error('Error fetching branch stats:', error);
      return { membersCount: 0, soulsWon: 0, visits: 0 };
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
        <h2 className="text-2xl font-bold text-gray-900">Branches</h2>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
          >
            <Plus size={20} />
            Add Branch
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No branches yet</p>
          </div>
        ) : (
          branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-red-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                  <p className="text-gray-600 text-sm">{branch.location}</p>
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
                  <span>0 Active Members</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Branch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Branch Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter branch name"
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
