import { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data: reports, error } = await supabase
        .from('reports')
        .select(`
          id,
          activity_type,
          souls_won,
          members_visited,
          calls_made,
          location,
          created_at,
          photos,
          profiles:leader_id (full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setActivities(reports || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getActivityDetails = (report) => {
    const details = [];
    if (report.souls_won > 0) details.push(`${report.souls_won} Souls Won`);
    if (report.members_visited > 0) details.push(`${report.members_visited} Members Visited`);
    if (report.calls_made > 0) details.push(`${report.calls_made} Calls Made`);
    return details.join(' - ') || 'Activity completed';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
    if (diffInHours > 0) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    }
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    if (diffInMinutes > 0) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    }
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-red-600" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      {activities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No recent activities</p>
          <p className="text-sm mt-1">Submit a report to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white text-sm font-semibold">
                  {getInitials(activity.profiles?.full_name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-900 font-medium truncate">
                    {activity.profiles?.full_name || 'Unknown Leader'}
                  </p>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium capitalize">
                    {activity.activity_type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm truncate">
                  {getActivityDetails(activity)}
                </p>
                {activity.location && (
                  <p className="text-gray-400 text-xs mt-1">📍 {activity.location}</p>
                )}
              </div>
              <span className="text-gray-400 text-sm whitespace-nowrap">
                {getTimeAgo(activity.created_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
