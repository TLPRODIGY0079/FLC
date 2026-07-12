import { useState, useEffect } from 'react';
import SummaryCards from '../components/SummaryCards';
import RecentActivity from '../components/RecentActivity';
import { Image as ImageIcon, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          profiles:leader_id (full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <SummaryCards />
      
      <div className="mb-6">
        <RecentActivity />
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
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-red-600 animate-spin" size={32} />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No ministry reports yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl mb-3">
                  {report.photos && report.photos.length > 0 ? (
                    <img
                      src={report.photos[0]}
                      alt={report.activity_type}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      <ImageIcon size={32} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full capitalize">
                    {report.activity_type}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-900 font-medium text-sm">
                    {report.profiles?.full_name || 'Unknown Leader'}
                  </p>
                  <p className="text-gray-500 text-xs">{report.location}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar size={12} />
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
