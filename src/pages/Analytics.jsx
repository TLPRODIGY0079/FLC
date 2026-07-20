import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function Analytics() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch all reports
      const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate total stats
      const totalSoulsWon = reports.reduce((sum, r) => sum + (r.souls_won || 0), 0);
      const totalCalls = reports.reduce((sum, r) => sum + (r.calls_made || 0), 0);
      const totalVisits = reports.reduce((sum, r) => sum + (r.members_visited || 0), 0);
      const totalFellowships = reports.filter(r => r.activity_type === 'fellowship').length;

      setStats([
        { label: 'Total Souls Won', value: totalSoulsWon, color: 'text-red-600', bgColor: 'bg-red-100' },
        { label: 'Total Calls', value: totalCalls, color: 'text-green-600', bgColor: 'bg-green-100' },
        { label: 'Total Fellowships', value: totalFellowships, color: 'text-red-500', bgColor: 'bg-red-100' },
        { label: 'Total Visits', value: totalVisits, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      ]);

      // Calculate monthly data for the chart
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();
      
      const monthlyStats = months.map((month, index) => {
        const monthReports = reports.filter(r => {
          const reportDate = new Date(r.created_at);
          return reportDate.getFullYear() === currentYear && reportDate.getMonth() === index;
        });

        return {
          month,
          soulsWon: monthReports.reduce((sum, r) => sum + (r.souls_won || 0), 0),
          calls: monthReports.reduce((sum, r) => sum + (r.calls_made || 0), 0),
          fellowships: monthReports.filter(r => r.activity_type === 'fellowship').length,
          visits: monthReports.reduce((sum, r) => sum + (r.members_visited || 0), 0),
        };
      });

      setMonthlyData(monthlyStats);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-red-600 animate-spin" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-gray-900 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Souls Won Overview (This Year)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#1f2937',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#374151' }}
            />
            <Bar dataKey="soulsWon" fill="#dc2626" name="Souls Won" radius={[8, 8, 0, 0]} />
            <Bar dataKey="calls" fill="#22c55e" name="Calls" radius={[8, 8, 0, 0]} />
            <Bar dataKey="fellowships" fill="#ef4444" name="Fellowships" radius={[8, 8, 0, 0]} />
            <Bar dataKey="visits" fill="#3b82f6" name="Visits" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
