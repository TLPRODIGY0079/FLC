import { Users, Home, Phone, Heart } from 'lucide-react';

const cards = [
  {
    title: 'Souls Won',
    value: 45,
    change: '+12%',
    icon: Users,
    color: 'bg-red-600',
    iconBg: 'bg-red-100',
    textColor: 'text-red-600',
  },
  {
    title: 'Members Visited',
    value: 32,
    change: '+6%',
    icon: Home,
    color: 'bg-blue-600',
    iconBg: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  {
    title: 'Calls Made',
    value: 140,
    change: '+15%',
    icon: Phone,
    color: 'bg-green-600',
    iconBg: 'bg-green-100',
    textColor: 'text-green-600',
  },
  {
    title: 'Fellowships Held',
    value: 18,
    change: '+5%',
    icon: Heart,
    color: 'bg-red-500',
    iconBg: 'bg-red-100',
    textColor: 'text-red-500',
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.iconBg} p-4 rounded-xl`}>
                <Icon size={24} className={card.textColor} />
              </div>
              <span className="text-green-500 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">{card.change}</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
