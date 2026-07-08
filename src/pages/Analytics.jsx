import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', soulsWon: 120, calls: 450, fellowships: 25, visits: 180 },
  { month: 'Feb', soulsWon: 150, calls: 520, fellowships: 30, visits: 210 },
  { month: 'Mar', soulsWon: 180, calls: 580, fellowships: 35, visits: 250 },
  { month: 'Apr', soulsWon: 140, calls: 490, fellowships: 28, visits: 195 },
  { month: 'May', soulsWon: 200, calls: 620, fellowships: 40, visits: 280 },
  { month: 'Jun', soulsWon: 175, calls: 550, fellowships: 32, visits: 235 },
];

const stats = [
  { label: 'Total Souls Won', value: 965, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { label: 'Total Calls', value: 3210, color: 'text-green-600', bgColor: 'bg-green-100' },
  { label: 'Total Fellowships', value: 190, color: 'text-red-500', bgColor: 'bg-red-100' },
  { label: 'Total Visits', value: 1350, color: 'text-blue-600', bgColor: 'bg-blue-100' },
];

export default function Analytics() {
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
            <Bar dataKey="soulsWon" fill="#8b5cf6" name="Souls Won" radius={[8, 8, 0, 0]} />
            <Bar dataKey="calls" fill="#22c55e" name="Calls" radius={[8, 8, 0, 0]} />
            <Bar dataKey="fellowships" fill="#ef4444" name="Fellowships" radius={[8, 8, 0, 0]} />
            <Bar dataKey="visits" fill="#3b82f6" name="Visits" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
