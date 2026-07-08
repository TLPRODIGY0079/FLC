import { Mail, Phone, MapPin, Calendar, Award } from 'lucide-react';

const leaderData = {
  name: 'Pastor Michael',
  role: 'Senior Pastor',
  branch: 'North Branch',
  avatar: 'PM',
  stats: {
    soulsWon: 156,
    visits: 89,
    calls: 234,
    fellowships: 45,
  },
  recentReports: [
    { id: 1, type: 'Outreach', details: '8 Souls Won - 12 Members Visited', date: '2 days ago' },
    { id: 2, type: 'Fellowship', details: '1 Fellowship Held - 15 Attendees', date: '5 days ago' },
    { id: 3, type: 'Visitation', details: '6 Members Visited - 8 Calls Made', date: '1 week ago' },
    { id: 4, type: 'Outreach', details: '5 Souls Won - 10 Members Visited', date: '2 weeks ago' },
  ],
  about: 'Pastor Michael has been serving the church for over 15 years. He is passionate about evangelism and discipleship, leading numerous outreach programs and mentoring young leaders.',
};

export default function LeaderProfile() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-3xl font-bold">{leaderData.avatar}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{leaderData.name}</h2>
            <p className="text-red-600 font-medium mb-1">{leaderData.role}</p>
            <p className="text-gray-500 text-sm mb-4">{leaderData.branch}</p>
            
            <div className="flex justify-center gap-3 mb-6">
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <Mail size={18} className="text-gray-500" />
              </button>
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <Phone size={18} className="text-gray-500" />
              </button>
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <MapPin size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <Award size={18} className="text-red-600" />
                About
              </h3>
              <p className="text-gray-600 text-sm text-left">{leaderData.about}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{leaderData.stats.soulsWon}</p>
                <p className="text-gray-500 text-sm">Souls Won</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{leaderData.stats.visits}</p>
                <p className="text-gray-500 text-sm">Visits</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{leaderData.stats.calls}</p>
                <p className="text-gray-500 text-sm">Calls</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-500">{leaderData.stats.fellowships}</p>
                <p className="text-gray-500 text-sm">Fellowships</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-red-600" />
              Recent Reports
            </h3>
            <div className="space-y-3">
              {leaderData.recentReports.map((report) => (
                <div key={report.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        {report.type}
                      </span>
                    </div>
                    <p className="text-gray-900 text-sm">{report.details}</p>
                  </div>
                  <span className="text-gray-400 text-sm whitespace-nowrap">{report.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
