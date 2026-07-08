const activities = [
  {
    id: 1,
    leader: 'Pastor Michael',
    type: 'Outreach',
    details: '4 Souls Won - 6 Members Visited',
    time: '2 hours ago',
    avatar: 'PM',
  },
  {
    id: 2,
    leader: 'Deborah Sarah',
    type: 'Visitation',
    details: '3 Members Visited - 2 Calls Made',
    time: '4 hours ago',
    avatar: 'DS',
  },
  {
    id: 3,
    leader: 'Elder David',
    type: 'Fellowship',
    details: '1 Fellowship Held - 8 Souls Won',
    time: '6 hours ago',
    avatar: 'ED',
  },
  {
    id: 4,
    leader: 'Sister Grace',
    type: 'Outreach',
    details: '2 Souls Won - 4 Calls Made',
    time: '8 hours ago',
    avatar: 'SG',
  },
  {
    id: 5,
    leader: 'Brother James',
    type: 'Visitation',
    details: '5 Members Visited',
    time: '12 hours ago',
    avatar: 'BJ',
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-sm font-semibold">{activity.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-gray-900 font-medium truncate">{activity.leader}</p>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                  {activity.type}
                </span>
              </div>
              <p className="text-gray-600 text-sm truncate">{activity.details}</p>
            </div>
            <span className="text-gray-400 text-sm whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
