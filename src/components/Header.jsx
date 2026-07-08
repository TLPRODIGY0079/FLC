import { Bell, Search, Filter, Menu } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Good Morning, Bishop John! 👋</h2>
          <p className="text-gray-500 text-sm">{getCurrentDate()}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 text-gray-900 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 w-64"
          />
        </div>
        
        <button className="hidden md:flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md">
          <Filter size={18} />
          <span>Filter</span>
        </button>
        
        <button className="relative p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white font-semibold">BJ</span>
        </div>
      </div>
    </header>
  );
}
