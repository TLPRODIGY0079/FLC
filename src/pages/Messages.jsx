import { useState } from 'react';
import { Search, Send, Plus, Phone, Mail, Clock, User } from 'lucide-react';

const messagesData = [
  {
    id: 1,
    leader: 'Pastor Michael',
    member: 'John Doe',
    subject: 'Welcome to the Church',
    message: 'Welcome to our church family! We are so glad you joined us on Sunday. Looking forward to getting to know you better.',
    date: '2025-07-08',
    time: '10:30 AM',
    status: 'sent',
    type: 'welcome',
  },
  {
    id: 2,
    leader: 'Deborah Sarah',
    member: 'Jane Smith',
    subject: 'Small Group Invitation',
    message: 'Hi Jane, I wanted to personally invite you to our small group meeting this Wednesday at 7 PM. It\'s a great time for fellowship and Bible study.',
    date: '2025-07-07',
    time: '3:15 PM',
    status: 'sent',
    type: 'invitation',
  },
  {
    id: 3,
    leader: 'Elder David',
    member: 'Robert Johnson',
    subject: 'Prayer Request Follow-up',
    message: 'Robert, just wanted to follow up on your prayer request. How are you and your family doing? We\'ve been praying for you.',
    date: '2025-07-06',
    time: '9:00 AM',
    status: 'replied',
    type: 'follow-up',
  },
  {
    id: 4,
    leader: 'Sister Grace',
    member: 'Maria Garcia',
    subject: 'Hospital Visit',
    message: 'Dear Maria, I\'m sorry to hear about your surgery. I\'ll be visiting you at the hospital tomorrow. Is there anything specific you need?',
    date: '2025-07-05',
    time: '2:45 PM',
    status: 'sent',
    type: 'care',
  },
  {
    id: 5,
    leader: 'Brother James',
    member: 'James Wilson',
    subject: 'Baptism Classes',
    message: 'Hey James, great to hear you\'re interested in baptism! Our next baptism classes start next month. Let me know if you want to sign up.',
    date: '2025-07-04',
    time: '11:20 AM',
    status: 'replied',
    type: 'discipleship',
  },
  {
    id: 6,
    leader: 'Pastor Michael',
    member: 'Sarah Brown',
    subject: 'First Visit Follow-up',
    message: 'Thank you for visiting us this Sunday! I hope you felt welcomed. Please let me know if you have any questions about our church.',
    date: '2025-07-08',
    time: '8:00 AM',
    status: 'sent',
    type: 'welcome',
  },
  {
    id: 7,
    leader: 'Deborah Sarah',
    member: 'Emily Davis',
    subject: 'Volunteer Opportunity',
    message: 'Emily, we have a great opportunity for you to serve in our children\'s ministry. Would you be interested in learning more?',
    date: '2025-07-03',
    time: '4:30 PM',
    status: 'pending',
    type: 'volunteer',
  },
  {
    id: 8,
    leader: 'Elder David',
    member: 'Michael Brown',
    subject: 'Bible Study Resources',
    message: 'Here are some Bible study resources I mentioned during our last meeting. I hope they help you in your spiritual growth.',
    date: '2025-07-02',
    time: '1:00 PM',
    status: 'replied',
    type: 'discipleship',
  },
];

export default function Messages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const filteredMessages = messagesData.filter(message => {
    const matchesSearch = message.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || message.type === filterType;
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'replied': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'welcome': return 'bg-purple-100 text-purple-700';
      case 'invitation': return 'bg-blue-100 text-blue-700';
      case 'follow-up': return 'bg-green-100 text-green-700';
      case 'care': return 'bg-red-100 text-red-700';
      case 'discipleship': return 'bg-orange-100 text-orange-700';
      case 'volunteer': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
        <button
          onClick={() => setShowComposeModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
        >
          <Plus size={20} />
          Compose Message
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-50 text-gray-900 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="all">All Types</option>
              <option value="welcome">Welcome</option>
              <option value="invitation">Invitation</option>
              <option value="follow-up">Follow-up</option>
              <option value="care">Care</option>
              <option value="discipleship">Discipleship</option>
              <option value="volunteer">Volunteer</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 text-gray-900 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="replied">Replied</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {message.leader.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-gray-900 font-semibold truncate">{message.subject}</h4>
                    <span className="text-gray-400 text-sm flex items-center gap-1 flex-shrink-0 ml-2">
                      <Clock size={14} />
                      {message.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-600 text-sm">From: {message.leader}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-600 text-sm">{message.member}</span>
                  </div>
                  <p className="text-gray-500 text-sm truncate mb-2">{message.message}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(message.type)}`}>
                      {message.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                    <span className="text-gray-400 text-xs">{message.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Compose New Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Recipient (Member)</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter member name"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Message Type</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                  <option value="">Select type</option>
                  <option value="welcome">Welcome</option>
                  <option value="invitation">Invitation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="care">Care</option>
                  <option value="discipleship">Discipleship</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Message</label>
                <textarea
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                  placeholder="Type your message..."
                  rows={5}
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Message Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold">
                    {selectedMessage.leader.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{selectedMessage.leader}</p>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <Clock size={14} />
                    {selectedMessage.date} at {selectedMessage.time}
                  </p>
                </div>
              </div>
              
              <div>
                <span className="text-gray-600 text-sm">To:</span>
                <p className="text-gray-900 font-medium">{selectedMessage.member}</p>
              </div>
              
              <div>
                <span className="text-gray-600 text-sm">Subject:</span>
                <p className="text-gray-900 font-medium">{selectedMessage.subject}</p>
              </div>
              
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedMessage.type)}`}>
                  {selectedMessage.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                  {selectedMessage.status}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-600 text-sm block mb-2">Message:</span>
                <p className="text-gray-900">{selectedMessage.message}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl transition-colors"
              >
                Close
              </button>
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2">
                <Mail size={18} />
                Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
