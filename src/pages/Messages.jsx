import { useState } from 'react';
import { Search, Send, Plus, BookOpen, Calendar, Clock, User, Edit, Trash2 } from 'lucide-react';

const scriptureData = [
  {
    id: 1,
    title: 'The Great Commission',
    scripture: 'Matthew 28:19-20',
    content: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.',
    author: 'Admin',
    date: '2025-07-08',
    time: '10:30 AM',
    category: 'Evangelism',
  },
  {
    id: 2,
    title: 'Faith and Works',
    scripture: 'James 2:14-17',
    content: 'What good is it, my brothers and sisters, if someone claims to have faith but has no deeds? Can such faith save them? Suppose a brother or a sister is without clothes and daily food. If one of you says to them, "Go in peace; keep warm and well fed," but does nothing about their physical needs, what good is it? In the same way, faith by itself, if it is not accompanied by action, is dead.',
    author: 'Admin',
    date: '2025-07-07',
    time: '3:15 PM',
    category: 'Discipleship',
  },
  {
    id: 3,
    title: 'Love One Another',
    scripture: 'John 13:34-35',
    content: 'A new command I give you: Love one another. As I have loved you, so you must love one another. By this everyone will know that you are my disciples, if you love one another.',
    author: 'Admin',
    date: '2025-07-06',
    time: '9:00 AM',
    category: 'Fellowship',
  },
  {
    id: 4,
    title: 'The Armor of God',
    scripture: 'Ephesians 6:10-18',
    content: 'Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil\'s schemes. For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms.',
    author: 'Admin',
    date: '2025-07-05',
    time: '2:45 PM',
    category: 'Spiritual Warfare',
  },
  {
    id: 5,
    title: 'The Fruit of the Spirit',
    scripture: 'Galatians 5:22-23',
    content: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.',
    author: 'Admin',
    date: '2025-07-04',
    time: '11:20 AM',
    category: 'Character',
  },
];

export default function Messages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedScripture, setSelectedScripture] = useState(null);

  const filteredScriptures = scriptureData.filter(scripture => {
    const matchesSearch = scripture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scripture.scripture.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scripture.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || scripture.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Evangelism': return 'bg-red-100 text-red-700';
      case 'Discipleship': return 'bg-blue-100 text-blue-700';
      case 'Fellowship': return 'bg-green-100 text-green-700';
      case 'Spiritual Warfare': return 'bg-purple-100 text-purple-700';
      case 'Character': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Scripture Messages</h2>
        <button
          onClick={() => setShowComposeModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
        >
          <Plus size={20} />
          Post Scripture
        </button>
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
              <option value="Character">Character</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredScriptures.map((scripture) => (
            <div
              key={scripture.id}
              onClick={() => setSelectedScripture(scripture)}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-gray-900 font-semibold truncate">{scripture.title}</h4>
                    <span className="text-gray-400 text-sm flex items-center gap-1 flex-shrink-0 ml-2">
                      <Clock size={14} />
                      {scripture.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-600 text-sm font-medium">{scripture.scripture}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">Posted by {scripture.author}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">{scripture.content}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(scripture.category)}`}>
                      {scripture.category}
                    </span>
                    <span className="text-gray-400 text-xs">{scripture.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Post New Scripture</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter scripture title"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Scripture Reference</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="e.g., John 3:16"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Category</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200">
                  <option value="">Select category</option>
                  <option value="Evangelism">Evangelism</option>
                  <option value="Discipleship">Discipleship</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Spiritual Warfare">Spiritual Warfare</option>
                  <option value="Character">Character</option>
                  <option value="Prayer">Prayer</option>
                  <option value="Worship">Worship</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Scripture Content</label>
                <textarea
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
                  placeholder="Enter the scripture text..."
                  rows={6}
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Additional Notes (Optional)</label>
                <textarea
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
                  placeholder="Add any additional notes or commentary..."
                  rows={3}
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
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Post Scripture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedScripture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl border border-gray-100 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedScripture.title}</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit size={18} className="text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-red-600" />
                <span className="text-red-600 font-semibold">{selectedScripture.scripture}</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-900 leading-relaxed">{selectedScripture.content}</p>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  Posted by {selectedScripture.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {selectedScripture.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {selectedScripture.time}
                </span>
              </div>
              
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedScripture.category)}`}>
                  {selectedScripture.category}
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedScripture(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl transition-colors"
              >
                Close
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2">
                <Send size={18} />
                Share with Leaders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
