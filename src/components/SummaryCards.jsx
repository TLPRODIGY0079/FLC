import { useState, useEffect } from 'react';
import { Users, Home, Phone, Heart, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SummaryCards() {
  const [stats, setStats] = useState({
    soulsWon: 0,
    membersVisited: 0,
    callsMade: 0,
    fellowshipsHeld: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: reports, error } = await supabase
        .from('reports')
        .select('souls_won, members_visited, calls_made, activity_type');

      if (error) throw error;

      if (reports && reports.length > 0) {
        const totals = reports.reduce(
          (acc, report) => ({
            soulsWon: acc.soulsWon + (report.souls_won || 0),
            membersVisited: acc.membersVisited + (report.members_visited || 0),
            callsMade: acc.callsMade + (report.calls_made || 0),
            fellowshipsHeld:
              acc.fellowshipsHeld +
              (report.activity_type === 'fellowship' ? 1 : 0),
          }),
          { soulsWon: 0, membersVisited: 0, callsMade: 0, fellowshipsHeld: 0 }
        );
        setStats(totals);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Souls Won',
      value: stats.soulsWon,
      change: '+12%',
      icon: Users,
      color: 'bg-red-600',
      iconBg: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      title: 'Members Visited',
      value: stats.membersVisited,
      change: '+6%',
      icon: Home,
      color: 'bg-blue-600',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Calls Made',
      value: stats.callsMade,
      change: '+15%',
      icon: Phone,
      color: 'bg-green-600',
      iconBg: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Fellowships Held',
      value: stats.fellowshipsHeld,
      change: '+5%',
      icon: Heart,
      color: 'bg-red-500',
      iconBg: 'bg-red-100',
      textColor: 'text-red-500',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-center h-32"
          >
            <Loader2 className="animate-spin text-red-600" size={24} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.iconBg} p-4 rounded-xl`}>
                <Icon size={24} className={card.textColor} />
              </div>
              {card.value > 0 && (
                <span className="text-green-500 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
                  {card.change}
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {card.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
