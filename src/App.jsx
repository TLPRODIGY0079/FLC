import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/SubmitReport';
import Members from './pages/Members';
import Analytics from './pages/Analytics';
import Branches from './pages/Branches';
import LeaderProfile from './pages/LeaderProfile';
import FollowUps from './pages/FollowUps';
import Leaders from './pages/Leaders';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('/');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <Dashboard />;
      case '/reports':
        return <SubmitReport />;
      case '/members':
        return <Members />;
      case '/follow-ups':
        return <FollowUps />;
      case '/analytics':
        return <Analytics />;
      case '/branches':
        return <Branches />;
      case '/leaders':
        return <Leaders />;
      case '/calendar':
        return <Calendar />;
      case '/messages':
        return <Messages />;
      case '/settings':
        return <Settings />;
      case '/leader-profile':
        return <LeaderProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
