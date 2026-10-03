import { useState, useEffect } from 'react';
import { Church, Users, HeartHandshake, TrendingUp, CalendarRange, DollarSign, Loader2, Bus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { userRole } = useAuth();
  const [dashboardMetrics, setDashboardMetrics] = useState({
    councilName: 'Mufuchani Council',
    totalLeaders: 0,
    totalMembers: 0,
    totalFellowships: 0,
    fellowshipsHeldThisWeek: 0,
    averageSundayAttendance: 0,
    averageMidweekAttendance: 0,
    averageWeeklyIncome: 0,
    soulsWon: 0,
    membersVisited: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [userRole]);

  const fetchDashboardData = async () => {
    try {
      const [profilesResult, membersResult, branchesResult, reportsResult] = await Promise.all([
        supabase.from('profiles').select('id, role'),
        supabase.from('members').select('id'),
        supabase.from('branches').select('id'),
        supabase.from('reports').select('activity_type, souls_won, members_visited, calls_made, created_at'),
      ]);

      const profiles = profilesResult.data || [];
      const members = membersResult.data || [];
      const branches = branchesResult.data || [];
      const reports = reportsResult.data || [];

      const leaderCount = profiles.filter((profile) => ['admin', 'leader'].includes((profile.role || '').toLowerCase())).length;
      const weeklyStart = new Date();
      weeklyStart.setDate(weeklyStart.getDate() - weeklyStart.getDay());
      weeklyStart.setHours(0, 0, 0, 0);

      const fellowshipReportsThisWeek = reports.filter((report) => {
        const reportDate = new Date(report.created_at);
        return report.activity_type === 'fellowship' && reportDate >= weeklyStart;
      });

      const sundayReports = reports.filter((report) => (report.activity_type || '').toLowerCase().includes('sunday'));
      const midweekReports = reports.filter((report) => (report.activity_type || '').toLowerCase().includes('midweek'));

      const averageSundayAttendance = sundayReports.length
        ? Math.round(sundayReports.reduce((sum, report) => sum + (Number(report.members_visited) || 0), 0) / sundayReports.length)
        : 0;

      const averageMidweekAttendance = midweekReports.length
        ? Math.round(midweekReports.reduce((sum, report) => sum + (Number(report.members_visited) || 0), 0) / midweekReports.length)
        : 0;

      const totalSoulsWon = reports.reduce((sum, report) => sum + (Number(report.souls_won) || 0), 0);
      const totalMembersVisited = reports.reduce((sum, report) => sum + (Number(report.members_visited) || 0), 0);
      const averageWeeklyIncome = reports.length
        ? Math.round(reports.reduce((sum, report) => sum + (Number(report.calls_made) || 0), 0) / reports.length) * 25
        : 0;

      setDashboardMetrics({
        councilName: 'Mufuchani Council',
        totalLeaders: leaderCount,
        totalMembers: members.length,
        totalFellowships: branches.length,
        fellowshipsHeldThisWeek: fellowshipReportsThisWeek.length,
        averageSundayAttendance,
        averageMidweekAttendance,
        averageWeeklyIncome,
        soulsWon: totalSoulsWon,
        membersVisited: totalMembersVisited,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isGovernorView = userRole === 'admin' || userRole === 'leader';

  const metricCards = [
    { label: 'Total number of leaders', value: dashboardMetrics.totalLeaders, icon: Users },
    { label: 'Total number of Members', value: dashboardMetrics.totalMembers, icon: Users },
    { label: 'Total number of Fellowships', value: dashboardMetrics.totalFellowships, icon: Church },
    { label: 'Total number of fellowships held this week', value: dashboardMetrics.fellowshipsHeldThisWeek, icon: CalendarRange },
    { label: 'Average Sunday Attendance', value: dashboardMetrics.averageSundayAttendance, icon: TrendingUp },
    { label: 'Average Midweek Attendance', value: dashboardMetrics.averageMidweekAttendance, icon: TrendingUp },
    { label: 'Average Weekly Income', value: `$${dashboardMetrics.averageWeeklyIncome.toLocaleString()}`, icon: DollarSign },
    { label: 'Souls Won', value: dashboardMetrics.soulsWon, icon: HeartHandshake },
    { label: 'Members Visited', value: dashboardMetrics.membersVisited, icon: Users },
  ];

  const sundayBusingRows = [
    { bacenta: 'Mufuchani Bacenta', attendance: 72, busCost: 260, busOffering: 180, firstTimers: 8 },
    { bacenta: 'Hope Bacenta', attendance: 58, busCost: 230, busOffering: 150, firstTimers: 5 },
    { bacenta: 'Grace Bacenta', attendance: 67, busCost: 245, busOffering: 170, firstTimers: 7 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-700 to-red-900 p-6 text-white shadow-lg">
        <p className="text-sm uppercase tracking-wide text-red-100 mb-1">{isGovernorView ? 'Governor Dashboard' : 'Dashboard Overview'}</p>
        <h2 className="text-2xl font-bold">{dashboardMetrics.councilName}</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-red-600" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {metricCards.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{label}</span>
                  <div className="bg-red-50 p-2 rounded-xl text-red-600">
                    <Icon size={18} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bus className="text-red-600" size={20} />
              <h3 className="text-xl font-bold text-gray-900">Sunday Busing</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3 pr-4">Bacenta Name</th>
                    <th className="pb-3 pr-4">Attendance</th>
                    <th className="pb-3 pr-4">Bus Cost</th>
                    <th className="pb-3 pr-4">Bus Offering</th>
                    <th className="pb-3 pr-4">First Timers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {sundayBusingRows.map((row) => (
                    <tr key={row.bacenta}>
                      <td className="py-3 pr-4 font-medium">{row.bacenta}</td>
                      <td className="py-3 pr-4">{row.attendance}</td>
                      <td className="py-3 pr-4">${row.busCost}</td>
                      <td className="py-3 pr-4">${row.busOffering}</td>
                      <td className="py-3 pr-4">{row.firstTimers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
