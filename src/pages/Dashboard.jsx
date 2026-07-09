import SummaryCards from '../components/SummaryCards';
import RecentActivity from '../components/RecentActivity';
import MinistryChart from '../components/MinistryChart';
import { Image as ImageIcon, Calendar } from 'lucide-react';

const recentReports = [
  {
    id: 1,
    leader: 'Pastor Michael',
    type: 'Outreach',
    location: 'Main Branch',
    date: '2025-07-08',
    image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    leader: 'Deborah Sarah',
    type: 'Visitation',
    location: 'North Branch',
    date: '2025-07-07',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    leader: 'Elder David',
    type: 'Fellowship',
    location: 'South Branch',
    date: '2025-07-06',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    leader: 'Sister Grace',
    type: 'Outreach',
    location: 'East Branch',
    date: '2025-07-05',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
  },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      <SummaryCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <MinistryChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ImageIcon size={20} className="text-red-600" />
            Recent Ministry Reports
          </h3>
          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentReports.map((report) => (
            <div key={report.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-3">
                <img
                  src={report.image}
                  alt={report.type}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  {report.type}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-900 font-medium text-sm">{report.leader}</p>
                <p className="text-gray-500 text-xs">{report.location}</p>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Calendar size={12} />
                  {report.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
