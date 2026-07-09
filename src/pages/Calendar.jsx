import { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Heart, Phone, MapPin, Plus, Filter } from 'lucide-react';

const calendarEvents = [
  { id: 1, date: '2025-07-01', type: 'souls-won', title: '5 Souls Won - Outreach', leader: 'Pastor Michael', branch: 'Main Branch' },
  { id: 2, date: '2025-07-02', type: 'visit', title: 'Home Visit - John Family', leader: 'Deborah Sarah', branch: 'North Branch' },
  { id: 3, date: '2025-07-03', type: 'fellowship', title: 'Bible Study Fellowship', leader: 'Elder David', branch: 'South Branch' },
  { id: 4, date: '2025-07-04', type: 'call', title: 'Follow-up Calls - 12 members', leader: 'Sister Grace', branch: 'East Branch' },
  { id: 5, date: '2025-07-05', type: 'souls-won', title: '3 Souls Won - Street Evangelism', leader: 'Brother James', branch: 'West Branch' },
  { id: 6, date: '2025-07-06', type: 'visit', title: 'Hospital Visit - Maria', leader: 'Pastor Michael', branch: 'Main Branch' },
  { id: 7, date: '2025-07-07', type: 'fellowship', title: 'Sunday Service Fellowship', leader: 'Pastor John', branch: 'Central Branch' },
  { id: 8, date: '2025-07-08', type: 'souls-won', title: '8 Souls Won - Crusade', leader: 'Pastor Michael', branch: 'Main Branch' },
  { id: 9, date: '2025-07-10', type: 'visit', title: 'Youth Group Visit', leader: 'Brother James', branch: 'West Branch' },
  { id: 10, date: '2025-07-12', type: 'fellowship', title: 'Prayer Meeting', leader: 'Deborah Sarah', branch: 'North Branch' },
  { id: 11, date: '2025-07-14', type: 'call', title: 'Follow-up Calls - 8 members', leader: 'Elder David', branch: 'South Branch' },
  { id: 12, date: '2025-07-15', type: 'souls-won', title: '4 Souls Won - Home Fellowship', leader: 'Sister Grace', branch: 'East Branch' },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarEvents.filter(event => {
      const eventDate = event.date;
      const matchesDate = eventDate === dateStr;
      const matchesType = filterType === 'all' || event.type === filterType;
      return matchesDate && matchesType;
    });
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'souls-won': return 'bg-red-100 text-red-700 border-red-300';
      case 'visit': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'fellowship': return 'bg-green-100 text-green-700 border-green-300';
      case 'call': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'souls-won': return <Heart size={12} />;
      case 'visit': return <MapPin size={12} />;
      case 'fellowship': return <Users size={12} />;
      case 'call': return <Phone size={12} />;
      default: return null;
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ministry Calendar</h2>
        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white text-gray-900 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 shadow-sm"
          >
            <option value="all">All Activities</option>
            <option value="souls-won">Souls Won</option>
            <option value="visit">Visits</option>
            <option value="fellowship">Fellowships</option>
            <option value="call">Calls</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md"
          >
            <Plus size={20} />
            Add Event
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h3 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {dayNames.map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="bg-gray-50 p-2 min-h-24" />;
            }
            const events = getEventsForDate(day);
            const isToday = day.toDateString() === today.toDateString();
            
            return (
              <div
                key={index}
                className={`bg-white p-2 min-h-24 hover:bg-gray-50 transition-colors cursor-pointer ${isToday ? 'bg-purple-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-red-600' : 'text-gray-900'}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {events.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1`}
                    >
                      {getEventTypeIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{events.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300 flex items-center justify-center">
              <Heart size={12} className="text-purple-700" />
            </div>
            <span className="text-sm text-gray-600">Souls Won</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300 flex items-center justify-center">
              <MapPin size={12} className="text-blue-700" />
            </div>
            <span className="text-sm text-gray-600">Visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300 flex items-center justify-center">
              <Users size={12} className="text-green-700" />
            </div>
            <span className="text-sm text-gray-600">Fellowships</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300 flex items-center justify-center">
              <Phone size={12} className="text-orange-700" />
            </div>
            <span className="text-sm text-gray-600">Calls</span>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border ${getEventTypeColor(selectedEvent.type)}`}>
                <div className="flex items-center gap-2 mb-1">
                  {getEventTypeIcon(selectedEvent.type)}
                  <span className="font-medium capitalize">{selectedEvent.type.replace('-', ' ')}</span>
                </div>
                <p className="text-sm">{selectedEvent.title}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900 font-medium">{selectedEvent.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Leader:</span>
                <span className="text-gray-900 font-medium">{selectedEvent.leader}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Branch:</span>
                <span className="text-gray-900 font-medium">{selectedEvent.branch}</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedEvent(null)}
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Event</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Event Type</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200">
                  <option value="">Select type</option>
                  <option value="souls-won">Souls Won</option>
                  <option value="visit">Visit</option>
                  <option value="fellowship">Fellowship</option>
                  <option value="call">Call</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Leader</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200">
                  <option value="">Select leader</option>
                  <option value="Pastor Michael">Pastor Michael</option>
                  <option value="Deborah Sarah">Deborah Sarah</option>
                  <option value="Elder David">Elder David</option>
                  <option value="Sister Grace">Sister Grace</option>
                  <option value="Brother James">Brother James</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Branch</label>
                <select className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200">
                  <option value="">Select branch</option>
                  <option value="Main Branch">Main Branch</option>
                  <option value="North Branch">North Branch</option>
                  <option value="South Branch">South Branch</option>
                  <option value="East Branch">East Branch</option>
                  <option value="West Branch">West Branch</option>
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
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
