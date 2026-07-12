import { useState, useEffect } from 'react';
import { Search, Send, Plus, BookOpen, Calendar, Clock, User, Edit, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Messages() {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedScripture, setSelectedScripture] = useState(null);
  const [scriptures, setScriptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    scripture: '',
    category: '',
    content: '',
    notes: '',
  });

  useEffect(() => {
    fetchScriptures();
  }, []);

  const fetchScriptures = async () => {
    try {
      const { data, error } = await supabase
        .from('scriptures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScriptures(data || []);
    } catch (error) {
      console.error('Error fetching scriptures:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredScriptures = scriptures.filter(scripture => {
    const matchesSearch = scripture.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scripture.scripture?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scripture.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || scripture.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('scriptures').insert({
        title: formData.title,
        scripture: formData.scripture,
        category: formData.category,
        content: formData.content,
        notes: formData.notes,
        created_by: user?.id,
      });

      if (error) throw error;

      alert('Scripture posted successfully!');
      setShowComposeModal(false);
      setFormData({ title: '', scripture: '', category: '', content: '', notes: '' });
      
      // Refresh data
      fetchScriptures();
    } catch (error) {
      console.error('Error posting scripture:', error);
      alert('Error posting scripture. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this scripture?')) return;
    
    try {
      const { error } = await supabase.from('scriptures').delete().eq('id', id);
      
      if (error) throw error;
      
      alert('Scripture deleted successfully!');
      fetchScriptures();
    } catch (error) {
      console.error('Error deleting scripture:', error);
      alert('Error deleting scripture. Please try again.');
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
        <h2 className="text-2xl font-bold text-gray-900">Scripture Messages</h2>
        {isAdmin && (
          <button
            onClick={() => setShowComposeModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
          >
            <Plus size={20} />
            Post Scripture
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search scriptures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-50 text-gray-900 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            >
              <option value="all">All Categories</option>
              <option value="Evangelism">Evangelism</option>
              <option value="Discipleship">Discipleship</option>
              <option value="Fellowship">Fellowship</option>
              <option value="Spiritual Warfare">Spiritual Warfare</option>
              <option value="Prayer">Prayer</option>
              <option value="Worship">Worship</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredScriptures.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No scriptures posted yet</p>
            </div>
          ) : (
            filteredScriptures.map((scripture) => (
              <div key={scripture.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedScripture(scripture)}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900 font-semibold truncate">{scripture.title}</h3>
                      <span className="text-red-600 text-xs px-2 py-1 rounded-full bg-red-50 capitalize">
                        {scripture.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 italic">{scripture.scripture}</p>
                    <p className="text-gray-500 text-sm line-clamp-2">{scripture.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>Admin</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(scripture.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{new Date(scripture.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Post Scripture</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter scripture title"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Scripture Reference</label>
                <input
                  type="text"
                  value={formData.scripture}
                  onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="e.g., John 3:16"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Evangelism">Evangelism</option>
                  <option value="Discipleship">Discipleship</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Spiritual Warfare">Spiritual Warfare</option>
                  <option value="Prayer">Prayer</option>
                  <option value="Worship">Worship</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
                  placeholder="Enter scripture content"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
                  placeholder="Add any additional notes"
                  rows={2}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors shadow-md"
                >
                  Post Scripture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedScripture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedScripture.title}</h3>
                  <span className="text-red-600 text-xs px-2 py-1 rounded-full bg-red-50 capitalize">
                    {selectedScripture.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedScripture(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Scripture Reference</p>
                <p className="text-gray-900 italic">{selectedScripture.scripture}</p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Content</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-xl">{selectedScripture.content}</p>
              </div>
              
              {selectedScripture.notes && (
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Notes</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-xl">{selectedScripture.notes}</p>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-gray-400 text-sm pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>Admin</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(selectedScripture.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{new Date(selectedScripture.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedScripture(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedScripture.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
