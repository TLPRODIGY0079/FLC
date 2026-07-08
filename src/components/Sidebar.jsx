import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  PhoneCall, 
  GitBranch, 
  User, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Users, label: 'Members', path: '/members' },
  { icon: PhoneCall, label: 'Follow Ups', path: '/follow-ups' },
  { icon: GitBranch, label: 'Branches', path: '/branches' },
  { icon: User, label: 'Leaders', path: '/leaders' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar({ currentPage, setCurrentPage, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gradient-to-b from-red-900 to-red-800 min-h-screen p-6 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">Church Ministry</h1>
            <p className="text-red-200 text-sm">Management System</p>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-red-200 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      setCurrentPage(item.path);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-white text-red-900 shadow-lg' 
                        : 'text-red-100 hover:bg-red-700/50 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-100 hover:bg-red-700/50 hover:text-white transition-all mt-4">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );
}
