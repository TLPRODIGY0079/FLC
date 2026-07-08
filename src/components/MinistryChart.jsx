import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', soulsWon: 8, visits: 12, calls: 25, fellowships: 2 },
  { day: 'Tue', soulsWon: 12, visits: 8, calls: 30, fellowships: 3 },
  { day: 'Wed', soulsWon: 6, visits: 15, calls: 20, fellowships: 1 },
  { day: 'Thu', soulsWon: 10, visits: 10, calls: 35, fellowships: 4 },
  { day: 'Fri', soulsWon: 15, visits: 18, calls: 40, fellowships: 2 },
  { day: 'Sat', soulsWon: 20, visits: 25, calls: 50, fellowships: 5 },
  { day: 'Sun', soulsWon: 25, visits: 30, calls: 60, fellowships: 6 },
];

export default function MinistryChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ministry Overview (This Week)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="day" 
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
          <Line 
            type="monotone" 
            dataKey="soulsWon" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            name="Souls Won"
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="visits" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Visits"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="calls" 
            stroke="#22c55e" 
            strokeWidth={3}
            name="Calls"
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="fellowships" 
            stroke="#ef4444" 
            strokeWidth={3}
            name="Fellowships"
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
